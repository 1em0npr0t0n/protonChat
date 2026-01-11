import { Menu, BrowserWindow } from 'electron';
import { getMenuTranslations } from './i18n';

/**
 * 创建并显示对话列表项的上下文菜单
 * @param conversationId 对话ID
 * @param mainWindow 主窗口实例
 * @param x 鼠标X坐标
 * @param y 鼠标Y坐标
 */
export async function showConversationContextMenu(
  conversationId: number,
  mainWindow: BrowserWindow,
  x?: number,
  y?: number
) {
  // 获取国际化翻译
  const t = await getMenuTranslations();

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: t.deleteConversation,
      click: () => {
        // 发送删除对话的消息到渲染进程
        mainWindow.webContents.send('delete-conversation', conversationId);
      },
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  menu.popup({
    window: mainWindow,
    x,
    y,
  });
}