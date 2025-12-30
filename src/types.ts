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
}

export interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}
