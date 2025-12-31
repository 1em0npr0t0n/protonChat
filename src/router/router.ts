import { createRouter, createMemoryHistory } from 'vue-router';
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
