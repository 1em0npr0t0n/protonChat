<template>
  <div
    v-if="conversation"
    class="h-[10%] border-b border-gray-300 flex items-center justify-between px-[10%]"
  >
    <h3 class="text-sm font-bold underline inline-block">{{ conversation.title }}</h3>
    <span class="text-sm text-gray-500">{{ conversation.selectedModel }}</span>
  </div>
  <div class="w-[80%] h-[75%] mx-auto grid grid-cols-1 grid-rows-5 gap-4 overflow-y-auto">
    <MessageList :messages="ms.list" />
  </div>
  <div class="w-[80%] h-[15%] flex justify-between items-center mx-auto">
    <MassageInput class="w-full" v-model="message" @onClick="onClick" />
  </div>
</template>
<script lang="ts" setup>
import { MessageProps, ConversationProps } from '../types';
import MessageList from '../components/MessageList.vue';
import MassageInput from '../components/MassageInput.vue';
import { ref, watch, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { messages, conversations } from '../testData';
const ms = reactive<{ list: MessageProps[] }>({ list: [] });
const message = ref('');
const conversation = ref<ConversationProps>();
const route = useRoute();

function onClick() {
  console.log(ms);
}

let conversationId = Number(route.params.id);
ms.list = messages.filter((item) => item.conversationId === conversationId);

conversation.value = conversations.find((item) => Number(item.id) === conversationId);
watch(
  () => route.params.id,
  (newVal: string, oldVal: string) => {
    conversationId = Number(route.params.id);
    ms.list = messages.filter((item) => item.conversationId === conversationId);

    conversation.value = conversations.find((item) => Number(item.id) === conversationId);
  }
);
</script>
