import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import persist from 'pinia-plugin-persistedstate';
import { createPinia } from 'pinia';
import router from './router';

const app = createApp(App)

// pinia
const pinia = createPinia();
pinia.use(persist);

// 插件注册
app.use(pinia);
app.use(router);

// 挂载
app.mount('#app');
