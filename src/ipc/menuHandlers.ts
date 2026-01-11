import { ipcMain, BrowserWindow } from 'electron';
import { showConversationContextMenu } from '../menu/contextMenu';

/**
 * 注册菜单相关的 IPC 处理器
 * @param mainWindow 主窗口引用
 */
export function registerMenuHandlers(mainWindow: BrowserWindow | null): void {
  // 显示对话上下文菜单
  ipcMain.on(
    'show-conversation-context-menu',
    async (_event, conversationId: number, x?: number, y?: number) => {
      if (mainWindow) {
        await showConversationContextMenu(conversationId, mainWindow, x, y);
      }
    }
  );
}
