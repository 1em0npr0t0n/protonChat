import { defineStore } from 'pinia';
import { ProviderProps } from '../types';
import { db } from '../db/db';
export interface ProviderStore {
  providers: ProviderProps[];
}
export const useProviderStore = defineStore('provider', {
  state: (): ProviderStore => ({
    providers: [],
  }),
  actions: {
    async fetchProviders() {
      const items = await db.providers.toArray();
      this.providers = items;
    },
  },
  getters: {
    getProviderById: (state) => (id: number) => {
      return state.providers.find((item) => Number(item.id) === id);
    },
  },
});
