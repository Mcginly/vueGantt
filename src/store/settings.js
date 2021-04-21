export default {
  state: {
    selectedPeriod: { id: 2, label: 'Текущий месяц' },
    periodLabel: {},
    pageHeader: '',
    ganttLayoutTasks: null,
    ganttLayoutResource: null,
    ganttLayoutOnlyGrid: null
  },
  mutations: {
    setGanttLayoutOnlyGrid (state, payload) {
      state.ganttLayoutOnlyGrid = payload
    },
    setGanttLayoutResource (state, payload) {
      state.ganttLayoutResource = payload
    },
    setGanttLayoutTasks (state, payload) {
      state.ganttLayoutTasks = payload
    },
    setSelectedPeriod (state, payload) {
      state.selectedPeriod = payload
    },
    setPeriodLabel (state, payload) {
      state.periodLabel = payload
    },
    setPageHeader (state, payload) {
      state.pageHeader = payload
    }
  },
  actions: {
    setGanttLayoutOnlyGrid ({ commit }, payload) {
      commit('setGanttLayoutOnlyGrid', payload)
    },
    setGanttLayoutResource ({ commit }, payload) {
      commit('setGanttLayoutResource', payload)
    },
    setGanttLayoutTasks ({ commit }, payload) {
      commit('setGanttLayoutTasks', payload)
    },
    setSelectedPeriod ({ commit }, payload) {
      commit('setSelectedPeriod', payload)
    },
    setPeriodLabel ({ commit }, payload) {
      commit('setPeriodLabel', payload)
    },
    setPageHeader ({ commit }, payload) {
      commit('setPageHeader', payload)
    }
  },
  getters: {
    ganttLayoutOnlyGrid (state) {
      return state.ganttLayoutOnlyGrid
    },
    ganttLayoutResource (state) {
      return state.ganttLayoutResource
    },
    ganttLayoutTasks (state) {
      return state.ganttLayoutTasks
    },
    selectedPeriod (state) {
      return state.selectedPeriod
    },
    periodLabel (state) {
      return state.periodLabel
    },
    pageHeader (state) {
      return state.pageHeader
    }
  }
}
