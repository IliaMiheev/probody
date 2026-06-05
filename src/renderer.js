import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'dayjs/locale/ru'
import ru from 'element-plus/es/locale/lang/ru'

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import 'prismjs/themes/prism-okaidia.css'
import '@/styles/scroll-strip.css'

import ContextMenu from '@imengyu/vue3-context-menu'

const app = createApp(App)
app.use(router)
app.use(ElementPlus, { locale: ru })
app.use(ContextMenu)
app.mount('#app')
