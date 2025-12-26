<template>
  <div class="h-full flex-1">
    <div
      class="item border-gray-300 hover:bg-gray-200 border-t cursor-pointer bg-white p-2"
      v-for="item in items"
      :key="item.id"
    >
      <a href="">
        <div class="flex justify-between items-center text-sm leading-6 text-gray-500">
          <span class="text-xs text-gray-400">{{ item.selectedModel }}</span
          ><span class="text-xs text-gray-400">{{ item.createdAt }}</span>
        </div>
        <div class="text-sm font-medium text-gray-900 truncate">{{ item.title }}</div>
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ConversationProps } from '../types'
defineProps<{
  items: ConversationProps[]
}>()
</script>
