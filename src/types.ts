export interface ConversationProps {
  id: number;
  title: string;
  selectedModel: string;
  createdAt: string;
  updatedAt: string;
  providerId: number;
}
export interface ProviderProps {
  id: number;
  name: string;
  title?: string;
  desc?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  models: string[];
}
export type MessageStatus = 'loading' | 'streaming' | 'finished' | 'error';
export interface MessageProps {
  id: number;
  content: string;
  type: 'question' | 'answer';
  conversationId: number;
  statue?: MessageStatus;
  createdAt: string;
  updatedAt: string;
  imagePath?: string;
  filePath?: string;
}
export type ChatMessageImageContent = {
  type: string;
  text?: string;
  image_url?: {
    url: string;
  };
};
export interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string | ChatMessageImageContent[];
  imagePath?: string;
  filePath?: string;
}

export interface CreateChatProps {
  //content: string;
  messages: ChatMessageProps[];
  providerName: string;
  selectedModel: string;
  messageId: number;
}
export interface ChatCompletionChunk {
  isFinished: boolean;
  delta: string;
  isError?: boolean;
}
export interface UpdateStreamData {
  messageId: number;
  data: ChatCompletionChunk;
}
export type OnUpdateMessage = (data: UpdateStreamData) => void;

export interface MessageListInstance {
  ref: HTMLDivElement;
}

// 模型 API 配置
export interface ModelApiConfig {
  providerName: string; // 提供者名称，如 'qwen', 'ernie', 'deepseek'
  apiKey: string; // API 密钥
  baseURL: string; // API 基础 URL
}

// 应用配置
export interface AppSettings {
  id: number;
  language: string; // 当前语言，如 'zh-CN', 'en-US'
  fontSize: number; // 字体大小，单位 px
  modelApiConfigs?: ModelApiConfig[]; // 模型 API 配置列表
}
