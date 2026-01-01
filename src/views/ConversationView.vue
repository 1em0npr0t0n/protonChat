<template>
  <div
    v-if="conversation"
    class="h-[10%] border-b bg-gray-200 border-gray-300 flex items-center justify-between px-[2%]"
  >
    <h3 class="text-sm font-bold underline inline-block">{{ conversation.title }}</h3>
    <span class="text-sm text-gray-500">{{ conversation.selectedModel }}</span>
  </div>
  <div class="w-[80%] h-[75%] mt-[5px] mx-auto grid grid-cols-1 grid-rows-5 gap-4 overflow-y-auto">
    <MessageList :messages="ms.list" />
  </div>
  <div class="w-[80%] h-[15%] flex justify-between items-center mx-auto">
    <MassageInput v-model="message" class="w-full" @on-click="onClick" />
  </div>
</template>
<script lang="ts" setup>
import { MessageProps, ConversationProps } from '../types';
import MessageList from '../components/MessageList.vue';
import MassageInput from '../components/MassageInput.vue';
import { ref, watch, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { messages, conversations } from '../testData';
import { db } from '../db/db';
const ms = reactive<{ list: MessageProps[] }>({ list: [] });
const message = ref('');
const conversation = ref<ConversationProps>();
const route = useRoute();
let conversationId = Number(route.params.id as string);
let lastQuestion = '';
const initMessageId = Number(route.query.init as string);

const creatingInitMessage = async () => {
  const createdData: Omit<MessageProps, 'id'> = {
    conversationId,
    type: 'answer',
    content: message.value,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statue: 'loading',
  };
  const newMessageId = await db.messages.add(createdData);
  ms.list.push({ id: newMessageId, ...createdData });
  if (conversation.value) {
    const provider = await db.providers.where({ id: conversation.value?.providerId }).first();
    if (provider) {
      await window.electronAPI.startChat({
        messageId: newMessageId,
        providerName: provider?.name || '',
        selectedModel: conversation.value?.selectedModel || '',
        content: lastQuestion,
      });
    }
  }
};
function onClick() {
  console.log(ms);
}

ms.list = messages.filter((item) => item.conversationId === conversationId);
conversation.value = conversations.find((item) => Number(item.id) === conversationId);
watch(
  () => route.params.id,
  async (newVal: string) => {
    //, oldVal: string
    conversationId = Number(newVal);
    conversation.value = await db.conversations.where({ id: conversationId }).first();
    ms.list = await db.messages.where({ conversationId }).toArray();
  }
);
onMounted(async () => {
  conversation.value = await db.conversations.where({ id: conversationId }).first();
  ms.list = await db.messages.where({ conversationId }).toArray();
  if (initMessageId) {
    const lastMessage = await db.messages.where({ conversationId }).last();
    lastQuestion = lastMessage?.content || '';
    await creatingInitMessage();
  }
  window.electronAPI.onUpdateMessage(async (streamData) => {
    console.log(streamData);
    const { messageId, data } = streamData;
    const currentMessage = await db.messages.where({ id: messageId }).first();
    if (currentMessage) {
      const updateData: Omit<MessageProps, 'id' | 'createdAt' | 'conversationId'> = {
        type: 'answer',
        content: currentMessage.content + data.delta,
        updatedAt: new Date().toISOString(),
        statue: data.isFinished ? 'finished' : 'streaming',
      };
      await db.messages.update(messageId, updateData);
      const index = ms.list.findIndex((Item) => Item.id === messageId);
      if (index !== -1) {
        ms.list[index] = { ...ms.list[index], ...updateData };
      }
    }
  });
});
</script>
