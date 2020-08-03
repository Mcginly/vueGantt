import Vue from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'
import 'font-awesome/css/font-awesome.min.css'
import Vuetify from 'vuetify'
// import colors from 'vuetify/lib/util/colors'
import 'vuetify/dist/vuetify.min.css'
import ru from 'vuetify/es5/locale/ru'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#78909C', // colors.blueGrey, // '#4076c7',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      }
    }
  },
  lang: {
    locales: { ru },
    current: 'ru'
  },
  icons: {
    iconfont: 'fa'
  }
})
