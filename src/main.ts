import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { CreateChatProps, UpdateStreamData } from './types';
import { BaiduOpenAI } from './services/baidu';
import { QwenOpenAI } from './services/qwen';

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

  //
  ipcMain.on('start-chat', async (_event, args: CreateChatProps) => {
    console.log(args);
    const { providerName, messages, selectedModel, messageId } = args;
    let stream: any = null;
    if (providerName === 'ernie') {
      stream = null;
      const ernie = new BaiduOpenAI();
      console.log('messages', messages, 'selectedModel', selectedModel);
      stream = await ernie.chatMessage(messages, selectedModel);
    } else if (providerName === 'qwen') {
      stream = null;
      const qwen = new QwenOpenAI();
      switch (selectedModel) {
        case 'qwen-plus':
          console.log('qwen-plusmessages', messages, 'selectedModel', selectedModel);
          stream = await qwen.chatMessage(messages, selectedModel);
          break;
        case 'qwen3-vl-plus':
          console.log('qwen3-vl-plusmessages', messages, 'selectedModel', selectedModel);
          break;
        case 'qwen-long':
          console.log('qwen-longmessages', messages, 'selectedModel', selectedModel);
          break;
        default:
          break;
      }
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
