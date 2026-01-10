import './index.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router/router';
import { i18n } from './i18n';
import 'highlight.js/styles/github-dark.min.css';
const pinia = createPinia();
createApp(App).use(pinia).use(router).use(i18n).mount('#app');
