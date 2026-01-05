import './index.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router/router';
import 'highlight.js/styles/github-dark.min.css';
const pinia = createPinia();
createApp(App).use(pinia).use(router).mount('#app');
