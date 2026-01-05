<template>
  <div class="w-full border border-gray-300 py-1 px-1 rounded-md">
    <div v-if="imagePreview" class="mb-2 relative flex items-center">
      <img :src="imagePreview" alt="Preview" class="w-24 h-24 object-cover rounded-md" />
    </div>
    <div class="flex items-center relative w-full">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="absolute ml-1 hidden"
        @change="handleImageUpload"
      />
      <Icon
        icon="radix-icons:image"
        class="absolute left-0 ml-1 cursor-pointer"
        width="24"
        height="24"
        :class="[disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 cursor-pointer']"
        @click="triggerFileInput"
      />
      <input
        v-model="message"
        class="rounded-md p-1 flex-1 pl-[28px]"
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
  </div>
</template>
<script setup lang="ts">
import CustomButton from '../components/CustomButton.vue';
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
const props = defineProps<{
  disabled?: boolean;
}>();

const message = defineModel<string>();
const fileInput = ref<HTMLInputElement | null>();
const imagePreview = ref<string>('');
const emit = defineEmits<{
  create: [value: string];
}>();
const onCreate = () => {
  if (message.value && message.value.trim() !== '') {
    emit('create', message.value);
  }
};
const triggerFileInput = () => {
  if (!props.disabled) {
    fileInput.value?.click();
  }
};
const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    // const file = target.files[0];
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = () => {
    //   if (reader.result) {
    //     message.value = reader.result as string;
    //   }
    // };
    console.log(target.files, target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(target.files[0]);
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
  }
};
</script>
