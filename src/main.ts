import { app, BrowserWindow, ipcMain, net, protocol } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { CreateChatProps, UpdateStreamData } from './types';
import { BaiduOpenAI } from './services/baidu';
import { QwenOpenAI } from './services/qwen';
import url from 'node:url';
import { convertMessages } from './helper';
import fs from 'fs/promises';

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'safe-file',
    privileges: {
      standard: true,
    },
  },
]);
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  // 注册协议处理程序
  protocol.handle('safe-file', async (request) => {
    let filePath = request.url.replace('safe-file://', '');
    // Handle Windows absolute paths that start with drive letter
    if (process.platform === 'win32') {
      // If the path starts with / followed by a drive letter (like /c/Users/...),
      // convert it to a proper Windows path (c:\Users\...)

      if (/^[a-zA-Z]\//.test(filePath)) {
        filePath = filePath.substring(0, 1) + ':' + filePath.substring(1).replace(/\//g, '\\');
      } else if (/^\/[a-zA-Z]\//.test(filePath)) {
        filePath = filePath.substring(1, 2) + ':' + filePath.substring(2).replace(/\//g, '\\');
      }
    }
    const newFilePath = url.pathToFileURL(filePath).toString();
    return net.fetch(newFilePath);
  });
  ipcMain.handle('copy-image-to-user-dir', async (_event, fileName: string, base64Data: string) => {
    const UserDataPath = app.getPath('userData');
    const imagesDir = path.join(UserDataPath, 'images');
    await fs.mkdir(imagesDir, { recursive: true });
    //const fileName = path.basename(sourcePath);
    const destPath = path.join(imagesDir, fileName);
    const buffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(destPath, buffer);
    return destPath;
  });
  //
  ipcMain.on('start-chat', async (_event, args: CreateChatProps) => {
    console.log(args);
    const { providerName, messages, selectedModel, messageId } = args;
    const convertedMessages = await convertMessages(messages);
    let stream: any = null;
    if (providerName === 'ernie') {
      stream = null;
      const ernie = new BaiduOpenAI();
      console.log('messages', convertedMessages, 'selectedModel', selectedModel);
      stream = await ernie.chatMessage(convertedMessages, selectedModel);
    } else if (providerName === 'qwen') {
      stream = null;
      const qwen = new QwenOpenAI();
      // switch (selectedModel) {
      //   case 'qwen-plus':
      //     console.log('qwen-plusmessages', messages, 'selectedModel', selectedModel);
      //     stream = await qwen.chatMessage(messages, selectedModel);
      //     break;
      //   case 'qwen3-vl-plus':
      //     console.log('qwen3-vl-plusmessages', messages, 'selectedModel', selectedModel);
      //     break;
      //   case 'qwen-long':
      //     console.log('qwen-longmessages', messages, 'selectedModel', selectedModel);
      //     break;
      //   default:
      //     break;
      // }
      stream = await qwen.chatMessage(convertedMessages, selectedModel);
    }
    if (stream !== null) {
      for await (const chunk of stream) {
        //console.log(JSON.stringify(chunk));
        const delta = chunk.choices[0].delta.content;
        const isFinished = chunk.choices[0].finish_reason === 'stop';
        //携带终止信号
        if (delta || isFinished) {
          const returnData: UpdateStreamData = {
            messageId,
            data: {
              isFinished,
              delta: delta ?? '', // 可能为空
            },
          };
          mainWindow.webContents.send('update-message', returnData);
        }
      }
    } else {
      //为空
    }
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
