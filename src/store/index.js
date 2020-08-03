import Vue from 'vue'
import Vuex from 'vuex'
import Auth from './auth'
import Shared from './shared'
import Data from './data'
import Settings from './settings'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Shared,
    Auth,
    Data,
    Settings
  }
})
