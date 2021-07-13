import Vue from 'vue';
import Router from 'vue-router';
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
      path: '/errors/:title',
      name: 'DynamicError',
      component: () => import('../pages/Errors/dynamic.vue'),
    },
  ],
  linkActiveClass,
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
