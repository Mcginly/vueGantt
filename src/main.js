import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import VueCookie from 'vue-cookie'
import vuetify from './plugins/vuetify'
import '@babel/polyfill'
import CKEditor from '@ckeditor/ckeditor5-vue2'
import 'typeface-roboto/index.css'
import '@fortawesome/fontawesome-free/css/all.css'
import utils from './config/utils'

Vue.use(VueCookie)
Vue.use(CKEditor)

Vue.config.productionTip = false

// const Vuetify = new vuetify()
// Vue.use(TiptapVuetifyPlugin, {
//   // the next line is important! You need to provide the Vuetify Object to this place.
//   Vuetify, // same as "vuetify: vuetify"
//   // optional, default to 'md' (default vuetify icons before v2.0.0)
//   iconsGroup: 'fa'
// })

new Vue({
  router,
  store,
  vuetify,
  beforeMount () {
    utils.getUsersSQL()
      .then(r => {
        store.dispatch('setUsers', r)
        // console.log(r)
      })
  },
  watch: {
    '$route': {
      handler (route, from) {
        if (route.name === 'wiki') {
          if (!route.query['page']) {
            const query = { ...route.query, page: '1', items: '8' }
            router.replace({ query })
            store.dispatch('setWikiPage', 1)
            store.dispatch('setWikiItemsPerPage', 8)
            console.log('watch triggered')
          }
        }
      }
    }
  },
  render: h => h(App)
}).$mount('#wasdview')
