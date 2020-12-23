import Vue from 'vue'
import Vuetify, { UserVuetifyPreset } from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const opts: UserVuetifyPreset = {
  theme: { dark: true },
  icons: {
    iconfont: 'mdiSvg',
  },
}

export default new Vuetify(opts)
