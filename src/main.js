import { createApp } from 'vue';
import App from './App.vue';
import router from './shared/router';
import store from './shared/store'

createApp(App)
.use(router)
.use(store)
.mount('#app');
