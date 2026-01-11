import { defineStore } from 'pinia';

import { MessageProps } from '../types';
import { db } from '../db/db';
export interface MessageStore {
  messages: MessageProps[];
}
export const useMessageStore = defineStore('message', {
  state: (): MessageStore => ({
    messages: [],
  }),
  actions: {
    async fetchMessages() {
      const items = await db.messages.toArray();
      this.messages = items;
    },
    async fetchMessagesbyConversationId(conversationId: number) {
      const items = await db.messages.where({ conversationId }).toArray();
      this.messages = items;
    },
    async createMessage(createData: Omit<MessageProps, 'id'>) {
      const newId = await db.messages.add(createData);
      //const newData: MessageProps = { id: String(newMessageId), ...createData };
      this.messages.push({ id: newId, ...createData });
      return newId;
    },
    async updateMessage(messageId: number, updatedData: Partial<MessageProps>) {
      // const { messageId, data } = streamData;
      // const currentMessage = this.messages.find((item) => item.id === messageId);

      // if (currentMessage) {
      //   const updateData: Omit<MessageProps, 'id' | 'createdAt' | 'conversationId'> = {
      //     type: 'answer',
      //     content: currentMessage.content + data.delta,
      //     updatedAt: new Date().toISOString(),
      //     statue: data.isFinished ? 'finished' : 'streaming',
      //   };
      await db.messages.update(messageId, updatedData);
      const index = this.messages.findIndex((Item) => Item.id === messageId);
      if (index !== -1) {
        this.messages[index] = {
          ...this.messages[index],
          ...updatedData,
        };
      }
      //}
    },
    async deleteMessagesByConversationId(conversationId: number) {
      // 从数据库删除指定对话的所有消息
      await db.messages.where({ conversationId }).delete();
      // 从状态中删除相关消息
      this.messages = this.messages.filter((item) => item.conversationId !== conversationId);
    },
  },
  getters: {
    getLastQuestion: (state) => (conversationId: number) => {
      return state.messages.findLast(
        (item) => item.conversationId === conversationId && item.type === 'question'
      );
    },
    isMessageLoading: (state) => () => {
      return state.messages.some(
        (item) => item.statue === 'loading' || item.statue === 'streaming'
      );
    },
  },
});
