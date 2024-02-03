
import './styles/quasar.sass'
import iconSet from 'quasar/icon-set/fontawesome-v5.js'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import he, { rtl } from 'quasar/lang/he'

// To be used on app.use(Quasar, { ... })
export default {
  lang: he,
  direction: rtl,
  config: {},
  plugins: {
  },

  iconSet: iconSet
}