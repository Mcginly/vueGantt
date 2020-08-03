<template>
  <div id="ganttview" class="ganttview" ref="gantt" />
</template>

<script>
import { gantt } from 'dhtmlx-gantt'
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
// import utils from '../../config/utils'
import ganttinitial from './ganttinitial'
import store from '../../store'

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
      'successor'
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
      // gantt.$doFilter = function (value) {
      //   this.search = value
      //   gantt.refreshData()
      // }
      // let planId = this.planId // 10710 13838 16185
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
      // gantt = await this.$ganttres.ganttRes(gantt)
      //
      // let startLoading = Date.now()
      // gantt.attachEvent('onLoadStart', async function(){
      //   gantt.message('Начинаем загрузку...')
      //   gantt.serverList('dates', await planData.getTestDates('7576'))
      // })
      //
      gantt.load(`http://wasd:3000/proddata/${this.planId}`)
      //
      // gantt.config.fit_tasks = true
      gantt.init(this.$refs.gantt)
      this.initContextMenu()
      // gantt.parse(this.$props.tasks)
      this.$_initDataProcessor()
      // this.$store.dispatch('setLoading', false)
    },
    async $_initGanttEvents () {
      if (!gantt.$_eventsInitialized) {
        //
        gantt.attachEvent('onBeforeTaskDisplay', function (id, task) {
          let completed = store.getters.completed
          if (completed === true) {
            // console.log(task.CompletePercent)
            if (task.CompletePercent === '100') {
              // console.log('sortTest-filter-yes')
              return true
            }
          }
           return false
        })
        // gantt.attachEvent('onGanttRender', function () {
        //   var element = document.getElementById('completed')
        //   //element.onclick = element.select()
        //   //gantt.$root.querySelector('[data-text-filter]').value = filterValue
        // })
        //
        gantt.attachEvent('onLoadEnd', () => {
          let endLoading = Date.now()
          // Markers
          // var dateToStr = gantt.date.date_to_str(gantt.config.task_date)
          // var today = new Date()
          // gantt.addMarker({
          //   start_date: today,
          //   css: 'today',
          //   text: 'Сегодня',
          //   title: dateToStr(today)
          // })
          // var projectstart = new Date(gantt.serverList('dates')[0].StartDate)
          // gantt.addMarker({
          //   start_date: projectstart,
          //   css: 'status_line',
          //   text: 'Старт',
          //   title: dateToStr(projectstart)
          // })
          // var projectEnd = new Date(gantt.serverList('dates')[0].FinishDate)
          // gantt.addMarker({
          //   start_date: projectEnd,
          //   css: 'finish',
          //   text: 'Завершение',
          //   title: dateToStr(projectEnd)
          // })
          this.$store.dispatch('setEndLoading', endLoading)
          this.$store.dispatch('setLoading', false)
          console.log('Загрузка завершена за ', (endLoading - this.$store.getters.startLoading) / 1000)
          try {
            // gantt.config.open_tree_initially = true
            gantt.eachTask(function (task) {
              if (task.type === gantt.config.types.subplan) {
                task.$open = true
              }
            })
            gantt.render()
            let tasksUnsorted = gantt.getTaskByTime()
            for (let i = 0; i < tasksUnsorted.length; i++) {
              tasksUnsorted[i].global_id = tasksUnsorted[i].$index + 1
            }
            this.$props.tasks.data = tasksUnsorted
            gantt.eachTask(function (task) {
              if (task.type === gantt.config.types.subplan) {
                task.$open = false
              }
            })
            gantt.refreshData()
          } catch (error) {
            console.log(error)
          }
          // gantt.ext.zoom.zoomOut()
        })
        gantt.attachEvent('onTaskSelected', (id) => {
          let task = gantt.getTask(id)
          this.$emit('task-selected', task)
          console.log('onTaskSelected', task)
          this.$store.dispatch('setSelectedTask', task)
          this.$store.dispatch('setSelectedTaskId', id)
          this.selectedTaskId = id
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
        let self = this
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
          self.$store.dispatch('setTaskRequirements', task.WASD_Requirement)
          self.$store.dispatch('setTaskHistory', { id: task.task_id, date: task.CreationDate })
          self.$store.dispatch('setTabDialogTask', null)
          self.$store.dispatch('setTaskDialogVisible', true)
          return false
        })
        gantt.$_eventsInitialized = true
      }
    },
    $_initDataProcessor () {
      if (!gantt.$_dataProcessorInitialized) {
        gantt.createDataProcessor((entity, action, data, id) => {
          this.$emit(`${entity}-updated`, id, action, data)
        })
        gantt.$_dataProcessorInitialized = true
      }
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
                console.log('data-task-id', id)
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
                console.log('predecessor', pred)
                if (!pred) {
                  self.$store.dispatch('setPredecessor', false)
                  console.log('Нет предшественника', self.predecessor)
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
                    console.log('predecessors', predecessors)
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
                    console.log('predecessors', predecessor)
                    self.$store.dispatch('setPredecessorsTasks', predecessor)
                    // self.$store.dispatch('setTaskDialogVisible', true)
                    // gantt.showTask(pred)
                    // gantt.unselectTask()
                    // gantt.selectTask(pred)
                  }
                }
                //
                var succ = getSuccessor(id)
                console.log(succ)
                if (!succ) {
                  self.$store.dispatch('setSuccessor', false)
                  console.log('Нет последователя', self.successor)
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
                    console.log('successors', successors)
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
                    console.log('successors', successor)
                    self.$store.dispatch('setSuccessorsTasks', successor)
                    // self.$store.dispatch('setTaskDialogVisible', true)
                    // gantt.showTask(succ)
                    // gantt.unselectTask()
                    // gantt.selectTask(succ)
                  }
                }
                // self.$store.dispatch('setDialogCaption', 'Просмотр задачи')
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
  /* @import "~dhtmlx-gantt/codebase/dhtmlxgantt.css"; */
  /* @import "~dhtmlx-gantt/codebase/skins/dhtmlxgantt_meadow.css"; */
  @import "~dhtmlx-gantt/codebase/skins/dhtmlxgantt_skyblue.css";
  /* @import "~dhtmlx-gantt/codebase/skins/dhtmlxgantt_broadway.css"; */
  .ganttview {
    height: 100%;
  }
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  .container {
    height: 100%;
    width: 100%;
  }
  .left-container {
    overflow: hidden;
    position: relative;
    height: 100%;
  }
  .planTask {
    background-image: url(http://wasd/Content/js/icons/project-task.png);
  }
  .planSubPlan {
    background-image: url(http://wasd/Content/js/icons/subproject.png);
  }
  .planMilestone {
    background-image: url(http://wasd/Content/js/icons/milestone.png);
  }
  .planPhaseTask {
    background-image: url(http://wasd/Content/js/icons/phase-task.png);
  }
  .task_groups {
    background-color: rgb(255, 153, 0) !important;
  }

  .task_groups .gantt_task_progress {
    background-color: rgb(214, 129, 1);
    opacity: 0.6;
  }
  /* .hide_project_progress_drag .gantt_task_progress_drag {
    visibility: hidden;
  } */
  .gantt_row_placeholder {
    visibility: hidden;
  }
  .subplan_task {
    border: 2px solid rgba(138, 42, 106, 0.342);
    color: #d8dee4;
    background: rgb(206, 60, 157);
  }
  .subplan_task .gantt_task_progress {
    background: rgba(129, 38, 99, 0.651);
  }
  /* .phase_task {
    border: 2px solid rgba(18, 124, 32, 0.342);
    color: #dee1e4;
    background: rgba(50, 173, 50, 0.719);
  }
  .phase_task .gantt_task_progress {
    background: rgba(26, 133, 62, 0.651);
  } */
  .green .gantt_cell, .odd.green .gantt_cell, .green .gantt_task_cell, .odd.green .gantt_task_cell {
    border: 0px;
    color: rgba(224, 241, 224, 0.9);
    background-color: rgba(243, 243, 243, 0.9);
  }
  .expired_inwork .gantt_cell, .odd.expired_inwork .gantt_cell, .expired_inwork .gantt_task_cell, .odd.expired_inwork .gantt_task_cell {
    background-color: rgba(243, 228, 92, 0.25);
  }
  .expired_tasks .gantt_cell, .odd.expired_tasks .gantt_cell, .expired_tasks .gantt_task_cell, .odd.expired_tasks .gantt_task_cell {
    background-color: rgba(228, 198, 190, 0.25);
  }
  .weekend {
    background: #f4f7f4 !important;
  }
  .gantt_selected .weekend {
    background:#FFF3A1 !important;
  }
  /*  */
  .phase_task {
    border: 1px solid rgba(12, 66, 19, 0.342);
    color: #dee1e4;
    background: rgba(50, 173, 50, 0.719);
  }
  .phase_task .gantt_task_progress {
    background: rgba(26, 133, 62, 0.651);
  }
  /*  */
  .custom-project {
    position: absolute;
    height: 8px;
    color: #ffffff;
    background-color: rgb(20, 114, 51);
  }
  .custom-project .gantt_task_progress {
    background-color: rgb(110, 121, 114) !important;
  }
  .custom-project div {
    position: absolute;
  }
  .project-left, .project-right {
    top: 8px;
    background-color: transparent;
    border-style: solid;
    width: 0px;
    height: 0px;
  }
  .project-left {
    left: 0px;
    border-width: 0px 0px 8px 7px;
    border-top-color: transparent;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    border-left-color: rgb(20, 114, 51) !important;
  }
  .project-right {
    right: 0px;
    border-width: 0px 7px 8px 0px;
    border-top-color: transparent;
    border-right-color: rgb(20, 114, 51);
    border-bottom-color: transparent !important;
    border-left-color: transparent;
  }
  /*  */
  .gantt_link_arrow {
    border-color: rgb(20, 114, 51);
  }
  .gantt_task_line.gantt_milestone .gantt_task_content {
    height: 16px !important;
    line-height: 18px !important;
    width: 16px !important;
    margin-top: 2px !important;
    margin-left: 2px !important;
  }
  .gantt_link_arrow_right {
    border-width: 3px 0 4px 6px !important;
    margin-top: 0px !important;
  }
  .gantt_link_arrow_left {
    border-width: 3px 6px 3px 0 !important;
    margin-top: 0px !important;
  }
  #search {
    width: 290px;
    height: 26px;
    margin-left: 25px;
    padding: 0px 3px;
    border: 1px solid #90A4AE;
    border-radius: 4px;
    font-size: 12px;
    background-color: #ECEFF1;
    background-image: url(https://d2zjg0qo565n2.cloudfront.net/sites/default/files/2016-rebrand/header-icons/Homepage_Search_Icon.png);
    background-position: 2px 2px;
    background-repeat: no-repeat;
    padding-left: 26px;
  }
  #search:focus {
    border-radius: 4px;
  }
</style>
