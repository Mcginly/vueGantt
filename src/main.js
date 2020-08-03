import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import VueCookie from 'vue-cookie'
import vuetify from './plugins/vuetify'
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(VueCookie)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#biview')
