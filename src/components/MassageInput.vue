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
      class="bg-cyan-500 text-white py-1 px-2 mr-1 rounded absolute right-0 flex items-center"
    >
      <Icon icon="radix-icons:paper-plane" class="mr-2" width="15" height="15" />
      发送
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
const message = defineModel<string>();
const emit = defineEmits();
function send() {
  emit('onClick');
}
</script>
