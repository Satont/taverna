import axios from 'axios';
import { TeamWithUsers, HelixUser } from '@twurple/api';
import Vue from 'vue';
import Vuex from 'vuex';
import api from '../libs/api';
Vue.use(Vuex);

export interface State {
  meta: TeamWithUsers;
  user: HelixUser;
}

export default new Vuex.Store({
  state: {
    meta: {} as TeamWithUsers,
    user: undefined,
  },
  mutations: {
    'set.meta'(state, payLoad) {
      state.meta = payLoad;
    },
    'set.user'(state, payLoad) {
      state.user = payLoad;
    },
  },
  actions: {
    async loadUser({ commit }) {
      const { data } = await api.get('auth/me');
      commit('set.user', data);
    },
    async loadMeta({ commit }) {
      const { data } = await api.get('team');
      commit('set.meta', data);
    },
  },
});
