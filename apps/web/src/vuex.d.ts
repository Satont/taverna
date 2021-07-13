import Vue from 'vue';
import { Store } from 'vuex';
import { State } from './plugins/vuex';

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    store?: Store<any>;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $store: Store<any>;
  }
  /*   interface VueConstructor {
    $store: Store<State>;
  } */
}
