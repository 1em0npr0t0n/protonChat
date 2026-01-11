import { ipcMain, BrowserWindow } from 'electron';
import { readSettings, writeSettings, refreshConfig, getProvidersConfigs } from '../config';
import { createAppMenu } from '../menu/appMenu';
import { AppSettings } from '../types';

/**
 * 注册设置相关的 IPC 处理器
 * @param mainWindow 主窗口引用
 * @param currentLanguage 当前语言引用（用于更新）
 */
export function registerSettingsHandlers(
  mainWindow: BrowserWindow | null,
  currentLanguage: { value: string }
): void {
  // 读取配置
  ipcMain.handle('read-settings', async () => {
    return await readSettings();
  });

  // 写入配置
  ipcMain.handle('write-settings', async (_event, settings: Omit<AppSettings, 'id'>) => {
    const previousLanguage = currentLanguage.value;
    await writeSettings(settings);
    // 更新当前语言
    currentLanguage.value = settings.language || 'zh-CN';
    // 配置更新后刷新配置缓存
    await refreshConfig();
    // 如果语言改变，刷新菜单
    if (previousLanguage !== currentLanguage.value && mainWindow) {
      await createAppMenu(mainWindow);
    }
    return true;
  });

  // 获取提供者配置
  ipcMain.handle('get-providers-configs', async () => {
    return await getProvidersConfigs();
  });
}
