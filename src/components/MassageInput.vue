<template>
  <div class="flex items-center justify-conter relative">
    <input
      v-model="message"
      class="rounded-md border border-gray-300 p-2 flex-1"
      type="text"
      placeholder="聊点什么呢？"
      :disabled="disabled"
    />

    <!-- <button
      @click="send"
      class="bg-cyan-500 text-white py-1 px-2 mr-1 rounded absolute right-0 flex items-center"
    >
      <Icon icon="radix-icons:paper-plane" class="mr-2" width="15" height="15" />
      发送
    </button> -->
    <CustomButton
      class="absolute right-0 mr-1"
      color="cyan"
      size="small"
      :icon="'radix-icons:paper-plane'"
      :disabled="disabled"
      @click="onCreate"
    >
      发送
    </CustomButton>
  </div>
</template>
<script setup lang="ts">
import CustomButton from '../components/CustomButton.vue';
defineProps<{
  disabled?: boolean;
}>();
const message = defineModel<string>();
const emit = defineEmits<{
  create: [value: string];
}>();
const onCreate = () => {
  if (message.value && message.value.trim() !== '') {
    emit('create', message.value);
  }
};
</script>
