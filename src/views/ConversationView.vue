<template>
  <div
    v-if="conversation"
    class="h-[10%] border-b bg-gray-200 border-gray-300 flex items-center justify-between px-[2%]"
  >
    <h3 class="text-sm font-bold underline inline-block">{{ conversation.title }}</h3>
    <span class="text-sm text-gray-500">{{ conversation.selectedModel }}</span>
  </div>
  <div class="w-[80%] h-[75%] mt-[5px] mx-auto grid grid-cols-1 grid-rows-5 gap-4 overflow-y-auto">
    <MessageList :messages="filteredMessages" />
  </div>
  <div class="w-[80%] h-[15%] flex justify-between items-center mx-auto">
    <MassageInput v-model="message" class="w-full" @on-click="onClick" />
  </div>
</template>
<script lang="ts" setup>
import { MessageProps } from '../types';
import MessageList from '../components/MessageList.vue';
import MassageInput from '../components/MassageInput.vue';
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
//import { messages } from '../testData';
import { db } from '../db/db';
import { useConversationStore } from '../stores/conversaation';
import { useMessageStore } from '../stores/messageStore';
const messageStore = useMessageStore();
const conversationStore = useConversationStore();
const filteredMessages = computed(() => messageStore.messages);
const message = ref('');
const route = useRoute();
let conversationId = ref(Number(route.params.id as string));
console.log('conversationId.value', conversationId.value);
let lastQuestion = computed(() => messageStore.getLastQuestion(conversationId.value));
const initMessageId = Number(route.query.init as string);
const conversation = computed(() => conversationStore.getConversationById(conversationId.value));
console.log('conversation.value', conversation.value);
const creatingInitMessage = async () => {
  const createdData: Omit<MessageProps, 'id'> = {
    conversationId: conversationId.value,
    type: 'answer',
    content: message.value,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statue: 'loading',
  };
  const newMessageId = await messageStore.createMessage(createdData);
  console.log('newMessageId', newMessageId, 'conversation', conversation.value);
  if (conversation.value) {
    console.log('conversation.value', conversation.value);
    const provider = await db.providers.where({ id: conversation.value?.providerId }).first();
    if (provider) {
      console.log('lastQuestion.value', lastQuestion.value, 'provider', provider);
      await window.electronAPI.startChat({
        messageId: newMessageId,
        providerName: provider?.name || '',
        selectedModel: conversation.value?.selectedModel || '',
        content: lastQuestion.value?.content || '',
      });
    }
  }
};
function onClick() {
  console.log(filteredMessages);
}

//filteredMessages.value = messages.filter((item) => item.conversationId === conversationId.value);

watch(
  () => route.params.id,
  async (newVal: string) => {
    //, oldVal: string
    conversationId.value = Number(newVal);

    await messageStore.fetchMessagesbyConversationId(conversationId.value);
  }
);
onMounted(async () => {
  await messageStore.fetchMessagesbyConversationId(conversationId.value);
  if (initMessageId) {
    console.log('initMessageId', initMessageId);
    await creatingInitMessage();
  }
  window.electronAPI.onUpdateMessage(async (streamData) => {
    console.log(streamData);
    //const { messageId, data } = streamData;
    messageStore.updateMessage(streamData);
  });
});
</script>
