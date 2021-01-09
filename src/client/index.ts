import Vue from 'vue'
import router from './libs/router'
import vuetify from './libs/vuetify'
import store from './libs/vuex'
import App from './App.vue'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ru'

dayjs.extend(relativeTime)
dayjs.locale('ru')

const bootstrap = async () => {
  /* try {
    const { data: user } = await axios.get('/auth/me')
    store.commit('set.user', user)
  } catch {
    window.location.replace(`/auth/discord`)
  }

  await Promise.all([
    store.dispatch('loadTeams'),
    store.dispatch('loadRoles'),
    store.dispatch('loadSettings'),
    store.dispatch('loadTournaments'),
  ]) */

  try {
    await store.dispatch('loadUser')
  // eslint-disable-next-line no-empty
  } catch {}

  await Promise.all([
    store.dispatch('loadMeta'),
  ])

  new Vue({
    vuetify,
    render: (h) => h(App),
    store,
    router,
  }).$mount('#app')
}

bootstrap()
