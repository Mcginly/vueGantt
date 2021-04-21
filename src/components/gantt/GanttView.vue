<template>
  <div id="ganttview" class="ganttview" ref="gantt" />
</template>

<script>
import { gantt } from 'dhtmlx-gantt'
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import utils from '../../config/utils'
import config from '../../config/config'
import ganttinitial from './ganttinitial'
import multipleFilterService from './MultipleFilterService'

export default {
  name: 'GanttView',
  props: {
    tasks: {
      type: Object,
      default () {
        return { data: [], links: [] }
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'loading',
      'error',
      'success',
      'user',
      'userLdap',
      'users',
      'planId',
      'predecessor',
      'successor',
      'criticalPath',
      'project'
    ]),
    ...mapFields([
      'search',
      'selectedTaskId'
    ])
  },
  async mounted () {
    this.$nextTick(() => {
      this.loadData()
    })
  },
  methods: {
    async loadData () {
      this.$_initGanttEvents()
      //
      this.$store.dispatch('setLoading', true)
      //
      gantt = await ganttinitial.ganttLoadResources(gantt, this.planId)
      //
      gantt = await ganttinitial.ganttAttachEvents(gantt)
      //
      gantt = await ganttinitial.ganttLoadServerLists(gantt, this.planId)
      //
      gantt = await ganttinitial.ganttInitialConfig(gantt)
      //
      gantt.load(`${config.useProxy ? config.proxyAddress : ''}http://10.175.180.201:3000/proddata/${this.planId}`)
      // gantt.load(`http://10.175.180.201:3000/api/v2/project/plan/${this.planId}/prod`) // первая задача - проект
      //
      // gantt.config.fit_tasks = true
      let taskId = this.$store.getters.taskId
      // console.log(taskId, this.$route.query)
      gantt.config.readonly = true
      if (taskId === 'all' && this.$route.query['edit']) {
        gantt.config.readonly = false
        console.log('edit', true)
      }
      gantt.init(this.$refs.gantt)
      // this.initContextMenu()
      // gantt.parse(this.$props.tasks)
      this.$_initDataProcessor()
      //
    },
    async $_initGanttEvents () {
      function getConstraintType (type) {
        switch (type) {
          case 4:
            return 'mso' // MustStartOn Фиксированное начало 4
          case 5:
            return 'mfo' // MustFinishOn Фиксированное окончание 5
          case 0:
            return 'snet' // StartNoEarlierThan Начало не ранее 0
          case 1:
            return 'snlt' // StartNoLaterThan Начало не позднее 1
          case 2:
            return 'fnet' // FinishNoEarlierThan Окончание не ранее 2
          case 3:
            return 'fnlt' // FinishNoLaterThan Окончание не позднее 3
          default:
            return 'asap'
        }
      }
      //
      function formatWorkload (num) {
        let ost = Math.max(Number(Number(num).toFixed(2)), Math.round(num)) % Math.min(Number(Number(num).toFixed(2)), Math.round(num))
        if (isNaN(ost)) {
          return 0
        } else {
          if (ost === 0) {
            return num
          } else {
            return Number(Number(num).toFixed(2))
          }
        }
      }
      if (!gantt.$_eventsInitialized) {
        let self = this
        // gantt.attachEvent('onTaskLoading', function (task) {
        //   var ownerValue = task[gantt.config.resource_property]
        //   task[gantt.config.resource_property] = task.users
        //   // if (!task.$virtual && (!ownerValue || !Array.isArray(ownerValue) || !ownerValue.length)) {
        //   //   task[gantt.config.resource_property] = [{ resource_id: 5, value: 0 }] // 'Unassigned' group
        //   // }
        //   return true
        // })
        gantt.attachEvent('onBeforeTaskDisplay', function (id, task) {
          let response = false
          let aa = self.$store.getters.completed
          let bb = self.$store.getters.overdue
          let cc = self.$store.getters.execution
          let dd = self.$store.getters.execDateFrom
          let ee = self.$store.getters.execDateTo
          let ff = self.$store.getters.milestone
          let gg = self.$store.getters.noexecutor
          let hh = self.$store.getters.authorUser && self.$store.getters.authorUser.length > 0 ? self.$store.getters.authorUser : null
          let ii = self.$store.getters.executUser && self.$store.getters.executUser.length > 0 ? self.$store.getters.executUser : null
          // eslint-disable-next-line
          let jj = (self.$store.getters.progress[0] && self.$store.getters.progress[0] !== 0) || (self.$store.getters.progress[1] && self.$store.getters.progress[1] !== 0) ? true : false
          let kk = self.$store.getters.reqPerk
          let ll = self.$store.getters.riskPerk
          let mm = self.$store.getters.reassingPerk
          let nn = self.$store.getters.zniPerk
          if (!aa && !bb && !cc && !dd && !ee && !ff && !gg && !ee && !hh && !ii && !jj && !kk && !ll && !mm && !nn) {
            response = true
          } else {
            var isVisibleTask = multipleFilterService.applyFilterOnTask(task)
            response = isVisibleTask
          }
          if (self.criticalPath) {
            response = gantt.isCriticalTask(task)
          }
          return response
        })
        gantt.attachEvent('onGanttRender', function () {
          let tasksCount = gantt.getVisibleTaskCount()
          self.$store.dispatch('setTaskCount', tasksCount < 0 ? 0 : tasksCount)
          // var element = document.getElementById('completed')
          // element.onclick = element.select()
          // gantt.$root.querySelector('[data-text-filter]').value = filterValue
        })
        //
        gantt.attachEvent('onLoadEnd', () => {
          let endLoading = Date.now()
          // Begin Markers
          var dateToStr = gantt.date.date_to_str(gantt.config.task_date)
          var today = new Date()
          gantt.addMarker({
            start_date: today,
            css: 'today',
            text: 'Сегодня',
            title: dateToStr(today)
          })
          var projectstart = new Date(gantt.serverList('dates')[0].StartDate)
          gantt.addMarker({
            start_date: projectstart,
            css: 'status_line',
            text: 'Старт',
            title: dateToStr(projectstart)
          })
          var projectEnd = new Date(gantt.serverList('dates')[0].FinishDate)
          gantt.addMarker({
            start_date: projectEnd,
            css: 'finish',
            text: 'Завершение',
            title: dateToStr(projectEnd)
          })
          // End Markers
          this.$store.dispatch('setEndLoading', endLoading)
          this.$store.dispatch('setLoading', false)
          console.log('Загрузка завершена за ', (endLoading - this.$store.getters.startLoading) / 1000)
          this.$store.dispatch('setSuccess', 'Загрузка завершена. Время загрузки (в секундах): ' + Math.round(((endLoading - this.$store.getters.startLoading) / 1000) + 1 / 2))
          // // const sorted = _.sortBy(tasksUsorted, '$index')
          // // that.$props.tasks.data
          // })
          var obj = gantt.$data.tasksStore.getItems()
          let lastTask = obj[obj.length - 1]
          if (lastTask && lastTask.type === 'placeholder') {
            gantt.deleteTask(lastTask.id)
          }
          var levels = []
          try {
            gantt.render()
            let tasksUnsorted = gantt.getTaskByTime()
            // if (lastTask && lastTask.type === 'placeholder') {
            //   console.log('lastTask', tasksUnsorted.indexOf(lastTask), lastTask)
            //   lastTaskIndex = lastTask.id
            //   tasksUnsorted.splice(tasksUnsorted.indexOf(lastTask), 1)
            // }
            for (let i = 0; i < tasksUnsorted.length; i++) {
              //
              let summWorkload = 0
              //
              levels.push(tasksUnsorted[i].$level + 1)
              tasksUnsorted[i]._wbs = String(tasksUnsorted[i].$wbs)
              tasksUnsorted[i].global_id_temp = tasksUnsorted[i].global_id
              tasksUnsorted[i].global_id = tasksUnsorted[i].$index + 1
              if (tasksUnsorted[i].Resources !== null) {
                let resSql = JSON.parse(tasksUnsorted[i].Resources)
                let users = []
                const listRes = gantt.serverList('res')
                this.$nextTick()
                for (let ii = 0; ii < resSql.length; ii++) {
                  const element = resSql[ii]
                  const res = listRes.find(f => Number(f.PlanItem) === Number(tasksUnsorted[i].id) && Number(f.id) === Number(element.id))
                  // console.log(res)
                  if (res) {
                    users.push({ resource_id: element.id, value: res.capacity })
                  }
                }
                tasksUnsorted[i].mainExecutor = tasksUnsorted[i].executor_id
                tasksUnsorted[i].users = users
                tasksUnsorted[i].executor_id = users
              }
              //
              if (gantt.hasChild(tasksUnsorted[i].id)) {
                if (tasksUnsorted[i].type === 'project') {
                  tasksUnsorted[i].type = gantt.config.types.project
                  tasksUnsorted[i].pic_type = gantt.config.types.project
                } else {
                  if (tasksUnsorted[i].type === gantt.config.types.subplan) {
                    tasksUnsorted[i].$open = false
                  } else {
                    tasksUnsorted[i].type = gantt.config.types.project
                    // tasksUnsorted[i].type = gantt.config.types.task
                    tasksUnsorted[i].pic_type = gantt.config.types.phase
                  }
                }
                //
                gantt.eachTask(function (etask) {
                  summWorkload += etask.type === 'milestone' ? 0 : etask.workload
                }, tasksUnsorted[i].id)
              } else {
                summWorkload = tasksUnsorted[i].type === 'milestone' ? 0 : tasksUnsorted[i].workload
              }
              tasksUnsorted[i].workload = tasksUnsorted[i].type === 'milestone' ? 0 : tasksUnsorted[i].workload
              tasksUnsorted[i].isImported = false
              // if (Math.max(Number(Number(summWorkload).toFixed(2)), Math.round(summWorkload)) % Math.min(Number(Number(summWorkload).toFixed(2)), Math.round(summWorkload)) === 0) {
              //   tasksUnsorted[i].workloadstring = tasksUnsorted[i].type === 'milestone' ? '0' : String(Math.round(summWorkload))
              // } else {
              //   tasksUnsorted[i].workloadstring = tasksUnsorted[i].type === 'milestone' ? '0' : (Number(Number(summWorkload).toFixed(2)) > 0 ? String(Number(summWorkload).toFixed(2)).replace('.', ',') : '0')
              // }
              tasksUnsorted[i].workloadstring = tasksUnsorted[i].type === 'milestone' ? '0' : String(formatWorkload(summWorkload)).replace('.', ',')
              //
              // if (gantt.hasChild(tasksUnsorted[i].id) && tasksUnsorted[i].type === 'project') {
              //   tasksUnsorted[i].type = gantt.config.types.project
              //   tasksUnsorted[i].pic_type = gantt.config.types.project
              // }
              // if (gantt.hasChild(tasksUnsorted[i].id) && tasksUnsorted[i].type !== 'project') {
              //   if (tasksUnsorted[i].type === gantt.config.types.subplan) {
              //     tasksUnsorted[i].$open = false
              //   } else {
              //     tasksUnsorted[i].type = gantt.config.types.project
              //     // tasksUnsorted[i].type = gantt.config.types.task
              //     tasksUnsorted[i].pic_type = gantt.config.types.phase
              //   }
              // }
              //
              tasksUnsorted[i].constraint_type = tasksUnsorted[i].ConstraintType !== null ? getConstraintType(Number(tasksUnsorted[i].ConstraintType)) : 'asap'
              if (tasksUnsorted[i].ConstraintType !== null) {
                tasksUnsorted[i].constraint_date = gantt.getClosestWorkTime({ date: gantt.date.parseDate(new Date(tasksUnsorted[i].ConstraintDate), '%Y-%m-%d %H:%i:%s'), dir: 'future' })
              }
              if (!tasksUnsorted[i].global_id) {
                tasksUnsorted[i].global_id = Number(tasksUnsorted[i].global_id_temp)
              }
            }
            //
            let level = Array.from(new Set(levels))
            // console.log(level)
            this.$store.dispatch('setLevels', level)
            //
            // var showBaselines = self.$store.getters.predictDate
            // console.log('showBaselines2s: ', showBaselines)
            //
            this.$props.tasks.data = tasksUnsorted
            gantt.refreshData()
            let allAuthors = [...new Set(tasksUnsorted.map(item => item.owner_id))]
            const resourcesUsers = gantt.serverList('res')
            let allExecutors = [...new Set(resourcesUsers.map(item => item.id))]
            this.$store.dispatch('setAllAuthors', allAuthors)
            this.$store.dispatch('setAllExecutors', allExecutors)
            this.$store.dispatch('setAllTasksCount', tasksUnsorted.length)
          } catch (error) {
            console.log(error)
          }
          // gantt.ext.zoom.zoomOut()
          // Подсветка задачи, если переход выполнен из карточки задачи
          let tasks = obj
          let taskId = this.$store.getters.taskId
          if (taskId && taskId !== 'all' && taskId !== 'edit') {
            const findTask = tasks.find(f => f.task_id === taskId)
            if (findTask) {
              // eslint-disable-next-line
              gantt.selectTask(findTask.id)
              // eslint-disable-next-line
              gantt.showTask(findTask.id)
            }
          }
          // Конец Подсветка задачи, если переход выполнен из карточки задачи
        })
        // let self = this
        // gantt.attachEvent('onTaskClick', (id) => {
        //   function getPredecessor (id) {
        //     var taskObj = gantt.getTask(id)
        //     var predecessors = taskObj.$target || null
        //     var target = {}
        //     var targets = []
        //     if (predecessors && predecessors.length > 1) {
        //       for (let index = 0; index < predecessors.length; index++) {
        //         targets.push(gantt.getLink(predecessors[index]).source)
        //       }
        //     } else {
        //       target = gantt.getLink(predecessors[0]) || null
        //     }
        //     return targets.length > 0 ? targets : target ? target.source : null
        //   }
        //   function getSuccessor (id) {
        //     var taskObj = gantt.getTask(id)
        //     var successors = taskObj.$source || null
        //     var target = {}
        //     var targets = []
        //     if (successors && successors.length > 1) {
        //       for (let index = 0; index < successors.length; index++) {
        //         targets.push(gantt.getLink(successors[index]).target)
        //       }
        //     } else {
        //       target = gantt.getLink(successors[0]) || null
        //     }
        //     return targets.length > 0 ? targets : target ? target.target : null
        //   }
        //   var pred = getPredecessor(id)
        //   if (!pred) {
        //     console.log('0')
        //     self.$store.dispatch('setPredecessor', false)
        //   } else {
        //     console.log('1')
        //     self.$store.dispatch('setPredecessor', true)
        //     if (Array.isArray(pred)) {
        //       var predecessors = []
        //       for (let index = 0; index < pred.length; index++) {
        //         const element = pred[index]
        //         // eslint-disable-next-line
        //         const task = gantt.getTask(element)
        //         // eslint-disable-next-line
        //         predecessors.push(task)
        //       }
        //       console.log('2')
        //       self.$store.dispatch('setPredecessorsTasks', predecessors)
        //     } else {
        //       var predecessor = []
        //       // eslint-disable-next-line
        //       const task = gantt.getTask(pred)
        //       // eslint-disable-next-line
        //       predecessor.push(task)
        //       console.log('3')
        //       self.$store.dispatch('setPredecessorsTasks', predecessor)
        //     }
        //   }
        //   var succ = getSuccessor(id)
        //   if (!succ) {
        //     console.log('00')
        //     self.$store.dispatch('setSuccessor', false)
        //   } else {
        //     console.log('01')
        //     self.$store.dispatch('setSuccessor', true)
        //     if (Array.isArray(succ)) {
        //       var successors = []
        //       for (let index = 0; index < succ.length; index++) {
        //         const element = succ[index]
        //         // eslint-disable-next-line
        //         const task = gantt.getTask(element)
        //         // eslint-disable-next-line
        //         successors.push(task)
        //       }
        //       console.log('02')
        //       self.$store.dispatch('setSuccessorsTasks', successors)
        //     } else {
        //       var successor = []
        //       // eslint-disable-next-line
        //       const task = gantt.getTask(succ)
        //       // eslint-disable-next-line
        //       successor.push(task)
        //       console.log('03')
        //       self.$store.dispatch('setSuccessorsTasks', successor)
        //     }
        //   }
        // })
        gantt.attachEvent('onTaskSelected', (id) => {
          let task = gantt.getTask(id)
          this.$emit('task-selected', task)
          console.log('onTaskSelected', task)
          this.$store.dispatch('setSelectedTask', task)
          this.$store.dispatch('setSelectedTaskId', id)
          this.selectedTaskId = id
          // console.log(self.project)
          // selectedTaskId
        })
        gantt.attachEvent('onTaskIdChange', (id, newId) => {
          if (gantt.getSelectedId() === newId) {
            let task = gantt.getTask(newId)
            this.$emit('task-selected', task)
            this.$store.dispatch('setSelectedTaskId', newId)
            this.$store.dispatch('setSelectedTask', task)
            console.log('onTaskIdChange', task)
          }
        })
        gantt.attachEvent('onTaskDblClick', function (id, e) {
          function getPredecessor (id) {
            var taskObj = gantt.getTask(id)
            var predecessors = taskObj.$target || null
            var target = {}
            var targets = []
            if (predecessors && predecessors.length > 1) {
              for (let index = 0; index < predecessors.length; index++) {
                targets.push(gantt.getLink(predecessors[index]).source)
              }
            } else {
              target = gantt.getLink(predecessors[0]) || null
            }
            return targets.length > 0 ? targets : target ? target.source : null
          }
          function getSuccessor (id) {
            var taskObj = gantt.getTask(id)
            var successors = taskObj.$source || null
            var target = {}
            var targets = []
            if (successors && successors.length > 1) {
              for (let index = 0; index < successors.length; index++) {
                targets.push(gantt.getLink(successors[index]).target)
              }
            } else {
              target = gantt.getLink(successors[0]) || null
            }
            return targets.length > 0 ? targets : target ? target.target : null
          }
          var task = gantt.getTask(id)
          self.$store.dispatch('setSelectedDialogTask', task)
          var pred = getPredecessor(id)
          if (!pred) {
            self.$store.dispatch('setPredecessor', false)
          } else {
            self.$store.dispatch('setPredecessor', true)
            if (Array.isArray(pred)) {
              var predecessors = []
              for (let index = 0; index < pred.length; index++) {
                const element = pred[index]
                // eslint-disable-next-line
                const task = gantt.getTask(element)
                // eslint-disable-next-line
                predecessors.push(task)
              }
              self.$store.dispatch('setPredecessorsTasks', predecessors)
            } else {
              var predecessor = []
              // eslint-disable-next-line
              const task = gantt.getTask(pred)
              // eslint-disable-next-line
              predecessor.push(task)
              self.$store.dispatch('setPredecessorsTasks', predecessor)
            }
          }
          //
          var succ = getSuccessor(id)
          if (!succ) {
            self.$store.dispatch('setSuccessor', false)
          } else {
            self.$store.dispatch('setSuccessor', true)
            if (Array.isArray(succ)) {
              var successors = []
              for (let index = 0; index < succ.length; index++) {
                const element = succ[index]
                // eslint-disable-next-line
                const task = gantt.getTask(element)
                // eslint-disable-next-line
                successors.push(task)
              }
              self.$store.dispatch('setSuccessorsTasks', successors)
            } else {
              var successor = []
              // eslint-disable-next-line
              const task = gantt.getTask(succ)
              // eslint-disable-next-line
              successor.push(task)
              self.$store.dispatch('setSuccessorsTasks', successor)
            }
          }
          // var formatFunc = gantt.date.date_to_str('%Y-%m-%d')
          // var date = formatFunc(new Date(2013, 05, 29))
          var workload = []
          var taskResources = task.executor_id || []
          var workloadResources = gantt.serverList('workload')
          for (let r = 0; r < taskResources.length; r++) {
            const rId = taskResources[r].resource_id
            var filterWorkload = workloadResources.filter(f => Number(f.userId) === Number(rId))
            workload = workload.concat(filterWorkload)
          }
          self.$store.dispatch('setWorkload', workload)
          self.$store.dispatch('setIsMainTask', true)
          self.$store.dispatch('setTaskRequirements', task.wasd_Requirement)
          self.$store.dispatch('setTaskHistory', { id: task.task_id, date: task.CreationDate })
          self.$store.dispatch('setTabDialogTask', null)
          self.$store.dispatch('setTaskDialogVisible', true)
          return false
        })
        gantt.attachEvent('onLinkClick', function (id, e) {
          console.log(gantt.getLink(id))
        })
        // load workload resources
        var workload = await utils.getWorkloadPortfolio()
        // self.$store.dispatch('setWorkload', workload)
        gantt.serverList('workload', workload)
        gantt.$_eventsInitialized = true
      }
    },
    $_initDataProcessor () {
      // if (!gantt.$_dataProcessorInitialized) {
      //   gantt.createDataProcessor((entity, action, data, id) => {
      //     this.$emit(`${entity}-updated`, id, action, data)
      //   })
      //   gantt.$_dataProcessorInitialized = true
      // }
    },
    initContextMenu () {
      const self = this
      this.$nextTick()
      this.$nextTick(() => {
        (function () {
          'use strict'
          // ////////////////////////////////////////////////////////////////////////////
          // ////////////////////////////////////////////////////////////////////////////
          //
          // H E L P E R    F U N C T I O N S
          //
          // ////////////////////////////////////////////////////////////////////////////
          // ////////////////////////////////////////////////////////////////////////////
          /**
           * Function to check if we clicked inside an element with a particular class
           * name.
           *
           * @param {Object} e The event
           * @param {String} className The class name to check against
           * @return {Boolean}
           */
          function clickInsideElement (e, className) {
            // gantt.ext.tooltips.tooltip.hide()
            // console.log('clickInsideElement', e)
            var el = e.srcElement || e.target
            if (el.classList.contains(className)) { // context-menu__link
              // console.log('clickInsideElement', el)
              return el
            } else {
              if (el.parentNode && el.parentNode.offsetParent && el.parentNode.offsetParent.classList.contains(className)) {
                // console.log('clickInsideElement', el)
                return el.parentNode.offsetParent
              }
              // while (el === el.parentNode) {
              //   if (el.classList && el.classList.contains(className)) {
              //     console.log('clickInsideElement', el)
              //     return el
              //   }
              // }
            }
            return false
          }
          /**
           * Get's exact position of event.
           *
           * @param {Object} e The event passed in
           * @return {Object} Returns the x and y position
           */
          function getPosition (e) {
            var posx = 0
            var posy = 0
            // var wasdApp = wasd != undefined ? true : false;
            // eslint-disable-next-line
            if (!e) var e = window.event
            var elm = document.querySelector('.ganttview').getBoundingClientRect() // ganttview .left-container
            // console.log(elm)
            if (e.pageX || e.pageY) {
              posx = e.pageX
              posy = e.pageY
            } else if (e.clientX || e.clientY) {
              posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
              posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
            }
            return {
              x: posx - elm.x,
              y: posy - elm.y
            }
          }
          // ////////////////////////////////////////////////////////////////////////////
          // ////////////////////////////////////////////////////////////////////////////
          //
          // C O R E    F U N C T I O N S
          //
          // ////////////////////////////////////////////////////////////////////////////
          // ////////////////////////////////////////////////////////////////////////////
          /**
           * Variables.
           */
          // var contextMenuClassName = 'context-menu'
          // var contextMenuItemClassName = 'context-menu__item'
          var contextMenuLinkClassName = 'context-menu__span'
          var contextMenuActive = 'context-menu--active'
          var taskItemClassName = 'gantt_row' // gantt_row gantt_cell gantt_tree_content gantt_tree_indent gantt_task_content
          var taskItemInContext
          var clickCoords
          var clickCoordsX
          var clickCoordsY
          var menu = document.querySelector('#context-menu')
          // var menuItems = menu.querySelectorAll('.context-menu__item')
          var menuState = 0
          var menuWidth
          var menuHeight
          // var menuPosition
          // var menuPositionX
          // var menuPositionY
          var windowWidth
          var windowHeight
          /**
           * Initialise our application's code.
           */
          function init () {
            contextListener()
            clickListener()
            keyupListener()
            resizeListener()
            // console.log('init')
          }
          /**
           * Listens for contextmenu events.
           */
          function contextListener () {
            document.addEventListener('contextmenu', function (e) {
              taskItemInContext = clickInsideElement(e, taskItemClassName) // gantt_cell gantt_tree_content gantt_tree_indent gantt_task_content
              if (taskItemInContext) {
                var id = taskItemInContext.getAttribute('data-task-id')
                // console.log('data-task-id', id)
                // setSelectedDialogTask
                var currentTask = gantt.getTask(id)
                self.$store.dispatch('setSelectedDialogTask', currentTask)
                gantt.unselectTask()
                var pre = getPredecessor(id)
                if (!pre) {
                  self.$store.dispatch('setPredecessor', false)
                } else {
                  self.$store.dispatch('setPredecessor', true)
                }
                var suc = getSuccessor(id)
                if (!suc) {
                  self.$store.dispatch('setSuccessor', false)
                } else {
                  self.$store.dispatch('setSuccessor', true)
                }
                gantt.selectTask(id)
                e.preventDefault()
                toggleMenuOn()
                positionMenu(e)
              } else {
                taskItemInContext = null
                toggleMenuOff()
              }
            })
          }
          /**
           * Listens for click events.
           */
          function clickListener () {
            document.addEventListener('click', function (e) {
              var clickeElIsLink = clickInsideElement(e, contextMenuLinkClassName)
              if (clickeElIsLink) {
                // console.log('clickListener', clickeElIsLink)
                e.preventDefault()
                menuItemListener(clickeElIsLink)
              } else {
                var button = e.which || e.button
                if (button === 1) {
                  toggleMenuOff()
                }
              }
            })
          }
          /**
           * Listens for keyup events.
           */
          function keyupListener () {
            window.onkeyup = function (e) {
              if (e.keyCode === 27) {
                toggleMenuOff()
              }
            }
          }
          /**
           * Window resize event listener
           */
          function resizeListener () {
            window.onresize = function (e) {
              toggleMenuOff()
            }
          }
          /**
           * Turns the custom context menu on.
           */
          function toggleMenuOn () {
            if (menuState !== 1) {
              menuState = 1
              menu.classList.add(contextMenuActive)
            }
          }
          /**
           * Turns the custom context menu off.
           */
          function toggleMenuOff () {
            if (menuState !== 0) {
              menuState = 0
              menu.classList.remove(contextMenuActive)
            }
          }
          /**
           * Positions the menu properly.
           *
           * @param {Object} e The event
           */
          function positionMenu (e) {
            clickCoords = getPosition(e)
            clickCoordsX = clickCoords.x
            clickCoordsY = clickCoords.y
            menuWidth = menu.offsetWidth + 4
            menuHeight = menu.offsetHeight + 4
            windowWidth = document.documentElement.clientWidth
            windowHeight = document.documentElement.clientHeight
            if ((windowWidth - clickCoordsX) < menuWidth) {
              menu.style.left = windowWidth - menuWidth - 1 + 'px'
            } else {
              menu.style.left = clickCoordsX - 1 + 'px'
            }
            if ((windowHeight - clickCoordsY) < menuHeight) {
              menu.style.top = windowHeight - menuHeight + 1 + 'px'
            } else {
              menu.style.top = clickCoordsY + 1 + 'px'
            }
          }

          function getPredecessor (id) {
            var taskObj = gantt.getTask(id)
            var predecessors = taskObj.$target || null
            var target = {}
            var targets = []
            if (predecessors && predecessors.length > 1) {
              for (let index = 0; index < predecessors.length; index++) {
                targets.push(gantt.getLink(predecessors[index]).source)
              }
            } else {
              target = gantt.getLink(predecessors[0]) || null
            }
            return targets.length > 0 ? targets : target ? target.source : null
          };
          function getSuccessor (id) {
            var taskObj = gantt.getTask(id)
            var successors = taskObj.$source || null
            var target = {}
            var targets = []
            if (successors && successors.length > 1) {
              for (let index = 0; index < successors.length; index++) {
                targets.push(gantt.getLink(successors[index]).target)
              }
            } else {
              target = gantt.getLink(successors[0]) || null
            }
            return targets.length > 0 ? targets : target ? target.target : null
          }
          /**
           * Dummy action function that logs an action when a menu item link is clicked
           *
           * @param {HTMLElement} link The link that was clicked
           */
          function menuItemListener (link) {
            var id = taskItemInContext.getAttribute('data-task-id')
            var linkAction = link.getAttribute('data-action')
            switch (linkAction) {
              case 'view':
                // gantt.showLightbox(id)
                var pred = getPredecessor(id)
                // console.log('predecessor', pred)
                if (!pred) {
                  self.$store.dispatch('setPredecessor', false)
                  // console.log('Нет предшественника', self.predecessor)
                } else {
                  self.$store.dispatch('setPredecessor', true)
                  if (Array.isArray(pred)) {
                    // select menu gantt.getTask(id)
                    var predecessors = []
                    for (let index = 0; index < pred.length; index++) {
                      const element = pred[index]
                      // eslint-disable-next-line
                      const task = gantt.getTask(element)
                      // eslint-disable-next-line
                      var formatFunc = gantt.date.date_to_str('%d.%m.%Y')
                      predecessors.push(task)
                    }
                    // console.log('predecessors', predecessors)
                    self.$store.dispatch('setPredecessorsTasks', predecessors)
                    // self.$store.dispatch('setDialogCaption', 'Выберите предшественника для перехода')
                    // self.$store.dispatch('setTaskDialogVisible', true)
                    // console.log(pred)
                  } else {
                    // console.log(pred)
                    var predecessor = []
                    // eslint-disable-next-line
                    const task = gantt.getTask(pred)
                    // eslint-disable-next-line
                    var formatFunc = gantt.date.date_to_str('%d.%m.%Y')
                    predecessor.push(task)
                    // console.log('predecessors', predecessor)
                    self.$store.dispatch('setPredecessorsTasks', predecessor)
                    // self.$store.dispatch('setTaskDialogVisible', true)
                    // gantt.showTask(pred)
                    // gantt.unselectTask()
                    // gantt.selectTask(pred)
                  }
                }
                //
                var succ = getSuccessor(id)
                // console.log(succ)
                if (!succ) {
                  self.$store.dispatch('setSuccessor', false)
                  // console.log('Нет последователя', self.successor)
                } else {
                  self.$store.dispatch('setSuccessor', true)
                  if (Array.isArray(succ)) {
                    // select menu gantt.getTask(id)
                    var successors = []
                    for (let index = 0; index < succ.length; index++) {
                      const element = succ[index]
                      // eslint-disable-next-line
                      const task = gantt.getTask(element)
                      // eslint-disable-next-line
                      var formatFunc = gantt.date.date_to_str('%d.%m.%Y')
                      successors.push(task)
                    }
                    // console.log('successors', successors)
                    self.$store.dispatch('setSuccessorsTasks', successors)
                    // self.$store.dispatch('setDialogCaption', 'Выберите последователя для перехода')
                    // self.$store.dispatch('setTaskDialogVisible', true)
                    // console.log(succ)
                  } else {
                    // console.log(succ)
                    var successor = []
                    // eslint-disable-next-line
                    const task = gantt.getTask(succ)
                    // eslint-disable-next-line
                    var formatFunc = gantt.date.date_to_str('%d.%m.%Y')
                    successor.push(task)
                    // console.log('successors', successor)
                    self.$store.dispatch('setSuccessorsTasks', successor)
                    // self.$store.dispatch('setTaskDialogVisible', true)
                    // gantt.showTask(succ)
                    // gantt.unselectTask()
                    // gantt.selectTask(succ)
                  }
                }
                // self.$store.dispatch('setDialogCaption', 'Просмотр задачи')
                const task = gantt.getTask(id)

                var workload = []
                var taskResources = task.executor_id || []
                var workloadResources = gantt.serverList('workload')
                for (let r = 0; r < taskResources.length; r++) {
                  const rId = taskResources[r].resource_id
                  var filterWorkload = workloadResources.filter(f => Number(f.userId) === Number(rId))
                  workload = workload.concat(filterWorkload)
                }
                self.$store.dispatch('setWorkload', workload)
                self.$store.dispatch('setIsMainTask', true)
                self.$store.dispatch('setTaskRequirements', task.wasd_Requirement)
                self.$store.dispatch('setTaskHistory', { id: task.task_id, date: task.CreationDate })
                self.$store.dispatch('setTabDialogTask', null)
                self.$store.dispatch('setTaskDialogVisible', true)
                break
              case 'predecessor':
                // var pred = getPredecessor(id)
                // console.log('predecessor', pred)
                // if (!pred) {
                //   self.$store.dispatch('setPredecessor', false)
                //   console.log('Нет предшественника', self.predecessor)
                // } else {
                //   self.$store.dispatch('setPredecessor', true)
                //   if (Array.isArray(pred)) {
                //     // select menu gantt.getTask(id)
                //     self.$store.dispatch('setPredecessorsTasks', pred)
                //     self.$store.dispatch('setDialogCaption', 'Выберите предшественника для перехода')
                //     self.$store.dispatch('setTaskDialogVisible', true)
                //     // console.log(pred)
                //   } else {
                //     // console.log(pred)
                //     gantt.showTask(pred)
                //     gantt.unselectTask()
                //     gantt.selectTask(pred)
                //   }
                // }
                break
              case 'successor':
                // var succ = getSuccessor(id)
                // console.log(succ)
                // if (!succ) {
                //   self.$store.dispatch('setSuccessor', false)
                //   console.log('Нет последователя', self.successor)
                // } else {
                //   self.$store.dispatch('setSuccessor', true)
                //   if (Array.isArray(succ)) {
                //     // select menu gantt.getTask(id)
                //     self.$store.dispatch('setPredecessorsTasks', succ)
                //     self.$store.dispatch('setDialogCaption', 'Выберите последователя для перехода')
                //     self.$store.dispatch('setTaskDialogVisible', true)
                //     // console.log(succ)
                //   } else {
                //     // console.log(succ)
                //     gantt.showTask(succ)
                //     gantt.unselectTask()
                //     gantt.selectTask(succ)
                //   }
                // }
                break
              default:
                break
            }
            // console.log('Task: ' + gantt.getTask(id).id + ', action: ' + linkAction + ',text: ' + gantt.getTask(id).text)
            toggleMenuOff()
          }
          /**
           * Run the app.
           */
          init()
        })()
      })
    }
  }
}
</script>

<style>
  /* @import "~dhtmlx-gantt/codebase/skins/dhtmlxgantt_meadow.css"; */
  @import '~dhtmlx-gantt/codebase/skins/dhtmlxgantt_skyblue.css';
  /* @import "~dhtmlx-gantt/codebase/skins/dhtmlxgantt_broadway.css"; */
  @import '../../styles/gantt.css';
  @import '../../styles/controls_styles.css';
  /* Chart.js */
  @-webkit-keyframes chartjs-render-animation{from{opacity:0.99}to{opacity:1}}
  @keyframes chartjs-render-animation{from{opacity:0.99}to{opacity:1}}.chartjs-render-monitor{-webkit-animation:chartjs-render-animation 0.001s;animation:chartjs-render-animation 0.001s;}
</style>
