import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chapter-1',
      name: 'chapter-1',
      component: () => import('../views/Chapter01.vue'),
    },
    {
      path: '/chapter-2',
      name: 'chapter-2',
      component: () => import('../views/Chapter02.vue'),
    },
    {
      path: '/chapter-3',
      name: 'chapter-3',
      component: () => import('../views/Chapter03.vue'),
    },
    {
      path: '/chapter-4',
      name: 'chapter-4',
      component: () => import('../views/Chapter04.vue'),
    },
    {
      path: '/chapter-5',
      name: 'chapter-5',
      component: () => import('../views/Chapter05.vue'),
    },
    {
      path: '/chapter-6',
      name: 'chapter-6',
      component: () => import('../views/Chapter06.vue'),
    },
    {
      path: '/chapter-7',
      name: 'chapter-7',
      component: () => import('../views/Chapter07.vue'),
    },
    {
      path: '/chapter-8',
      name: 'chapter-8',
      component: () => import('../views/Chapter08.vue'),
    },
    {
      path: '/chapter-9',
      name: 'chapter-9',
      component: () => import('../views/Chapter09.vue'),
    },
    {
      path: '/chapter-10',
      name: 'chapter-10',
      component: () => import('../views/Chapter10.vue'),
    },
    {
      path: '/chapter-11',
      name: 'chapter-11',
      component: () => import('../views/Chapter11.vue'),
    },
    {
      path: '/chapter-12',
      name: 'chapter-12',
      component: () => import('../views/Chapter12.vue'),
    },
    {
      path: '/chapter-13',
      name: 'chapter-13',
      component: () => import('../views/Chapter13.vue'),
    },
  ],
})

export default router
