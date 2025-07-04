import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/ChatAssistantView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/chat',
      name: 'chat-assistant',
      component: () => import('../views/ChatAssistantView.vue'),
    },
    {
      path: '/chat/:conversation_id',
      name: 'chat-with-conversation',
      component: () => import('../views/ChatAssistantView.vue'),
    },
  ],
})

export default router
