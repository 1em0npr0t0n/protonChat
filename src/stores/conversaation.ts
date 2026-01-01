import { defineStore } from 'pinia';
import { ConversationProps } from '../types';
import { db } from '../db/db';

export interface ConversationStore {
  conversations: ConversationProps[];
}
export const useConversationStore = defineStore('conversation', {
  state: (): ConversationStore => {
    return {
      conversations: [],
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
  },
  getters: {
    totalNumber: (state) => state.conversations.length,
    getConversationById: (state) => (id: number) => {
      return state.conversations.find((item) => item.id === String(id));
    },
  },
});
