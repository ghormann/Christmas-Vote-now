import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { trackPageView } from '../analytics'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/names',
      name: 'names',
      component: () => import('../views/NameQueue.vue'),
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('../views/InfoView.vue'),
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('../views/StatsView.vue'),
    },
    {
      path: '/other',
      name: 'other',
      component: () => import(/* webpackPrefetch: true */ '../views/OtherDisplaysView.vue'),
    },
  ],
})

// Without this, an SPA only ever reports the page that was hard-loaded.
router.afterEach((to) => {
  trackPageView({
    path: to.fullPath,
    title: document.title,
    location: window.location.href,
  })
})

export default router
