<template>
  <div class="flex items-center justify-conter relative">
    <input
      class="rounded-md border border-gray-300 p-2 flex-1"
      type="text"
      v-model="message"
      placeholder="聊点什么呢？"
    />
    <button
      @click="send"
      class="bg-blue-500 text-white p-2 rounded absolute right-0"
    >
      发送
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const message = defineModel<string>();
const emit = defineEmits();
function send() {
  emit('onClick');
}
</script>
