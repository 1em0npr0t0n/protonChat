import { app, BrowserWindow, net, protocol, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import url from 'node:url';
import { initConfig, readSettings } from './config';
import { createAppMenu } from './menu/appMenu';
import { registerIpcHandlers } from './ipc';

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

// 保存主窗口引用和当前语言，用于菜单刷新
let mainWindow: BrowserWindow | null = null;
// 使用对象引用以便在 IPC 处理器中更新
const currentLanguage = { value: 'zh-CN' };

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    title: 'Proton Chat',
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
  // 注册所有 IPC 处理器
  registerIpcHandlers(mainWindow, currentLanguage);

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    // 在生产环境中，使用固定的窗口名称
    const rendererName =
      typeof MAIN_WINDOW_VITE_NAME !== 'undefined' ? MAIN_WINDOW_VITE_NAME : 'main_window';
    mainWindow.loadFile(path.join(__dirname, `../renderer/${rendererName}/index.html`));
  }
  if (!app.isPackaged) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }

  // 创建应用菜单
  await createAppMenu(mainWindow);
  // 初始化当前语言
  const settings = await readSettings();
  currentLanguage.value = settings.language || 'zh-CN';
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // 初始化配置
  await initConfig();
  await createWindow();

  // 配置自动更新（仅在打包后启用）
  if (app.isPackaged) {
    setupAutoUpdater();
  }
});

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

// 自动更新配置
function setupAutoUpdater() {
  // 配置自动更新日志
  autoUpdater.logger = log;

  // 检查更新（延迟3秒，等窗口完全加载）
  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify().catch((err) => {
      console.error('检查更新失败:', err);
    });
  }, 3000);

  // 更新可用
  autoUpdater.on('update-available', (info) => {
    console.log('发现新版本:', info.version);
    if (mainWindow) {
      dialog
        .showMessageBox(mainWindow, {
          type: 'info',
          title: '发现更新',
          message: `发现新版本 ${info.version}，正在后台下载...`,
          buttons: ['确定'],
        })
        .catch((err) => console.error('显示更新对话框失败:', err));
    }
  });

  // 更新不可用
  autoUpdater.on('update-not-available', (info) => {
    console.log('当前已是最新版本:', info.version);
  });

  // 更新下载进度
  autoUpdater.on('download-progress', (progressObj) => {
    const message = `下载速度: ${progressObj.bytesPerSecond} - 已下载 ${progressObj.percent.toFixed(2)}% (${progressObj.transferred}/${progressObj.total})`;
    console.log(message);
  });

  // 更新下载完成
  autoUpdater.on('update-downloaded', () => {
    console.log('更新下载完成');
    if (mainWindow) {
      dialog
        .showMessageBox(mainWindow, {
          type: 'info',
          title: '更新就绪',
          message: '更新已下载完成，将在退出后自动安装。是否立即重启应用？',
          buttons: ['立即重启', '稍后'],
          defaultId: 0,
          cancelId: 1,
        })
        .then((result) => {
          if (result.response === 0) {
            autoUpdater.quitAndInstall(false, true);
          }
        })
        .catch((err) => console.error('显示更新对话框失败:', err));
    }
  });

  // 更新错误
  autoUpdater.on('error', (err) => {
    console.error('自动更新错误:', err);
  });
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
