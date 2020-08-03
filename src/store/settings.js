export default {
  state: {
    selectedPeriod: { id: 2, label: 'Текущий месяц' },
    periodLabel: {},
    pageHeader: '',
    authorUser: null,
    executUser: null,
    overdue: false,
    completed: false,
    execution: false
  },
  mutations: {
    setSelectedPeriod (state, payload) {
      state.selectedPeriod = payload
    },
    setPeriodLabel (state, payload) {
      state.periodLabel = payload
    },
    setPageHeader (state, payload) {
      state.pageHeader = payload
    },
    setAuthorUser (state, payload) {
      state.authorUser = payload
      // console.log(state.authorUser)
    },
    setExecutUser (state, payload) {
      state.executUser = payload
      // console.log(state.executUser)
    },
    setOverdue (state, payload) {
      state.overdue = payload
      console.log(state.overdue)
    },
    setCompleted (state, payload) {
      state.completed = payload
      console.log(state.completed)
    },
    setExecution (state, payload) {
      state.execution = payload
      console.log(state.execution)
    }
  },
  actions: {
    setSelectedPeriod ({ commit }, payload) {
      commit('setSelectedPeriod', payload)
    },
    setPeriodLabel ({ commit }, payload) {
      commit('setPeriodLabel', payload)
    },
    setPageHeader ({ commit }, payload) {
      commit('setPageHeader', payload)
    },
    setAuthorUser ({ commit }, payload) {
      commit('setAuthorUser', payload)
    },
    setExecutUser ({ commit }, payload) {
      commit('setExecutUser', payload)
    },
    setOverdue ({ commit }, payload) {
      commit('setOverdue', payload)
    },
    setCompleted ({ commit }, payload) {
      commit('setCompleted', payload)
    },
    setExecution ({ commit }, payload) {
      commit('setExecution', payload)
    }
  },
  getters: {
    selectedPeriod (state) {
      return state.selectedPeriod
    },
    periodLabel (state) {
      return state.periodLabel
    },
    pageHeader (state) {
      return state.pageHeader
    },
    authorUser (state) {
      return state.authorUser
    },
    executUser (state) {
      return state.executUser
    },
    overdue (state) {
      return state.overdue
    },
    completed (state) {
      return state.completed
    },
    execution (state) {
      return state.execution
    }
  }
}
