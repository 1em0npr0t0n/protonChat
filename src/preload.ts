// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { CreateChatProps, OnUpdateMessage } from './types';

contextBridge.exposeInMainWorld('electronAPI', {
  startChat: (data: CreateChatProps) => ipcRenderer.send('start-chat', data),
  onUpdateMessage: (callback: OnUpdateMessage) =>
    ipcRenderer.on('update-message', (_event, data) => callback(data)),
});
/**
 * //解开
 onUpdateMessage: function(callback) {
    return ipcRenderer.on('update-message', function(_event, data) {
        return callback(data);
    });
  } 
 */
