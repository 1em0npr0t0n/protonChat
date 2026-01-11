import { defineStore } from 'pinia';
import { ConversationProps } from '../types';
import { db } from '../db/db';

export interface ConversationStore {
  conversations: ConversationProps[];
  selectedConversationId: number;
}
export const useConversationStore = defineStore('conversation', {
  state: (): ConversationStore => {
    return {
      conversations: [],
      selectedConversationId: -1,
    };
  },
  actions: {
    async fetchConversations() {
      const items = await db.conversations.toArray();
      this.conversations = items;
    },
    async createConversation(createData: Omit<ConversationProps, 'id'>) {
      const newId = await db.conversations.add(createData);
      //const newData: ConversationProps = { id: newMessageId, ...createData };
      this.conversations.push({ id: newId, ...createData });
      return newId;
    },
    async deleteConversation(conversationId: number) {
      // 从数据库删除对话
      await db.conversations.delete(conversationId);
      // 从状态中删除对话
      this.conversations = this.conversations.filter((item) => item.id !== conversationId);
      // 如果删除的是当前选中的对话，重置选中状态
      if (this.selectedConversationId === conversationId) {
        this.selectedConversationId = -1;
      }
    },
  },
  getters: {
    totalNumber: (state) => state.conversations.length,
    getConversationById: (state) => (id: number) => {
      return state.conversations.find((item) => item.id === id);
    },
  },
});
