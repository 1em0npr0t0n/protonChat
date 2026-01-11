import { ipcMain, BrowserWindow } from 'electron';
import { CreateChatProps, UpdateStreamData } from '../types';
import { createProvider } from '../providers/createProvider';
import { refreshConfig } from '../config';

/**
 * 注册聊天相关的 IPC 处理器
 * @param mainWindow 主窗口引用
 */
export function registerChatHandlers(mainWindow: BrowserWindow | null): void {
  // 启动聊天
  ipcMain.on('start-chat', async (_event, args: CreateChatProps) => {
    console.log('args:', JSON.stringify(args));
    const { providerName, messages, selectedModel, messageId } = args;
    if (!mainWindow) return;
    try {
      // 在创建提供者之前刷新配置，确保使用最新配置
      await refreshConfig();
      const provider = await createProvider(providerName);
      const stream = await provider.chat(messages, selectedModel, false);
      for await (const chunk of stream) {
        const returnData: UpdateStreamData = {
          messageId,
          data: {
            isFinished: chunk.isFinished,
            delta: chunk.delta,
          },
        };
        mainWindow.webContents.send('update-message', returnData);
      }
    } catch (error) {
      console.error('启动聊天失败:', error);
      mainWindow.webContents.send('update-message', {
        messageId,
        data: {
          isFinished: false,
          delta: error instanceof Error ? error.message : '与ai对话失败',
          isError: true,
        },
      });
    }
  });
}
