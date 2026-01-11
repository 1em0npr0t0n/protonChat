import { Menu, BrowserWindow, app } from 'electron';
import { getMenuTranslations } from './i18n';

/**
 * 创建应用菜单
 * @param mainWindow 主窗口实例
 */
export async function createAppMenu(mainWindow: BrowserWindow) {
  // 获取国际化翻译
  const t = await getMenuTranslations();

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: t.action,
      submenu: [
        {
          label: t.newChat,
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            // 发送导航消息到渲染进程
            mainWindow.webContents.send('navigate', '/');
          },
        },
        {
          label: t.appSettings,
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            // 发送导航消息到渲染进程
            mainWindow.webContents.send('navigate', '/setting');
          },
        },
        {
          type: 'separator',
        },
        {
          label: t.exit,
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            if (process.platform !== 'darwin') {
              mainWindow.close();
            }
          },
        },
      ],
    },
  ];

  // 在 macOS 上，第一个菜单项会被自动替换为应用名称
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          label: `${t.about} ${app.getName()}`,
          role: 'about',
        },
        {
          type: 'separator',
        },
        {
          label: t.services,
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: `${t.hide} ${app.getName()}`,
          accelerator: 'Command+H',
          role: 'hide',
        },
        {
          label: t.hideOthers,
          accelerator: 'Command+Shift+H',
          role: 'hideOthers',
        },
        {
          label: t.showAll,
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          label: t.exit,
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
