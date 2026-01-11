<template>
  <div class="h-full flex-1">
    <div
      v-for="item in items"
      :key="item.id"
      class="item border-gray-400 border-t cursor-pointer p-2"
      :class="{
        'bg-gray-300 hover:bg-gray-100':
          conversationStore.selectedConversationId === Number(item.id),
        'bg-white hover:bg-gray-100': conversationStore.selectedConversationId !== Number(item.id),
      }"
      @contextmenu.prevent="handleContextMenu($event, parseInt(item.id))"
    >
      <a :to="'/conversation/' + item.id" @click="goToConversation(parseInt(item.id))">
        <div class="flex justify-between items-center text-sm leading-6 text-gray-500">
          <span class="text-xs text-gray-400">{{ item.selectedModel }}</span
          ><span class="text-xs text-gray-400">{{
            dayjs(item.createdAt).format('YYYY-MM-DD')
          }}</span>
        </div>
        <div class="text-sm font-medium text-gray-900 truncate">
          {{ item.title }}
        </div>
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { useConversationStore } from '../stores/conversationStore';
import { ConversationProps } from '../types';
import { useRouter } from 'vue-router';

defineProps<{
  items: ConversationProps[];
}>();

const router = useRouter();
const conversationStore = useConversationStore();

const goToConversation = (id: number) => {
  router.push(`/conversation/${id}`);
  conversationStore.selectedConversationId = id;
};

const handleContextMenu = (event: MouseEvent, conversationId: number) => {
  event.preventDefault();
  window.electronAPI.showConversationContextMenu(conversationId, event.clientX, event.clientY);
};
</script>
