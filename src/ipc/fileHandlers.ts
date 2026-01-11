import { app, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'fs/promises';

/**
 * 注册文件相关的 IPC 处理器
 */
export function registerFileHandlers(): void {
  // 复制图片到用户目录
  ipcMain.handle('copy-image-to-user-dir', async (_event, fileName: string, base64Data: string) => {
    const UserDataPath = app.getPath('userData');
    const imagesDir = path.join(UserDataPath, 'images');
    await fs.mkdir(imagesDir, { recursive: true });
    const destPath = path.join(imagesDir, fileName);
    const buffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(destPath, buffer);
    return destPath;
  });

  // 复制文件到用户目录
  ipcMain.handle('copy-file-to-user-dir', async (_event, fileName: string, base64Data: string) => {
    const UserDataPath = app.getPath('userData');
    const filesDir = path.join(UserDataPath, 'files');
    await fs.mkdir(filesDir, { recursive: true });
    const destPath = path.join(filesDir, fileName);
    const buffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(destPath, buffer);
    return destPath;
  });
}
