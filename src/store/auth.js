import config from '../config/config'
import axios from 'axios'

export default {
  state: {
    token: null,
    user: null,
    userLdap: null,
    users: null
  },
  mutations: {
    setUserLdap (state, payload) {
      state.userLdap = payload
    },
    setUsers (state, payload) {
      state.users = payload
    },
    setTokenNull (state) {
      state.token = null
    },
    setToken (state, payload) {
      state.token = payload
    },
    setUser (state, payload) {
      state.user = payload
    },
    async checkToken (state, payload) {
      if (state.token === null) {
        try {
          const token = await axios.post(`${config.ELMA_API}${config.ELMA_AUTH_PATH}${payload.login}`, payload.pwd, {
            headers: {
              'Content-Type': 'application/json',
              'ApplicationToken': config.ELMA_API_TOKEN
            }
          })
          state.token = token.data.AuthToken
        } catch (error) {
          state.token = null
        }
      } else {
        try {
          const checkToken = await axios(`${config.ELMA_API}${config.ELMA_CHECK_TOKEN}${state.token}`)
          state.token = checkToken.data.AuthToken
        } catch (error) {
          state.token = null
        }
      }
    }
  },
  actions: {
    setUserLdap ({ commit }, payload) {
      commit('setUserLdap', payload)
    },
    setUsers ({ commit }, payload) {
      commit('setUsers', payload)
    },
    clearUser ({ commit }) {
      commit('setUser', null)
    },
    setUser ({ commit }, payload) {
      commit('setUser', payload)
    },
    async loginUser ({ commit }, { login, pwd }) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const token = await axios.post(`${config.useProxy ? 'http://' + config.proxyAddress + ':8888/' : ''}${config.ELMA_API}${config.ELMA_AUTH_PATH}${login}`, '"' + pwd + '"', {
          headers: {
            'Content-Type': 'application/json',
            'ApplicationToken': config.ELMA_API_TOKEN
          }
        })
        if (token.data.AuthToken) {
          commit('setToken', token.data.AuthToken)
          commit('setUser', token.data.CurrentUserId)
          commit('setLoading', false)
        } else {
          commit('setTokenNull')
          commit('setUser', null)
          commit('setLoading', false)
          commit('setError', 'Пользователь не найден или введен неверный логин/пароль')
        }
      } catch (error) {
        commit('setTokenNull')
        commit('setUser', null)
        commit('setLoading', false)
        commit('setError', 'Пользователь не найден или введен неверный логин/пароль')
        throw error
      }
    },
    async ldapLogin ({ commit, state }, { user, pwd }) {
      commit('clearError')
      commit('setLoading', true)
      commit('setSuccess', null)
      try {
        const resolve = await axios.post(`${config.useProxy ? 'http://' + config.proxyAddress + ':8888/' : ''}${config.API_ADDRESS}${config.LDAP_AUTH}`, { user: user, pwd: pwd }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (resolve.data.error) {
          commit('setUserLdap', null)
          commit('setUser', null)
          commit('setLoading', false)
          commit('setError', 'Пользователь не найден или введен неверный логин/пароль')
        } else {
          if (resolve.data.type === 1) {
            commit('setUserLdap', null)
            commit('setUser', null)
            commit('setLoading', false)
            commit('setError', resolve.data.data.name + '! За разрешением на доступ к ресурсу обратитесь в службу безопасности.')
          } else {
            // console.log(resolve.data.data.all.sAMAccountName)
            const currentUser = state.users.find(f => f.login === resolve.data.data.all.sAMAccountName)
            commit('setUserLdap', currentUser)
            commit('setUser', resolve.data.data.all.sAMAccountName)
            commit('setLoading', false)
            commit('setSuccess', 'Текущий пользователь: ' + resolve.data.data.name)
          }
        }
      } catch (error) {
        commit('setUserLdap', null)
        commit('setUser', null)
        commit('setLoading', false)
        commit('setError', 'Пользователь не найден или введен неверный логин/пароль')
        throw error
      }
    }
  },
  getters: {
    userLdap (state) {
      return state.userLdap
    },
    users (state) {
      return state.users
    },
    token (state) {
      return state.token
    },
    user (state) {
      return state.user
    },
    isUserLoggedIn (state, getters) {
      // function checkCookie (name) {
      //   var matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([[\].$?*|{}[\]([\])[\][\]\\[\]/[\]+^])/g, '\\$1') + '=([^;]*)'))
      //   return matches ? decodeURIComponent(matches[1]) : undefined
      // }
      // if (checkCookie('user_id') !== undefined) {
      //   return true
      // } else return false
      if (getters.user !== null) {
        return true
      } else return false
    }
  }
}
