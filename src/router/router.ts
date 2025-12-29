import { createRouter, createMemoryHistory } from 'vue-router';
export const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: () => import('../views/Home.vue') },

    {
      path: '/conversation',
      component: () => import('../views/Conversation.vue'),
    },
    { path: '/setting', component: () => import('../views/Settings.vue') },
  ],
});
