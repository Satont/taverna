import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const linkActiveClass = 'router-active-link'

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Players',
      component: () => import('../pages/Main/index.vue'),
    },
  ],
  linkActiveClass,
})


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
    })
  }
})

export default router
