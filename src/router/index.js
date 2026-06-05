import { createRouter, createWebHashHistory } from 'vue-router'
import PlannerView from '@/views/PlannerView.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'planner',
            component: PlannerView,
        },
        {
            path: '/preview',
            name: 'preview',
            component: () => import('@/views/PreviewView.vue'),
        },
        {
            path: '/topic/:source/:id',
            name: 'topic',
            component: () => import('@/views/TopicView.vue'),
        },
    ],
})

export default router
