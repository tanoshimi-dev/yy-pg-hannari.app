import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/contents',
      name: 'contents',
      component: () => import('../views/ContentsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/contents/:id',
      name: 'content-detail',
      component: () => import('../views/ContentDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/contents/:id/quiz',
      name: 'quiz',
      component: () => import('../views/QuizView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/quiz-result',
      name: 'quiz-result',
      component: () => import('../views/QuizResultView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  // Handle OAuth callback token (passed in the URL fragment, never sent to servers)
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const token = hashParams.get('token');
  if (token) {
    authStore.setToken(token);
    // Remove token from URL
    window.history.replaceState({}, '', window.location.pathname);
    next({ name: 'dashboard' });
    return;
  }

  if (to.meta.requiresAuth !== false && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router;
