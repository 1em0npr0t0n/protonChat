<template>
  <div class="flex items-center justify-between h-screen" :style="{ fontSize: fontSize + 'px' }">
    <div class="bg-gray-200 w-[300px] h-full border-r border-gray-300">
      <div class="h-[90%] overflow-y-auto">
        <ConversationList :items="conversations" />
      </div>
      <div class="h-[10%] flex justify-between items-center p-2 gap-2">
        <RouterLink to="/">
          <CustomButton color="cyan" size="medium" :icon="'radix-icons:chat-bubble'">
            {{ $t('common.newChat') }}
          </CustomButton>
        </RouterLink>
        <RouterLink to="/setting">
          <CustomButton color="cyan" plain size="medium" :icon="'radix-icons:gear'">
            {{ $t('common.appSettings') }}
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
import { onMounted, computed, ref } from 'vue';
//import { ConversationProps } from './types';
import { useConversationStore } from './stores/conversationStore';
import { useMessageStore } from './stores/messageStore';
import { setLocale } from './i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const conversationStore = useConversationStore();
const messageStore = useMessageStore();
const conversations = computed(() => conversationStore.conversations);
const fontSize = ref(14);

onMounted(async () => {
  await initProviders();
  // 初始化设置并读取字体大小
  try {
    const settings = await window.electronAPI.readSettings();
    fontSize.value = settings.fontSize || 14;
    // 同步 i18n 语言
    if (settings.language && (settings.language === 'zh-CN' || settings.language === 'en-US')) {
      setLocale(settings.language);
    }
  } catch (error) {
    console.error('读取设置失败:', error);
  }
  conversationStore.fetchConversations();
  console.log('conversations', conversations.value);

  // 监听菜单导航消息
  window.electronAPI.onNavigate((path: string) => {
    router.push(path);
  });

  // 监听删除对话事件
  window.electronAPI.onDeleteConversation(async (conversationId: number) => {
    try {
      // 先删除该对话的所有消息
      await messageStore.deleteMessagesByConversationId(conversationId);
      // 再删除对话
      await conversationStore.deleteConversation(conversationId);
      // 如果删除的是当前查看的对话，导航到首页
      if (router.currentRoute.value.params.id === String(conversationId)) {
        router.push('/');
      }
    } catch (error) {
      console.error('删除对话失败:', error);
    }
  });
});

//console.log('👋 This message is being logged by "App.vue", included via Vite');
</script>
