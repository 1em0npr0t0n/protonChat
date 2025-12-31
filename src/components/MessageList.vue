<template>
  <div class="message-list">
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
            {{ message.content }}
          </div>
          <div
            v-if="message.type === 'answer'"
            class="message-content bg-gray-200 text-gray-800 p-2 rounded-lg"
          >
            <template v-if="message.statue === 'loading'">
              <Icon icon="eos-icons:three-dots-loading" />
            </template>
            <template v-else>
              {{ message.content }}
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import dayjs from 'dayjs';
import { MessageProps } from '../types';
defineProps<{ messages: MessageProps[] }>();
</script>
