import Vuex from 'vuex'

declare module 'vue/types/vue' {
  interface Vue {
    $store: Vuex
  }
  interface VueConstructor {
    $store: Vuex
  }
}
