import Dexie, { EntityTable } from 'dexie';
import { providers } from '../testData';
import { ProviderProps, MessageProps, ConversationProps } from '../types';

export const db = new Dexie('ProtonChatDB') as Dexie & {
  providers: Dexie.Table<ProviderProps, 'id'>;
  messages: EntityTable<MessageProps, 'id'>;
  conversations: EntityTable<ConversationProps, 'id'>;
};
db.version(1).stores({
  providers: '++id,name',
  messages: '++id,conversationId',
  conversations: '++id,providerId',
});
export const initProviders = async () => {
  const count = await db.providers.count();
  if (count === 0) {
    db.providers.bulkAdd(providers);
  }
};
