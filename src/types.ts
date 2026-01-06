export interface ConversationProps {
  id: string;
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
export type MessageStatus = 'loading' | 'streaming' | 'finished';
export interface MessageProps {
  id: number;
  content: string;
  type: 'question' | 'answer';
  conversationId: number;
  statue?: MessageStatus;
  createdAt: string;
  updatedAt: string;
  imagePath?: string;
}
export type ChatMessageImageContent = {
  type: string;
  text?: string;
  image_url?: {
    url: string;
  };
};
export interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string | ChatMessageImageContent[];
  imagePath?: string;
}

export interface CreateChatProps {
  //content: string;
  messages: ChatMessageProps[];
  providerName: string;
  selectedModel: string;
  messageId: number;
}
export interface UpdateStreamData {
  messageId: number;
  data: { isFinished: boolean; delta: string };
}
export type OnUpdateMessage = (data: UpdateStreamData) => void;

export interface MessageListInstance {
  ref: HTMLDivElement;
}
