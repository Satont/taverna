import store from '../plugins/vuex';

export function isInCommunity() {
  return Boolean(store.state.meta?.users.find((u) => u._id === store.state.user.id));
}
