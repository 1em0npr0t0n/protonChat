import { CreateChatProps, OnUpdateMessage } from './types';

export interface IElectronAPI {
  startChat: (data: CreateChatProps) => void;
  onUpdateMessage: (callback: OnUpdateMessage) => any;
  copyImageToUserDir: (fileName: string, base64Data: string) => Promise<string>;
}
declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
