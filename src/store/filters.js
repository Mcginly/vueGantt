export default {
  state: {
    authorUser: null,
    executUser: null,
    overdue: false,
    completed: false,
    execution: false,
    execDateFrom: null,
    execDateTo: null,
    milestone: false,
    progress: [null, null],
    noexecutor: false,
    levels: [],
    level: null,
    overdueMarker: false,
    allPerks: false,
    reqPerk: false,
    riskPerk: false,
    reassingPerk: false,
    zniPerk: false
  },
  mutations: {
    setAllPerks (state, payload) {
      state.allPerks = payload
    },
    setReqPerk (state, payload) {
      state.reqPerk = payload
    },
    setRiskPerk (state, payload) {
      state.riskPerk = payload
    },
    setReassingPerk (state, payload) {
      state.reassingPerk = payload
    },
    setZniPerk (state, payload) {
      state.zniPerk = payload
    },
    setOverdueMarker (state, payload) {
      state.overdueMarker = payload
      // console.log('setOverdueMarker1: ' + state.overdueMarker)
    },
    setLevels (state, payload) {
      state.levels = payload.sort((a, b) => {
        return a - b
      })
      // console.log(state.levels)
    },
    setLevel (state, payload) {
      state.level = payload
      // console.log('setLevel: ' + state.level)
    },
    setNoexecutor (state, payload) {
      state.noexecutor = payload
      // console.log(state.progress)
    },
    setProgress (state, payload) {
      state.progress = payload
      // console.log(state.progress)
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
      // console.log(state.overdue)
    },
    setCompleted (state, payload) {
      state.completed = payload
      // console.log(state.completed)
    },
    setExecution (state, payload) {
      state.execution = payload
      // console.log(state.execution)
    },
    setExecDateFrom (state, payload) {
      state.execDateFrom = payload
      // console.log(state.execution)
    },
    setExecDateTo (state, payload) {
      state.execDateTo = payload
      // console.log(state.execution)
    },
    setMilestone (state, payload) {
      state.milestone = payload
      // console.log(state.milestone)
    }
  },
  actions: {
    setAllPerks ({ commit }, payload) {
      commit('setAllPerks', payload)
    },
    setReqPerk ({ commit }, payload) {
      commit('setReqPerk', payload)
    },
    setRiskPerk ({ commit }, payload) {
      commit('setRiskPerk', payload)
    },
    setReassingPerk ({ commit }, payload) {
      commit('setReassingPerk', payload)
    },
    setZniPerk ({ commit }, payload) {
      commit('setZniPerk', payload)
    },
    setOverdueMarker ({ commit }, payload) {
      commit('setOverdueMarker', payload)
      // console.log('setOverdueMarker: ' + payload)
    },
    setLevels ({ commit }, payload) {
      commit('setLevels', payload)
    },
    setLevel ({ commit }, payload) {
      commit('setLevel', payload)
    },
    setNoexecutor ({ commit }, payload) {
      commit('setNoexecutor', payload)
    },
    setProgress ({ commit }, payload) {
      commit('setProgress', payload)
    },
    setMilestone ({ commit }, payload) {
      commit('setMilestone', payload)
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
    },
    setExecDateFrom ({ commit }, payload) {
      commit('setExecDateFrom', payload)
    },
    setExecDateTo ({ commit }, payload) {
      commit('setExecDateTo', payload)
    }
  },
  getters: {
    allPerks (state) {
      return state.allPerks
    },
    reqPerk (state) {
      return state.reqPerk
    },
    riskPerk (state) {
      return state.riskPerk
    },
    reassingPerk (state) {
      return state.reassingPerk
    },
    zniPerk (state) {
      return state.zniPerk
    },
    overdueMarker (state) {
      return state.levels
    },
    levels (state) {
      return state.levels
    },
    level (state) {
      return state.level
    },
    noexecutor (state) {
      return state.noexecutor
    },
    progress (state) {
      return state.progress
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
    },
    execDateFrom (state) {
      return state.execDateFrom
    },
    execDateTo (state) {
      return state.execDateTo
    },
    milestone (state) {
      return state.milestone
    }
  }
}
