<template>
  <div class="message-list">
    <div class="message-item mb-3" v-for="message in messages" :key="message.id">
      <div class="flex" :class="{ 'justify-end': message.type === 'question' }">
        <div>
          <div
            class="text-sm text-gray-500 mb-2"
            :class="{ 'text-right': message.type === 'question' }"
          >
            {{ dayjs(message.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <div
            class="message-content bg-cyan-500 text-white p-2 rounded-lg"
            v-if="message.type === 'question'"
          >
            {{ message.content }}
          </div>
          <div
            class="message-content bg-gray-200 text-gray-800 p-2 rounded-lg"
            v-if="message.type === 'answer'"
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
import { MessageProps } from 'src/types';
defineProps<{ messages: MessageProps[] }>();
</script>
