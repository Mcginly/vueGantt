import config from '../config/config'
import axios from 'axios'
// import { set } from 'core-js/fn/dict'

export default {
  state: {
    portfolio: null,
    projects: [],
    taskHistory: null,
    historyLoading: false,
    taskRequirements: null
  },
  mutations: {
    setHistoryLoading (state, payload) {
      state.historyLoading = payload
    },
    setProjects (state, payload) {
      state.projects = payload
    },
    setPortfolio (state, payload) {
      state.portfolio = payload
    },
    setTaskHistory (state, payload) {
      state.taskHistory = payload
    },
    setTaskRequirements (state, payload) {
      state.taskRequirements = payload
    }
  },
  actions: {
    setHistoryLoading ({ commit }, payload) {
      commit('setHistoryLoading', payload)
    },
    async setTaskRequirements ({ commit }, payload) {
      // commit('setTaskRequirements', null)
      if (payload === null) {
        commit('setTaskRequirements', null)
      } else {
        try {
          const resp = await axios.get(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/proddata/requirements/${payload}`)
          commit('setTaskRequirements', resp.data.length > 0 ? resp.data : null)
          console.log('setTaskRequirements', resp.data.length > 0 ? resp.data : null)
        } catch (e) {
          commit('setTaskRequirements', null)
        }
      }
    },
    async setTaskHistory ({ commit }, payload) {
      commit('setTaskHistory', null)
      if (payload === null) {
        commit('setHistoryLoading', false)
      } else {
        try {
          commit('setHistoryLoading', true)
          // console.log(payload)
          let resp = await axios.get(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/proddata/taskhistory/${payload.id}/${payload.date}`)
          let respHistory = resp.data
          let history = []
          for (let i = 0; i < respHistory.length; i++) {
            let element = respHistory[i]
            if (element.TypeName !== 'questionclosed') {
              let items = []
              // if (element.answer) {
              let questionClosed = respHistory.find(f => f.TypeName === 'questionclosed')
              if (element.TypeName === 'questioncreate') {
                items.push({
                  id: 1,
                  name: element.info,
                  info: element.attach ? JSON.parse(element.attach) : null,
                  ActionObjectId: element.ActionObjectId,
                  children: element.answer ? [
                    { id: 2, name: element.answer ? JSON.parse(element.answer).Text : '', info: element.answer ? JSON.parse(JSON.parse(element.answer).attach) : null }
                  ] : []
                })
              }
              if (element.TypeName === 'questioncreate' && (questionClosed && questionClosed.ActionObjectId === element.ActionObjectId)) {
                items.push({
                  id: 3,
                  name: 'Вопрос закрыт (' + new Date(questionClosed.ActionDate).toLocaleString() + ')',
                  info: questionClosed.attach,
                  ActionObjectId: element.ActionObjectId
                })
              }
              element.items = items
              let workUnit = respHistory.filter(f => f.UnitOfWorkUid === element.UnitOfWorkUid)
              if (workUnit.length > 1) {
                const comment = workUnit.find(c => c.Object === 'Комментарии')
                const attach = workUnit.find(c => c.Object === 'Вложение')
                // console.log('attach', attach)
                let firstUnit = workUnit[0]
                const lastUnit = workUnit[workUnit.length - 1]
                firstUnit.info = lastUnit.info
                firstUnit.comment = comment ? comment.info : ''
                firstUnit.attach = attach ? attach.attach : null
                history.push(firstUnit)
              } else {
                element.comment = ''
                history.push(element)
              }
            }
          }
          for (let i = 0; i < history.length; i++) {
            if (history[i].TypeName === 'update') {
              history.splice(i, 1)
            }
          }
          let commitHistory = new Set(history)
          commit('setTaskHistory', [...commitHistory])
          console.log('setTaskHistory', [...commitHistory])
        } catch (e) {
          commit('setHistoryLoading', false)
        }
      }
    },
    setProjects ({ commit }, payload) {
      commit('setProjects', payload)
    },
    async setPortfolio ({ commit }, payload) {
      if (payload === null) {
        commit('setPortfolio', null)
      } else {
        commit('clearError')
        commit('setLoading', true)
        axios.post(`${config.API_LOCAL_ADDRESS}${config.API_GET_PORTFOLIO}`, payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(resp => {
            commit('setPortfolio', resp.data.data)
            commit('setLoading', false)
          })
          .catch(error => {
            commit('setPortfolio', null)
            commit('setLoading', false)
            commit('setError', error.Message)
          })
      }
    }
  },
  getters: {
    taskRequirements (state) {
      return state.taskRequirements
    },
    historyLoading (state) {
      return state.historyLoading
    },
    taskHistory (state) {
      return state.taskHistory
    },
    projects (state) {
      return state.projects
    },
    portfolio (state) {
      return state.portfolio
    }
  }
}
