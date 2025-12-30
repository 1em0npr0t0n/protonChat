import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import fs from 'fs';
import { openai, chatFile } from './services/openai';
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

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  const fileObj = await openai.files.create({
    file: fs.createReadStream('src/public/htyc.docx'),
    purpose: 'file-extract' as any,
  });
  console.log(JSON.stringify(fileObj));
  const stream = await chatFile(fileObj.id);
  console.log(JSON.stringify(stream));

  /*
  let reasoningContent = '';
  let answerContent = '';
  let isAnswering = false;
  let enable_thinking = true;
  let messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
        { type: 'text', text: '这是什么？' },
      ],
    },
  ];
  try {
    const stream = await openai.chat.completions.create({
      model: 'qwen3-vl-plus',
      messages: messages,
      stream: true,
      // 注意：在 Node.js SDK，enable_thinking 这样的非标准参数作为顶层属性传递的，无需放在 extra_body 中
      //enable_thinking: enable_thinking,
      //thinking_budget: 81920
    });

    //if (enable_thinking){console.log('\n' + '='.repeat(20) + '思考过程' + '='.repeat(20) + '\n');}

    for await (const chunk of stream) {
      if (!chunk.choices?.length) {
        console.log('\nUsage:');
        console.log(chunk.usage);
        continue;
      }

      const delta = chunk.choices[0].delta;

      // // 处理思考过程
      // if (delta.reasoning_content) {
      //     process.stdout.write(delta.reasoning_content);
      //     reasoningContent += delta.reasoning_content;
      // }
      // 处理正式回复
      //else
      if (delta.content) {
        if (!isAnswering) {
          console.log('\n' + '='.repeat(20) + '完整回复' + '='.repeat(20) + '\n');
          isAnswering = true;
        }
        process.stdout.write(delta.content);
        answerContent += delta.content;
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
*/
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
