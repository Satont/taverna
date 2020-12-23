import Vue from 'vue'
import Vuetify, { UserVuetifyPreset } from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { VueMasonryPlugin } from 'vue-masonry'

Vue.use(Vuetify)
Vue.use(VueMasonryPlugin)

const opts: UserVuetifyPreset = {
  theme: { dark: true },
  icons: {
    iconfont: 'mdiSvg',
  },
}

export default new Vuetify(opts)
