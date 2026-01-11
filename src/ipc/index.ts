import { BrowserWindow } from 'electron';
import { registerFileHandlers } from './fileHandlers';
import { registerSettingsHandlers } from './settingsHandlers';
import { registerChatHandlers } from './chatHandlers';
import { registerMenuHandlers } from './menuHandlers';

/**
 * 注册所有 IPC 处理器
 * @param mainWindow 主窗口引用
 * @param currentLanguage 当前语言引用（用于更新）
 */
export function registerIpcHandlers(
  mainWindow: BrowserWindow | null,
  currentLanguage: { value: string }
): void {
  registerFileHandlers();
  registerSettingsHandlers(mainWindow, currentLanguage);
  registerChatHandlers(mainWindow);
  registerMenuHandlers(mainWindow);
}
