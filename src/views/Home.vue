<template>
  <div class="w-[80%] h-[85%] mx-auto grid grid-cols-1 grid-rows-5 gap-4">
    {{ message }}
    <ProviderSelect
      class="row-start-3"
      :providers="providers"
      v-model="selectedModel"
    />
  </div>
  <div class="w-[80%] h-[15%] mx-auto flex justify-center items-center">
    <MassageInput class="w-full" v-model="message" @onClick="onClick" />
  </div>
</template>
<script setup lang="ts">
import { ProviderProps } from '../types';
import ProviderSelect from '../components/ProviderSelect.vue';
import { ref } from 'vue';
import MassageInput from '../components/MassageInput.vue';
const message = ref('');
const selectedModel = ref('');
function onClick() {
  console.log(message.value);
}
const providers: ProviderProps[] = [
  {
    id: 1,
    name: 'OpenAI',
    desc: 'OpenAI 是一个 AI 研究和开发公司，致力于推动 AI 技术的发展。',
    models: ['GPT-3.5-turbo', 'GPT-4'],
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    avatar: 'https://openai.com/favicon.ico',
  },
  {
    id: 2,
    name: '字节',
    desc: '字节跳动是一个中国的科技公司，专注于移动应用和互联网服务。',
    models: ['doubao', 'doubao-pro'],
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    avatar: 'https://www.baidu.com/favicon.ico',
  },
  {
    id: 3,
    name: '文心一言',
    desc: '文心一言是一个基于大模型的智能问答系统，由字节跳动开发。',
    models: ['ernie-3.5', 'ernie-4.0'],
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    avatar: 'https://www.baidu.com/favicon.ico',
  },
  {
    id: 4,
    name: '通义千问',
    desc: '通义千问是一个基于大模型的智能问答系统，由字节跳动开发。',
    models: ['qwen-1.5', 'qwen-2.0'],
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01',
    avatar: 'https://www.baidu.com/favicon.ico',
  },
];
</script>
