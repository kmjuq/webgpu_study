import { createWebHistory, createRouter } from 'vue-router'

import WebGPU from '@/views/WebGPU.vue';
import EMPTY from '@/views/EMPTY.vue';

const routes = [
    { path: '/', component: EMPTY, name: 'EMPTY', meta: { id: '4jchjw' } },
    { path: '/GPU', component: WebGPU, name: 'GPU', meta: { id: 'vjgmds' } },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;