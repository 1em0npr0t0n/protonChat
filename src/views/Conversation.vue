<template>
  <div class="w-[80%] h-[85%] mx-auto grid grid-cols-1 grid-rows-5 gap-4 overflow-y-auto">
    <h1 class="text-3xl font-bold underline">Conversation</h1>
    <MessageList :messages="messages" />
  </div>
  <div class="w-[80%] h-[15%] flex justify-between items-center mx-auto">
    <MassageInput class="w-full" v-model="message" @onClick="onClick" />
  </div>
</template>
<script lang="ts" setup>
import { MessageProps } from '../types';
import MessageList from '../components/MessageList.vue';
import MassageInput from '../components/MassageInput.vue';
import { ref } from 'vue';
const message = ref('');
function onClick() {
  console.log(message.value);
}

const messages: MessageProps[] = [
  {
    id: 1,
    content: '你好',
    type: 'question',
    conterstionid: 1,
    statue: 'finished',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
  },
  {
    id: 2,
    content: '你好，我是 Proton Chat',
    type: 'answer',
    conterstionid: 1,
    statue: 'finished',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
  },
  {
    id: 3,
    content: '我想问你一些问题',
    type: 'question',
    conterstionid: 1,
    statue: 'finished',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
  },
  {
    id: 4,
    content:
      'OK，我可以回答你的问题，比如炸鸡好吃吗？，还有其他的问题吗？各种需求我都可以满足，当然我只会说话并不会其他的操作',
    type: 'answer',
    conterstionid: 1,
    statue: 'finished',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
  },
  {
    id: 5,
    content: '炸鸡好吃吗？',
    type: 'question',
    conterstionid: 1,
    statue: 'finished',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
  },
  {
    id: 6,
    content: '我并没有吃过炸鸡，我只吃过其他的食物',
    type: 'answer',
    conterstionid: 1,
    statue: 'loading',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
  },
];
</script>
