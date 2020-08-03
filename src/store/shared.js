import { getField, updateField } from 'vuex-map-fields'

export default {
  state: {
    loading: false,
    error: null,
    success: null,
    planId: null,
    search: '',
    selectedTaskId: null,
    startLoading: null,
    endLoading: null,
    predecessor: true,
    successor: true,
    predecessorsTasks: [],
    successorsTasks: [],
    taskDialogVisible: false,
    dialogCaption: '',
    selectedTask: null,
    selectedDialogTask: null,
    taskeditform: {
      text: '',
      description: '',
      dateRange: [],
      progress: 0,
      duration: 0,
      type: ''
    },
    tabDialogTask: null,
    showToolbar: false,
    showPanel: false
  },
  mutations: {
    setShowPanel (state, payload) {
      state.showPanel = payload
    },
    setShowToolbar (state, payload) {
      state.showToolbar = payload
    },
    setTabDialogTask (state, payload) {
      state.tabDialogTask = payload
    },
    setSelectedDialogTask (state, payload) {
      state.selectedDialogTask = payload
    },
    setSelectedTask (state, payload) {
      state.taskeditform.dateRange = []
      // task.type == gantt.config.types.phase
      state.taskeditform.text = payload ? payload.text : ''
      state.taskeditform.description = payload ? payload.description : ''
      state.taskeditform.dateRange.push(payload.start_date)
      state.taskeditform.dateRange.push(payload.end_date)
      state.taskeditform.progress = payload.progress
      state.taskeditform.duration = Math.round(payload.duration / 8)
      state.taskeditform.type = payload.type
      state.selectedTask = payload
    },
    setDialogCaption (state, payload) {
      state.dialogCaption = payload
    },
    setTaskDialogVisible (state, payload) {
      state.taskDialogVisible = payload
    },
    setSuccessorsTasks (state, payload) {
      state.successorsTasks = payload
    },
    setPredecessorsTasks (state, payload) {
      state.predecessorsTasks = payload
    },
    setPredecessor (state, payload) {
      state.predecessor = payload
    },
    setSuccessor (state, payload) {
      state.successor = payload
    },
    setStartLoading (state, payload) {
      state.startLoading = payload
    },
    setEndLoading (state, payload) {
      state.endLoading = payload
    },
    setSelectedTaskId (state, payload) {
      state.selectedTaskId = payload
    },
    setPlanId (state, payload) {
      state.planId = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setSuccess (state, payload) {
      state.success = payload
    },
    clearError (state) {
      state.error = null
    },
    setSearch (state, payload) {
      state.search = payload
    },
    updateField
  },
  actions: {
    setShowPanel ({ commit }, payload) {
      commit('setShowPanel', payload)
    },
    setShowToolbar ({ commit }, payload) {
      commit('setShowToolbar', payload)
    },
    setTabDialogTask ({ commit }, payload) {
      commit('setTabDialogTask', payload)
    },
    setSelectedDialogTask ({ commit }, payload) {
      commit('setSelectedDialogTask', payload)
    },
    setSelectedTask ({ commit }, payload) {
      commit('setSelectedTask', payload) //
    },
    setDialogCaption ({ commit }, payload) {
      commit('setDialogCaption', payload)
    },
    setTaskDialogVisible ({ commit }, payload) {
      commit('setTaskDialogVisible', payload)
    },
    setSuccessorsTasks ({ commit }, payload) {
      // commit('setPredecessorsTasks', [])
      // var pred = []
      // for (let index = 0; index < payload.length; index++) {
      //   const element = payload[index]
      //   // eslint-disable-next-line
      //   const task = gantt.getTask(element)
      //   // eslint-disable-next-line
      //   var formatFunc = gantt.date.date_to_str('%d.%m.%Y')
      //   pred.push({
      //     id: task.id,
      //     index: task.global_id,
      //     start_date: formatFunc(new Date(task.start_date)),
      //     text: task.text
      //   })
      // }
      commit('setSuccessorsTasks', payload)
    },
    setPredecessorsTasks ({ commit }, payload) {
      // commit('setPredecessorsTasks', [])
      // var pred = []
      // for (let index = 0; index < payload.length; index++) {
      //   const element = payload[index]
      //   // eslint-disable-next-line
      //   const task = gantt.getTask(element)
      //   // eslint-disable-next-line
      //   var formatFunc = gantt.date.date_to_str('%d.%m.%Y')
      //   pred.push({
      //     id: task.id,
      //     index: task.global_id,
      //     start_date: formatFunc(new Date(task.start_date)),
      //     text: task.text
      //   })
      // }
      commit('setPredecessorsTasks', payload)
    },
    setPredecessor ({ commit }, payload) {
      commit('setPredecessor', payload)
    },
    setSuccessor ({ commit }, payload) {
      commit('setSuccessor', payload)
    },
    setStartLoading ({ commit }, payload) {
      commit('setStartLoading', payload)
    },
    setEndLoading ({ commit }, payload) {
      commit('setEndLoading', payload)
    },
    setSelectedTaskId ({ commit }, payload) {
      commit('setSelectedTaskId', payload)
    },
    setPlanId ({ commit }, payload) {
      commit('setPlanId', payload)
    },
    setLoading ({ commit }, payload) {
      commit('setLoading', payload)
    },
    setError ({ commit }, payload) {
      commit('setError', payload)
    },
    setSuccess ({ commit }, payload) {
      commit('setSuccess', payload)
    },
    clearError ({ commit }) {
      commit('clearError')
    },
    setSearch ({ commit }, payload) {
      commit('setSearch', payload)
    }
  },
  getters: {
    showPanel (state) {
      return state.showPanel
    },
    showToolbar (state) {
      return state.showToolbar
    },
    tabDialogTask (state) {
      return state.tabDialogTask
    },
    selectedDialogTask (state) {
      return state.selectedDialogTask
    },
    taskeditform (state) {
      return state.taskeditform
    },
    selectedTask (state) {
      return state.selectedTask
    },
    dialogCaption (state) {
      return state.dialogCaption
    },
    taskDialogVisible (state) {
      return state.taskDialogVisible
    },
    successorsTasks (state) {
      return state.successorsTasks
    },
    predecessorsTasks (state) {
      return state.predecessorsTasks
    },
    predecessor (state) {
      return state.predecessor
    },
    successor (state) {
      return state.successor
    },
    startLoading (state) {
      return state.startLoading
    },
    endLoading (state) {
      return state.endLoading
    },
    search (state) {
      return state.search
    },
    selectedTaskId (state) {
      return state.selectedTaskId
    },
    planId (state) {
      return state.planId
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    },
    success (state) {
      return state.success
    },
    getField
  }
}
