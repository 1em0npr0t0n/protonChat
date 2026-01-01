import { CreateChatProps, OnUpdateMessage } from './types';

export interface IElectronAPI {
  startChat: (data: CreateChatProps) => void;
  onUpdateMessage: (callback: OnUpdateMessage) => any;
}
declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
