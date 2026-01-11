<template>
  <div class="w-full border border-gray-300 py-1 px-1 rounded-md">
    <div v-if="imagePreview" class="m-2 relative flex items-center">
      <img :src="imagePreview" alt="Preview" class="w-24 h-24 object-cover rounded-md" />
    </div>
    <div v-if="selectedFileName" class="mb-2 relative flex items-center">
      <span class="text-sm text-gray-600">{{ selectedFileName }}</span>
    </div>
    <div class="flex items-center relative w-full h-[40px]">
      <input
        ref="imageInput"
        type="file"
        accept="image/*"
        class="absolute ml-1 hidden"
        @change="handleImageUpload"
      />
      <input ref="fileInput" type="file" class="absolute ml-1 hidden" @change="handleFileUpload" />
      <Icon
        icon="ant-design:file-image-outlined"
        class="absolute left-0 ml-1 cursor-pointer"
        width="32"
        height="32"
        :class="[disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 cursor-pointer']"
        @click="triggerImageInput"
      />
      <Icon
        icon="ant-design:file-add-outlined"
        class="absolute left-0 ml-8 cursor-pointer"
        width="32"
        height="32"
        :class="[disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 cursor-pointer']"
        @click="triggerFileInput"
      />
      <input
        v-model="message"
        class="rounded-md p-1 flex-1 pl-[66px]"
        type="text"
        :placeholder="$t('input.placeholder')"
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
        class="absolute right-2"
        color="cyan"
        size="small"
        :icon="'radix-icons:paper-plane'"
        :disabled="disabled"
        @click="onCreate"
      >
        {{ $t('common.send') }}
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
const imageInput = ref<HTMLInputElement | null>();
const fileInput = ref<HTMLInputElement | null>();
const imagePreview = ref<string>('');
const selectedFileName = ref<string>('');
let selectedImageFile: File | null = null;
let selectedFile: File | null = null;
const emit = defineEmits<{
  create: [value: string, imagePath?: string, filePath?: string];
}>();
const onCreate = async () => {
  if (message.value && message.value.trim() !== '') {
    let imagePath: string | undefined = undefined;
    let filePath: string | undefined = undefined;

    if (selectedImageFile) {
      const base64 = await fileToBase64(selectedImageFile);
      const base64Data = base64.split(',')[1];
      imagePath = await window.electronAPI.copyImageToUserDir(selectedImageFile.name, base64Data);
    }

    if (selectedFile) {
      const base64 = await fileToBase64(selectedFile);
      const base64Data = base64.split(',')[1];
      filePath = await window.electronAPI.copyFileToUserDir(selectedFile.name, base64Data);
    }

    emit('create', message.value, imagePath, filePath);
    message.value = '';
    selectedImageFile = null;
    selectedFile = null;
    imagePreview.value = '';
    selectedFileName.value = '';
  }
};
const triggerImageInput = () => {
  if (!props.disabled) {
    imageInput.value?.click();
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
    selectedImageFile = target.files[0];
    imagePreview.value = await fileToBase64(selectedImageFile);
    // 清除文件选择（如果已选择）
    selectedFile = null;
    selectedFileName.value = '';
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

const handleFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    console.log(target.files, target.files[0]);
    selectedFile = target.files[0];
    selectedFileName.value = selectedFile.name;
    // 清除图片选择（如果已选择）
    selectedImageFile = null;
    imagePreview.value = '';
    if (imageInput.value) {
      imageInput.value.value = '';
    }
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
