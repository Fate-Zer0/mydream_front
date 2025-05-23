import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../../views/login/Login.vue')
    },{
        path: '/home',
        name: 'Home',
        component: () => import('../../views/login/Home.vue')
    }
]

export const loginRouter = createRouter({
    history: createWebHistory(),
    routes
})

export default loginRouter