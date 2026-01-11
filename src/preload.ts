// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { CreateChatProps, OnUpdateMessage, AppSettings, ModelApiConfig } from './types';

contextBridge.exposeInMainWorld('electronAPI', {
  startChat: (data: CreateChatProps) => ipcRenderer.send('start-chat', data),
  onUpdateMessage: (callback: OnUpdateMessage) =>
    ipcRenderer.on('update-message', (_event, data) => callback(data)),
  copyImageToUserDir: (fileName: string, base64Data: string) =>
    ipcRenderer.invoke('copy-image-to-user-dir', fileName, base64Data),
  readSettings: () => ipcRenderer.invoke('read-settings') as Promise<Omit<AppSettings, 'id'>>,
  writeSettings: (settings: Omit<AppSettings, 'id'>) =>
    ipcRenderer.invoke('write-settings', settings) as Promise<boolean>,
  getProvidersConfigs: () =>
    ipcRenderer.invoke('get-providers-configs') as Promise<Record<string, ModelApiConfig>>,
  onNavigate: (callback: (path: string) => void) =>
    ipcRenderer.on('navigate', (_event, path: string) => callback(path)),
  showConversationContextMenu: (conversationId: number, x?: number, y?: number) =>
    ipcRenderer.send('show-conversation-context-menu', conversationId, x, y),
  onDeleteConversation: (callback: (conversationId: number) => void) =>
    ipcRenderer.on('delete-conversation', (_event, conversationId: number) =>
      callback(conversationId)
    ),
});
/**
 * //解开
 onUpdateMessage: function(callback) {
    return ipcRenderer.on('update-message', function(_event, data) {
        return callback(data);
    });
  } 
 */
