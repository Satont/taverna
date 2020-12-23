import axios from 'axios'
import { TeamWithUsers } from 'twitch/lib'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    meta: {} as TeamWithUsers,
    user: undefined,
  },
  mutations: {
    'set.meta'(state, payLoad) {
      state.meta = payLoad
    },
    'set.user'(state, payLoad) {
      state.user = payLoad
    },
  },
  actions: {
    async loadMeta({ commit }) {
      const { data } = await axios.get('api/team')
      commit('set.meta', data)
    },
  },
})
