import { createRouter, createMemoryHistory } from 'vue-router';
import { useConversationStore } from '../stores/conversationStore';
export const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: () => import('../views/HomeView.vue') },

    {
      path: '/conversation/:id',
      component: () => import('../views/ConversationView.vue'),
    },
    { path: '/setting', component: () => import('../views/SettingsView.vue') },
  ],
});
router.beforeEach((to) => {
  if (!to.path.startsWith('/conversation/')) {
    const ConversationStore = useConversationStore();
    ConversationStore.selectedConversationId = -1;
  }
});
