import { CreateChatProps, OnUpdateMessage, AppSettings, ModelApiConfig } from './types';

export interface IElectronAPI {
  startChat: (data: CreateChatProps) => void;
  onUpdateMessage: (callback: OnUpdateMessage) => any;
  copyImageToUserDir: (fileName: string, base64Data: string) => Promise<string>;
  copyFileToUserDir: (fileName: string, base64Data: string) => Promise<string>;
  readSettings: () => Promise<Omit<AppSettings, 'id'>>;
  writeSettings: (settings: Omit<AppSettings, 'id'>) => Promise<boolean>;
  getProvidersConfigs: () => Promise<Record<string, ModelApiConfig>>;
  onNavigate: (callback: (path: string) => void) => any;
  showConversationContextMenu: (conversationId: number, x?: number, y?: number) => void;
  onDeleteConversation: (callback: (conversationId: number) => void) => any;
}
declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
