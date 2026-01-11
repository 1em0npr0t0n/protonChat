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
      //const newData: ConversationProps = { id: String(newMessageId), ...createData };
      this.conversations.push({ id: String(newId), ...createData });
      return newId;
    },
    async deleteConversation(conversationId: number) {
      // 从数据库删除对话
      // 注意：虽然类型定义中 id 是 string，但数据库 schema 使用 '++id'，实际主键是 number
      // 所以需要使用类型断言来绕过类型检查
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.conversations as any).delete(conversationId);
      // 从状态中删除对话
      this.conversations = this.conversations.filter((item) => Number(item.id) !== conversationId);
      // 如果删除的是当前选中的对话，重置选中状态
      if (this.selectedConversationId === conversationId) {
        this.selectedConversationId = -1;
      }
    },
  },
  getters: {
    totalNumber: (state) => state.conversations.length,
    getConversationById: (state) => (id: number) => {
      return state.conversations.find((item) => Number(item.id) === id);
    },
  },
});
