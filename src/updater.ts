import { BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

/**
 * 配置自动更新功能
 * @param mainWindow 主窗口实例，用于显示更新对话框
 */
export function setupAutoUpdater(mainWindow: BrowserWindow | null) {
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
