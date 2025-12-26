<template>
  <div class="flex items-center justify-between h-screen">
    <div class="bg-gray-200 w-[300px] h-full border-r border-gray-300 hover:bg-gray-300">
      <div class="h-[90%] overflow-y-auto"><ConversationList :items="items" /></div>
      <div class="h-[10%] flex justify-between items-center p-2 gap-2">
        <button
          class="flex justify-center items-center bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-700 hover:text-white"
        >
          <Icon icon="radix-icons:chat-bubble" class="mr-2"></Icon>
          新建聊天
        </button>
        <button
          class="flex justify-center items-center bg-green-200 text-green-700 text-white rounded-md px-5 py-2 border-green-700 border hover:bg-green-700 hover:text-white"
        >
          <Icon icon="radix-icons:gear" class="mr-2"></Icon>
          应用设置
        </button>
      </div>
    </div>
    <div class="h-full flex-1"><ProviderSelect /></div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ConversationProps } from './types'
import ConversationList from './components/ConversationList.vue'
import ProviderSelect from './components/ProviderSelect.vue'
const items: ConversationProps[] = [
  {
    id: '1',
    title: 'conversation 1',
    selectedModel: 'GPT-3.5-turbo',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    providerId: 1,
  },
  {
    id: '2',
    title: 'conversation 2',
    selectedModel: 'GPT-3.5-turbo',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    providerId: 1,
  },
  {
    id: '3',
    title: 'conversation 3',
    selectedModel: 'GPT-3.5-turbo',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    providerId: 1,
  },
  {
    id: '4',
    title: 'conversation 4 无法找到正确答案，请补充问题资料，我进行二次查询',
    selectedModel: 'GPT-3.5-turbo',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    providerId: 1,
  },
  {
    id: '5',
    title: 'conversation 5',
    selectedModel: 'GPT-3.5-turbo',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    providerId: 1,
  },
  {
    id: '6',
    title: 'conversation 6',
    selectedModel: 'GPT-3.5-turbo',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    providerId: 1,
  },
  {
    id: '7',
    title: 'conversation 7',
    selectedModel: 'GPT-3.5-turbo',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    providerId: 1,
  },
  {
    id: '8',
    title: 'conversation 8',
    selectedModel: 'GPT-3.5-turbo',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    providerId: 1,
  },
  {
    id: '9',
    title: 'conversation 9',
    selectedModel: 'GPT-3.5-turbo',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    providerId: 1,
  },
  {
    id: '10',
    title: 'conversation 10',
    selectedModel: 'GPT-3.5-turbo',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    providerId: 1,
  },
  {
    id: '11',
    title: 'conversation 11',
    selectedModel: 'GPT-3.5-turbo',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    providerId: 1,
  },
  {
    id: '12',
    title: 'conversation 12',
    selectedModel: 'GPT-3.5-turbo',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    providerId: 1,
  },
  {
    id: '13',
    title: 'conversation 13',
    selectedModel: 'GPT-3.5-turbo',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    providerId: 1,
  },
  {
    id: '14',
    title: 'conversation 14',
    selectedModel: 'GPT-3.5-turbo',
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    providerId: 1,
  },
]
console.log('👋 This message is being logged by "App.vue", included via Vite')
</script>
