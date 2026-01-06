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
let selectedFile: File | null = null;
const emit = defineEmits<{
  create: [value: string, imagePath?: string];
}>();
const onCreate = async () => {
  if (message.value && message.value.trim() !== '') {
    let imagePath: string | undefined = undefined;
    if (selectedFile) {
      const base64 = await fileToBase64(selectedFile);
      const base64Data = base64.split(',')[1];
      imagePath = await window.electronAPI.copyImageToUserDir(selectedFile.name, base64Data);
    }
    emit('create', message.value, imagePath);
    message.value = '';
    selectedFile = null;
    imagePreview.value = '';
  }
};
const triggerFileInput = () => {
  if (!props.disabled) {
    fileInput.value?.click();
  }
};

const handleImageUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    console.log(target.files, target.files[0]);
    selectedFile = target.files[0];
    imagePreview.value = await fileToBase64(selectedFile);
  }
};
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

// fcuntion fileToBase64(file: File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = reject;
//   });
// }
</script>
