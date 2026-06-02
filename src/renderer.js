import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import 'prismjs/themes/prism-okaidia.css'
import '@/styles/scroll-strip.css'

import ContextMenu from '@imengyu/vue3-context-menu'

const app = createApp(App)
app.use(router)
app.use(ContextMenu)
app.mount('#app')
