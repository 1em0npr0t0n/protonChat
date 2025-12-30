<template>
  <div class="flex items-center justify-between h-screen">
    <div class="bg-gray-200 w-[300px] h-full border-r border-gray-300 hover:bg-gray-300">
      <div class="h-[90%] overflow-y-auto">
        <ConversationList :items="conversations" />
      </div>
      <div class="h-[10%] flex justify-between items-center p-2 gap-2">
        <RouterLink to="/">
          <!-- <button
            class="flex justify-center items-center bg-blue-500 text-white px-5 py-2 rounded-md
              hover:bg-blue-700 hover:text-white"
          >
            <Icon icon="radix-icons:chat-bubble" class="mr-2"></Icon>
            新建聊天
          </button> -->
          <CustomButton color="cyan" size="medium" :icon="'radix-icons:chat-bubble'">
            新建聊天
          </CustomButton>
        </RouterLink>
        <RouterLink to="/setting">
          <!-- <button
            class="flex justify-center items-center bg-sky-200 text-cyan-800 text-white rounded-md
              px-5 py-2 border-cyan-700 border hover:bg-sky-700 hover:text-white"
          >
            <Icon icon="radix-icons:gear" class="mr-2"></Icon>
            应用设置
          </button> -->
          <CustomButton color="cyan" plain size="medium" :icon="'radix-icons:gear'">
            应用设置
          </CustomButton>
        </RouterLink>
      </div>
    </div>
    <div class="h-full flex-1">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import ConversationList from './components/ConversationList.vue';
import CustomButton from './components/CustomButton.vue';
import { conversations } from './testData';
import { C } from 'vue-router/dist/router-CWoNjPRp.mjs';

console.log('👋 This message is being logged by "App.vue", included via Vite');
</script>
