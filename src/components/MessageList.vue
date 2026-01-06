<template>
  <div ref="_ref" class="message-list">
    <div v-for="message in messages" :key="message.id" class="message-item mb-3">
      <div class="flex" :class="{ 'justify-end': message.type === 'question' }">
        <div>
          <div
            class="text-sm text-gray-500 mb-2"
            :class="{ 'text-right': message.type === 'question' }"
          >
            {{ dayjs(message.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <div
            v-if="message.type === 'question'"
            class="message-content bg-cyan-500 text-white p-2 rounded-lg"
          >
            <img
              v-if="message.imagePath"
              :src="`safe-file://${message.imagePath}`"
              alt="图片"
              class="h-24 w-24 object-cover rounded-md block"
            />
            {{ message.content }}
          </div>
          <div
            v-if="message.type === 'answer'"
            class="message-content bg-gray-200 text-gray-800 p-2 rounded-lg"
          >
            <template v-if="message.statue === 'loading'">
              <Icon icon="eos-icons:three-dots-loading" />
            </template>
            <div
              v-else
              class="prose prose-zinc prose-headings:my-2 prose-li:my-1 prose-ul:my-1 prose-p:my-1
                prose-pre:whitespace-pre-wrap prose-pre:break-words prose-pre:max-w-full
                prose-hr:my-5"
            >
              <VueMarkdown :source="message.content" :plugins="plugins" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import dayjs from 'dayjs';
import VueMarkdown from 'vue-markdown-render';
import hljs from 'markdown-it-highlightjs';
const plugins = [hljs];
const _ref = ref<HTMLDivElement>();
defineExpose({
  ref: _ref,
});
import { MessageProps } from '../types';
defineProps<{ messages: MessageProps[] }>();
</script>
