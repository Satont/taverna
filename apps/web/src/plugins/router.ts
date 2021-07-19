import Vue from 'vue';
import Router from 'vue-router';
import { isInCommunity } from '../commons/isInCommunity';
Vue.use(Router);

const linkActiveClass = 'router-active-link';

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('../pages/Main/index.vue'),
    },
    {
      path: '/profile/:id',
      name: 'UserProfile',
      component: () => import('../pages/Users/profile.vue'),
    },
    {
      path: '/events',
      name: 'EventsList',
      component: () => import('../pages/Events/index.vue'),
      meta: {
        requiresAuth: true,
        onlyCommunityMembers: true,
      },
    },
    {
      path: '/events/:id',
      name: 'EventInfo',
      component: () => import('../pages/Events/event.vue'),
      meta: {
        requiresAuth: true,
        onlyCommunityMembers: true,
      },
    },
    {
      path: '/errors/:title',
      name: 'DynamicError',
      component: () => import('../pages/Errors/dynamic.vue'),
    },
  ],
  linkActiveClass,
});

router.beforeEach((to, from, next) => {
  if (to.meta.onlyCommunityMembers && !isInCommunity()) {
    next({
      name: 'DynamicError',
      path: 'errors/401',
      params: {
        title: '401',
        subTitle: to.fullPath.substring(1),
        text: 'Страница доступна только членам сообщества.',
      },
    });
  } else next();
});

router.afterEach((to) => {
  if (!to.matched.length) {
    router.push({
      name: 'DynamicError',
      path: 'errors/404',
      params: {
        title: '404',
        subTitle: to.fullPath,
        text: 'Страница не найдена',
      },
    });
  }
});

export default router;
