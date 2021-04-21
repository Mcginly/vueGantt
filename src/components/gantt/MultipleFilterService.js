import store from '../../store'
// import { gantt } from 'dhtmlx-gantt'

export default {
  applyFilterOnTask (task) {
    // eslint-disable-next-line
    const activeStatuses = [
      '34387AFA-6B70-476F-9D34-748732059003', // NEWORDER
      '37A184B8-A81D-4177-9EB5-4EBE3DFAE959', // INPROGRESS
      '85707EFE-806C-4EC6-8CD6-4D5E4EDD8B19', // READ
      '112EA757-36F7-4859-B0D3-6CC0F5A04705', // PREPARED
      'B9C9F74A-15EC-4337-9916-F02FFEC83DD4', // ONAPPROVAL
      'B0B6A339-BA74-4E46-B721-2733D7FB76A9', // ONAPPROVALEXECUTOR
      '70918293-8B84-43BE-AD39-181375D51373', // REFUSEAPPROVALEXECUTOR
      '98FF43BD-B897-41F0-ADF2-4EB3B3783851' // NOCOMPLETE
    ]
    //
    function reqPerkFilter (task) {
      let response = false
      if (task.wasd_Requirement) {
        response = true
      }
      return response
    }
    function riskPerkFilter (task) {
      let response = false
      if (task.wasd_Risks) {
        response = true
      }
      return response
    }
    function reassingPerkFilter (task) {
      let response = false
      if (task.TaskExecutor && task.mainExecutor && task.TaskExecutor !== task.mainExecutor) {
        response = true
      }
      return response
    }
    function zniPerkFilter (task) {
      let response = false
      if (task.isZni) {
        response = true
      }
      return response
    }
    function completedFilter (task) {
      let response = false
      if (Number(task.CompletePercent) >= 100) { // task.closed === 1
        response = true
      }
      return response
    }
    function overdueFilter (task) {
      // console.log('overdueFilter_0')
      let response = false
      // let endDate = task.EndWorkDate ? task.EndWorkDate : new Date()
      if (task.ExpiredNotificationSent) { // task.EndWorkDate > task.EndDate && new Date() > task.EndDate && task.expired === 1
        // console.log('overdueFilter_1')
        response = true
      }
      return response
    }
    function executionFilter (task) {
      let response = false
      if (Number(task.CompletePercent) < 100) { // activeStatuses.includes(task.status)
        response = true
      }
      return response
    }
    function execDateFromFilter (task) {
      let response = false
      if (task.StartDate >= store.getters.execDateFrom) {
        response = true
      }
      return response
    }
    function execDateToFilter (task) {
      let response = false
      if (task.EndDate <= store.getters.execDateTo) {
        response = true
      }
      return response
    }
    function execDateFromToFilter (task) {
      let response = false
      if (task.StartDate >= store.getters.execDateFrom && task.EndDate <= store.getters.execDateFrom) {
        response = true
      }
      return response
    }
    function milestoneFilter (task) {
      let response = false
      if (task.type === 'milestone') {
        // console.log('---milestoneFilter')
        response = true
      }
      return response
    }
    function noexecutorFilter (task) {
      let response = false
      // if ((task.executor_id === null && task.executor_id === undefined && task.executor_id === '') && task.type !== 'phase') {
      //   response = true
      // }
      // eslint-disable-next-line
      if (task.Resources === null && task.type !== 'phase' && !gantt.hasChild(task.id)) {
        response = true
      }
      return response
    }
    function authorUserFilter (task) {
      var authorUser = store.getters.authorUser && store.getters.authorUser.length > 0 ? store.getters.authorUser : null
      var response = false
      if (authorUser) {
        var arrayLength = authorUser.length
        for (var i = 0; i < arrayLength; i++) {
          if (authorUser[i].id === task.owner_id) {
            response = true
          }
        }
      }
      return response
    }
    function executUserFilter (task) {
      var executUser = store.getters.executUser && store.getters.executUser.length > 0 ? store.getters.executUser : null
      var response = false
      if (executUser) {
        for (var i2 = 0; i2 < executUser.length; i2++) {
          if (executUser[i2].id === task.mainExecutor) {
            response = true
          } else {
            if (task.executor_id && task.executor_id.length > 0) {
              const coExecutor = task.executor_id.find(f => f.resource_id === Number(executUser[i2].id))
              if (coExecutor) {
                response = true
              }
            }
          }
        }
      }
      return response
    }
    function progressFilter (task) {
      let response = false
      var progress = store.getters.progress
      // // console.log(progress[0], progress[1])
      if ((progress[0] && progress[0] !== 0) && (progress[1] && progress[1] !== 0)) {
        if ((task.Progress ? Math.round(task.Progress * 100) : 0) >= Number(progress[0]) && (task.Progress ? Math.round(task.Progress * 100) : 0) <= Number(progress[1])) {
          response = true
        } else {
          if ((progress[0] === 0 && progress[1] === 100) && (progress[0] === 0 && progress[1] === 0)) {
            response = false
          }
        }
      }
      return response
    }
    //
    function reqPerkController () {
      let response = false
      if (store.getters.reqPerk) {
        response = true
      }
      return response
    }
    function riskPerkController () {
      let response = false
      if (store.getters.riskPerk) {
        response = true
      }
      return response
    }
    function reassingPerkController () {
      let response = false
      if (store.getters.reassingPerk) {
        response = true
      }
      return response
    }
    function zniPerkController () {
      let response = false
      if (store.getters.zniPerk) {
        response = true
      }
      return response
    }
    function completedController () {
      let response = false
      if (store.getters.completed) {
        response = true
      }
      return response
    }
    function overdueController () {
      let response = false
      if (store.getters.overdue) {
        response = true
      }
      return response
    }
    function executionController () {
      let response = false
      if (store.getters.execution) {
        response = true
      }
      return response
    }
    function execDateFromController () {
      let response = false
      if (store.getters.execDateFrom && !store.getters.execDateTo) {
        response = true
      }
      return response
    }
    function execDateToController () {
      let response = false
      if (store.getters.execDateTo && !store.getters.execDateFrom) {
        response = true
      }
      return response
    }
    function execDateFromToController () {
      let response = false
      if (store.getters.execDateFrom && store.getters.execDateTo) {
        response = true
      }
      return response
    }
    function milestoneController () {
      let response = false
      if (store.getters.milestone) {
        response = true
      }
      return response
    }
    function noexecutorController () {
      let response = false
      if (store.getters.noexecutor) {
        response = true
      }
      return response
    }
    function authorUserController () {
      var authorUser = store.getters.authorUser && store.getters.authorUser.length > 0 ? store.getters.authorUser : null
      var response = false
      if (authorUser) {
        response = true
      }
      return response
    }
    function executUserController () {
      var executUser = store.getters.executUser && store.getters.executUser.length > 0 ? store.getters.executUser : null
      var response = false
      if (executUser) {
        response = true
      }
      return response
    }
    function progressController () {
      let response = false
      var progress = store.getters.progress
      if ((progress[0] && progress[0] !== 0) && (progress[1] && progress[1] !== 0)) {
        response = true
      }
      return response
    }
    //
    let visible = false

    if (completedController() || overdueController() || executionController() || execDateFromController() || execDateToController() || execDateFromToController() || authorUserController() || executUserController() || milestoneController() || progressController() || noexecutorController() || reqPerkController() || riskPerkController() || reassingPerkController() || zniPerkController()) {
      // if (store.getters.completed && store.getters.overdue && store.getters.execution && store.getters.execDateFrom && store.getters.execDateTo && store.getters.execDateFromTo && store.getters.authorUser && store.getters.executUser && store.getters.milestone && ((store.getters.progress[0] && store.getters.progress[0] !== 0) && (store.getters.progress[1] && store.getters.progress[1] !== 0)) && store.getters.noexecutor) {
      // console.log('\nGOING INTO FILTER')
      // // console.log('completedController: ', completedFilter(task))
      // // console.log('overdueController: ', overdueFilter(task))
      // // console.log('executionController: ', executionFilter(task))
      // // console.log('execDateFromController: ', execDateFromFilter(task))
      // // console.log('execDateToController: ', execDateToFilter(task))
      // // console.log('execDateFromToController: ', execDateFromToFilter(task))
      // // console.log('authorUserController: ', authorUserFilter(task))
      // // console.log('executUserController: ', executUserFilter(task))
      // // console.log('milestoneController: ', milestoneFilter(task))
      // // console.log('progressController: ', progressFilter(task))
      // // console.log('noexecutorController: ', noexecutorFilter(task))

      // if (store.getters.completed && store.getters.overdue)
      // x1
      if (completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (zniPerkFilter(task)) {
          visible = true
        }
      }
      // if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task)) {}
      //
      //
      // x2
      if (completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task)) {
          visible = true
        }
      }
      if (completedController() && !overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && executionFilter(task)) {
          visible = true
        }
      }
      if (completedController() && !overdueController() && !executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && execDateFromFilter(task)) {
          visible = true
        }
      }
      if (completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && execDateToFilter(task)) {
          visible = true
        }
      }
      if (completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && execDateFromToFilter(task)) {
          visible = true
        }
      }
      if (completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (completedFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x3
      if (completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && !executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && execDateFromFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && !executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && execDateToFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && execDateToFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x4
      if (completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateToFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromToFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x5
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateFromToFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x6
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x7
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x8
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x9
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x10
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x11
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x12
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x13
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x14
      if (completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && zniPerkController()) {
        if (completedFilter(task) && overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      //
      //
      // x2
      if (!completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && !executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && execDateFromFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && !executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && execDateToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && execDateFromToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (overdueFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x3
      if (!completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x4
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateFromToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x5
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x6
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x7
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x8
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x9
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // 10
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x11
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x12
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x13
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && zniPerkController()) {
        if (overdueFilter(task) && executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      //
      //
      // x2
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executionFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x3
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateFromToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x4
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x5
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x6
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x7
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x8
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x9
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x10
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x11
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x12
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executionFilter(task) && execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      //
      //
      // x2
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateFromToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && milestoneFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x3
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x4
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x5
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x6
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x7
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x8
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x9
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x10
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x11
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromFilter(task) && execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      //
      //
      // x2
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateToFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x3
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x4
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x5
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x6
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x7
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x8
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x9
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x10
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateToFilter(task) && execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      //
      //
      // x2
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromToFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x3
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x4
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x5
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x6
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x7
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x8
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x9
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && zniPerkController()) {
        if (execDateFromToFilter(task) && authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      //
      //
      // x2
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (authorUserFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x3
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x4
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x5
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x6
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x7
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x8
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x9
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && zniPerkController()) {
        if (authorUserFilter(task) && executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      //
      //
      // x2
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executUserFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x3
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x4
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x5
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x6
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x7
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && zniPerkController()) {
        if (executUserFilter(task) && milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      //
      //
      // x2
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (milestoneFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x3
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x4
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x5
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x6
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && zniPerkController()) {
        if (milestoneFilter(task) && progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      //
      //
      // x2
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (progressFilter(task) && noexecutorFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (progressFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (progressFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (progressFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (progressFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x3
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (progressFilter(task) && noexecutorFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (progressFilter(task) && noexecutorFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (progressFilter(task) && noexecutorFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x4
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x5
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && zniPerkController()) {
        if (progressFilter(task) && noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      //
      //
      // x2
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (noexecutorFilter(task) && reqPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (noexecutorFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (noexecutorFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && !reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (noexecutorFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x3
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (noexecutorFilter(task) && reqPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (noexecutorFilter(task) && reqPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      // x4
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && zniPerkController()) {
        if (noexecutorFilter(task) && reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      //
      //
      // x2
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && !zniPerkController()) {
        if (reqPerkFilter(task) && riskPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (reqPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && !riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (reqPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      //  x3
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (reqPerkFilter(task) && riskPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && reqPerkController() && riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (reqPerkFilter(task) && riskPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      //
      //
      // x2
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && reassingPerkController() && !zniPerkController()) {
        if (riskPerkFilter(task) && reassingPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && riskPerkController() && !reassingPerkController() && zniPerkController()) {
        if (riskPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      if (!completedController() && !overdueController() && !executionController() && !execDateFromController() && !execDateToController() && !execDateFromToController() && !authorUserController() && !executUserController() && !milestoneController() && !progressController() && !noexecutorController() && !reqPerkController() && !riskPerkController() && reassingPerkController() && zniPerkController()) {
        if (reassingPerkFilter(task) && zniPerkFilter(task)) {
          visible = true
        }
      }
      return visible
    } else {
      // console.log('NO FILTERS EXIT!')
      visible = true
      return visible
    }
  }
}
