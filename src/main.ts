import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Notification } from '@arco-design/web-vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'
import '@arco-design/web-vue/dist/arco.css'
import ArcoVue from '@arco-design/web-vue'
const app = createApp(App)
Notification._context = app._context
app.use(createPinia())
app.use(router)
app.use(ArcoVue)
app.mount('#app')
