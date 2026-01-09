<template>
  <div class="flex items-center justify-between h-screen" :style="{ fontSize: fontSize + 'px' }">
    <div class="bg-gray-200 w-[300px] h-full border-r border-gray-300">
      <div class="h-[90%] overflow-y-auto">
        <ConversationList :items="conversations" />
      </div>
      <div class="h-[10%] flex justify-between items-center p-2 gap-2">
        <RouterLink to="/">
          <CustomButton color="cyan" size="medium" :icon="'radix-icons:chat-bubble'">
            新建聊天
          </CustomButton>
        </RouterLink>
        <RouterLink to="/setting">
          <CustomButton color="cyan" plain size="medium" :icon="'radix-icons:gear'">
            应用设置
          </CustomButton>
        </RouterLink>
      </div>
    </div>
    <div class="h-full flex-1">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { initProviders } from './db/db';
import ConversationList from './components/ConversationList.vue';
import CustomButton from './components/CustomButton.vue';
import { onMounted, computed } from 'vue';
//import { ConversationProps } from './types';
import { useConversationStore } from './stores/conversationStore';
import { useSettingsStore } from './stores/settingsStore';
//const conversationsFromDB = ref<ConversationProps[]>([]);
const conversationStore = useConversationStore();
const settingsStore = useSettingsStore();
const conversations = computed(() => conversationStore.conversations);
const fontSize = computed(() => settingsStore.currentFontSize);

onMounted(async () => {
  await initProviders();
  await settingsStore.initSettings();
  //conversationStore.conversations = await db.conversations.toArray();
  conversationStore.fetchConversations();
  console.log('conversations', conversations.value);
});

//console.log('👋 This message is being logged by "App.vue", included via Vite');
</script>
