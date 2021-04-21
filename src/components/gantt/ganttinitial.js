import { isArray } from 'core-js/fn/array'
// import getdata from '../../config/utils'
import store from '../../store'
import utils from '../../config/utils'
// import { Math } from 'core-js'

export default {
  async ganttInitialConfig (gantt) {
    gantt.config.types['phase'] = 'phase'
    gantt.config.types['subplan'] = 'subplan'
    // gantt.config.date_format = '%Y-%m-%d %H:%i:%s'
    gantt.config.xml_date = '%Y-%m-%d %H:%i:%s'
    gantt.config.date_grid = '%d.%m.%Y'
    gantt.locale.date.month_full = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    gantt.locale.date.month_short = ['Янв', 'Фев', 'Maр', 'Aпр', 'Maй', 'Июн', 'Июл', 'Aвг', 'Сен', 'Окт', 'Ноя', 'Дек']
    gantt.locale.date.day_full = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    gantt.locale.date.day_short = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    gantt.locale.labels = {
      plandate_enable_button: 'Установить',
      plandate_disable_button: 'Удалить',
      section_parent: 'Родительская задача',
      section_plandate: 'Прогноз',
      type_phase: 'Фазовая задача',
      type_subplan: 'Вложенный план',
      section_priority: 'Приоритет',
      column_owner: 'Исполнитель',
      section_owner: 'Исполнитель',
      new_task: 'Новая задача',
      dhx_cal_today_button: 'Сегодня',
      day_tab: 'День',
      week_tab: 'Неделя',
      month_tab: 'Месяц',
      new_event: 'Новое событие',
      icon_save: 'Сохранить',
      icon_cancel: 'Отменить',
      icon_details: 'Детали',
      icon_edit: 'Изменить',
      icon_delete: 'Удалить',
      confirm_closing: '',
      confirm_deleting: 'Событие будет удалено безвозвратно, продолжить?',
      section_description: 'Описание',
      section_time: 'Срок исполнения',
      section_type: 'Тип',
      column_wbs: 'ИСР',
      column_text: 'Задача',
      column_start_date: 'Начало',
      column_end_date: 'Завершение',
      column_duration: 'Длительность',
      column_add: '',
      link: 'Связь',
      confirm_link_deleting: 'будет удалена',
      link_start: ' (начало)',
      link_end: ' (конец)',
      type_task: 'Задача',
      type_project: 'Суммарная задача',
      type_milestone: 'Контрольная точка',
      minutes: 'Минута',
      hours: 'Час',
      days: 'День',
      weeks: 'Неделя',
      months: 'Месяц',
      years: 'Год',
      message_ok: 'OK',
      message_cancel: 'Отменить',
      section_constraint: 'Constraint',
      constraint_type: 'Constraint type',
      constraint_date: 'Constraint date',
      asap: 'As Soon As Possible',
      alap: 'As Late As Possible',
      snet: 'Start No Earlier Than',
      snlt: 'Start No Later Than',
      fnet: 'Finish No Earlier Than',
      fnlt: 'Finish No Later Than',
      mso: 'Must Start On',
      mfo: 'Must Finish On',
      resources_filter_placeholder: 'начните вводить слово для фильтрации',
      resources_filter_label: 'спрятать не установленные'
    }
    //
    // gantt.i18n.setLocale('ru')
    //
    // resources
    gantt.config.resource_store = 'resource'
    gantt.config.resource_property = 'executor_id'
    // end resources
    gantt.config.min_column_width = 30
    gantt.config.scale_height = 75
    gantt.config.row_height = 24
    //
    gantt.config.duration_unit = 'hour'
    gantt.config.duration_step = 1
    gantt.config.work_time = true
    gantt.config.correct_work_time = true
    gantt.config.round_dnd_dates = false
    //
    gantt.config.auto_scheduling = true
    gantt.config.auto_scheduling_initial = true
    gantt.config.auto_scheduling_strict = true
    // gantt.config.auto_scheduling_move_projects = true
    // gantt.config.auto_scheduling_descendant_links = true
    gantt.config.auto_scheduling_compatibility = false
    var globalShedule = await utils.getGlobalShedule()
    for (let i = 0; i < globalShedule.length; i++) {
      const day = globalShedule[i]
      gantt.setWorkTime({ date: new Date(day.DateStart), hours: false })
    }
    var exceptionShedule = await utils.getGlobalExceptionShedule()
    for (let i = 0; i < exceptionShedule.length; i++) {
      const dayEx = exceptionShedule[i]
      gantt.setWorkTime({ date: new Date(dayEx.DateStart) })
    }
    // gantt.setWorkTime({ date: new Date(2021, 1, 20) })
    gantt.setWorkTime({ hours: [9, 13, 14, 18] })
    //
    gantt.config.order_branch = true
    gantt.config.order_branch_free = true
    gantt.config.sort = true
    // gantt.config.smart_rendering = true
    // gantt.config.keyboard_navigation_cells = true
    gantt.config.show_unscheduled = true
    gantt.config.placeholder_task = false
    // gantt.config.auto_types = true
    // gantt.config.details_on_create = true
    gantt.config.link_line_width = 1
    gantt.config.keep_grid_width = false
    // gantt.config.grid_resize = true
    // gantt.config.readonly = true
    gantt.config.grid_elastic_columns = true
    //
    // gantt.templates.scale_cell_class = function (date) {
    //   if (gantt.getScale().unit === 'day') { // dayone daytwo day
    //     if (date.getDay() === 0 || date.getDay() === 6) {
    //       return 'weekend'
    //     }
    //   }
    // }
    // gantt.templates.timeline_cell_class = function (item, date) {
    //   if (gantt.getScale().unit === 'day') {
    //     if (date.getDay() === 0 || date.getDay() === 6) {
    //       return 'weekend'
    //     }
    //   }
    // }
    //
    function shouldHighlightTask (task) {
      var s = gantt.$resourcesStore
      var taskResource = task[gantt.config.resource_property]
      var selectedResource = s.getSelectedId()
      var find
      if (isArray(taskResource) && taskResource.length > 0) {
        find = taskResource.find(f => f.resource_id === Number(selectedResource))
      }
      if (task.mainExecutor === selectedResource || find || s.isChildOf(taskResource, selectedResource)) {
        return true
      }
    }
    //
    gantt.templates.task_text = function (start, end, task) {
      return ''
    }
    gantt.templates.rightside_text = function (start, end, task) {
      // if (store.getters.viewPredicted) {
      //   if (task.planned_end) {
      //     if (end.getTime() > task.planned_end.getTime()) {
      //       var overdue = Math.ceil(Math.abs((end.getTime() - task.planned_end.getTime()) / (24 * 60 * 60 * 1000)));
      //       var text = "<b>Overdue: " + overdue + " days</b>";
      //       return text;
      //     }
      //   }
      // } else {
      //   return task.text
      // }
      return task.text
    }
    gantt.templates.grid_folder = function (item) {
      switch (item.pic_type) {
        case 'task':
          return `<div class='gantt_tree_icon planTask'></div>`
        case 'project':
          return `<div class='gantt_tree_icon projectTask'></div>`
        case 'milestone':
          return `<div class='gantt_tree_icon planMilestone'></div>`
        case 'phase':
          return `<div class='gantt_tree_icon planPhaseTask'></div>`
        case 'subplan':
          return `<div class='gantt_tree_icon planSubPlan'></div>`
        default:
          return ''
      }
    }
    gantt.templates.grid_file = function (item) {
      switch (item.pic_type) {
        case 'task':
          return `<div class='gantt_tree_icon planTask'></div>`
        case 'project':
          return `<div class='gantt_tree_icon projectTask'></div>`
        case 'milestone':
          return `<div class='gantt_tree_icon planMilestone'></div>`
        case 'phase':
          return `<div class='gantt_tree_icon planPhaseTask'></div>`
        case 'subplan':
          return `<div class='gantt_tree_icon planSubPlan'></div>`
        default:
          return ''
      }
    }
    //
    gantt.config.type_renderers[gantt.config.types.project] = function (task) {
      // gantt.config.type_renderers[gantt.config.types.phase] = function (task) {
      var mainEl = document.createElement('div')
      mainEl.setAttribute(gantt.config.task_attribute, task.id)
      var size = gantt.getTaskPosition(task)
      mainEl.innerHTML = [
        `<div class='custom-project-left'></div>`,
        `<div class='custom-project-right'></div>`
      ].join('')
      mainEl.className = 'custom-project'
      mainEl.style.left = size.left + 'px'
      mainEl.style.top = size.top + 7 + 'px'
      mainEl.style.width = size.width + 'px'
      return mainEl
    }
    // store
    gantt.templates.task_class = function (start, end, task) {
      if (task.type === gantt.config.types.phase) {
        return 'phase_task'
      } else {
        if (task.type === gantt.config.types.subplan) {
          return 'subplan_task'
        } else {
          if (task.type === gantt.config.types.project || task.pic_type === 'project') {
            // return 'project_task'
            return 'custom-project'
          } else {
            return ''
          }
        }
      }
    }
    gantt.templates.progress_text = function (start, end, task) {
      return `<span style='text-align:left; color: white; font-size:10pt;'>${Math.ceil((task.closed === 1 ? 1 : task.progress) * 100)}%</span>`
    }
    // begin summary
    // function calculateSummaryProgress (task) {
    //   if (task.type === gantt.config.types.task || task.type === gantt.config.types.milestone) return task.closed === 1 ? 1 : task.progress
    //   var totalToDo = 0
    //   var totalDone = 0
    //   gantt.eachTask(function (child) {
    //     if (child.type === gantt.config.types.task || child.type === gantt.config.types.milestone || child.type === gantt.config.types.subplan || child.type === gantt.config.types.phase) {
    //       totalToDo += child.duration
    //       totalDone += ((child.closed === 1 ? 1 : child.progress) || 0) * child.duration
    //     }
    //   }, task.id)
    //   if (!totalToDo) return 0
    //   else return totalDone / totalToDo
    // }
    function calculateSummaryProgress (task) {
      let percents = []
      const average = arr => arr.reduce((sum, el) => sum + el, 0) / arr.length
      //
      function calcChild (task) {
        gantt.eachTask(function (child) {
          if (!gantt.hasChild(child.id)) {
            percents.push(child.closed === 1 ? 1 : Number(child.CompletePercent) / 100)
          } else {
            calcChild(child)
          }
        }, task.id)
      }
      //
      if (gantt.hasChild(task.id)) {
        calcChild(task)
      } else {
        percents.push(task.closed === 1 ? 1 : Number(task.CompletePercent) / 100)
      }
      return percents.length > 0 ? average(percents) : 0 // Number(Number(average(percents)).toFixed(2))
    }
    // eslint-disable-next-line
    // function refreshSummaryProgress (id, submit) {
    //   if (!gantt.isTaskExists(id)) return
    //   var task = gantt.getTask(id)
    //   task.progress = calculateSummaryProgress(task)
    //   if (!submit) {
    //     gantt.refreshTask(id)
    //   } else {
    //     gantt.updateTask(id)
    //   }
    //   if (!submit && gantt.getParent(id) !== gantt.config.root_id) {
    //     refreshSummaryProgress(gantt.getParent(id), submit)
    //   }
    // }
    gantt.attachEvent('onParse', function () {
      gantt.eachTask(function (task) {
        // gantt.roundTaskDates(task)
        task.progress = calculateSummaryProgress(task)
      })
    })
    gantt.attachEvent('onAfterTaskUpdate', function (id) {
      // refreshSummaryProgress(gantt.getParent(id), true)
    })
    gantt.attachEvent('onTaskDrag', function (id) {
      // refreshSummaryProgress(gantt.getParent(id), false)
    })
    // function formatEndDate (date, template) {
    //   // get 23:59:59 instead of 00:00:00 for the end date
    //   return template(new Date(date.valueOf() - 1))
    // }
    // eslint-disable-next-line
    // function expiredChildrenTasksDate (task) {
    //   if (task.expired === 1) {
    //     // let dateToStr = gantt.date.date_to_str('%d.%m.%Y')
    //     return `<div style='color: red;'>` + formatEndDate(task.end_date, gantt.templates.date_grid) + '</div>'
    //   } else {
    //     // let dateToStr = gantt.date.date_to_str('%d.%m.%Y')
    //     return formatEndDate(task.end_date, gantt.templates.date_grid)
    //   }
    // }
    // function myFunc (task) {
    //   if (gantt.hasChild(task.id)) {
    //     let ch = gantt.getChildren(task.id)
    //     let expired = false
    //     for (let index = 0; index < ch.length; index++) {
    //       const element = ch[index]
    //       let chTask = gantt.getTask(element)
    //       if (chTask.expired === 1) {
    //         expired = true
    //       }
    //     }
    //     return expired
    //   } else {
    //     return false
    //   }
    // }
    var host = 'http://' + window.location.hostname
    function getGuiltyTasks (task) { // Раскраска наименования задачи
      let isGuilty = false
      var handledFlag = 'temp__isAlreadyHandled__'
      function getGuilty (t, stack) {
        let child = gantt.getChildren(t.id)
        var propertyPath
        for (let index = 0; index < child.length; index++) {
          var element = child[index]
          let chTask = gantt.getTask(element)
          if (typeof (chTask) === 'object') {
            if (!chTask[handledFlag]) {
              if (chTask.Guilty) {
                isGuilty = true
              }
              Object.defineProperty(chTask, handledFlag, {
                value: true,
                writable: false,
                configurable: true
              })
              if (!stack) {
                propertyPath = 'rootObject.' + index
              } else {
                propertyPath = stack + '.' + index
              }
              if (gantt.hasChild(chTask.id)) {
                getGuilty(chTask, propertyPath)
              }
            } else {
              propertyPath = stack + '.' + index
            }
            delete chTask[handledFlag]
          }
        }
      }
      let taskClass = ''
      if (gantt.hasChild(task.id)) {
        getGuilty(task)
        if (isGuilty) {
          if (task.closed === 1 || Number(task.CompletePercent) >= 100) {
            taskClass = 'hasguiltytasks-closed'
          } else {
            taskClass = 'hasguiltytasks-work'
          }
        } else {
          if (task.Guilty && !gantt.hasChild(task.id)) {
            if (task.closed === 1 || Number(task.CompletePercent) >= 100) {
              taskClass = 'guilty-closed'
            } else {
              taskClass = 'guilty-work'
            }
          } else {
            if (task.closed === 1 || Number(task.CompletePercent) >= 100) {
              taskClass = 'task-closed'
            } else { //
              taskClass = 'task-work'
            }
          }
        }
      } else {
        if (task.Guilty) {
          if (task.closed === 1 || Number(task.CompletePercent) >= 100) {
            taskClass = 'guilty-closed'
          } else {
            taskClass = 'guilty-work'
          }
        } else {
          if (task.closed === 1 || Number(task.CompletePercent) >= 100) {
            taskClass = 'task-closed'
          } else {
            if (task.ExpiredNotificationSent) {
              taskClass = 'expirednotificated'
            } else {
              taskClass = 'task-work'
            }
          }
        }
      }
      return task.task_id ? `<div id="Task_${task.id}"><a href='` + host + task.url + `' class='${taskClass}' target='_blank'>` + task.text + `</a></div>`
        : `<div id="Task_null"><span class='${taskClass}'>` + task.text + `</span></div>`
    }
    //
    // eslint-disable-next-line
    function byId (list, item) {
      const find = list.find(f => Number(f.PlanItem) === item.id)
      // console.log(find)
      if (find) {
        return '<b>' + find.text ? find.text : find.dep_name + '</b>'
      } else {
        if (item.resource) {
          const importFind = list.find(f => f.id === item.resource[0])
          if (importFind) {
            return '<b>' + importFind.text ? importFind.text : importFind.dep_name + '</b>'
          } else {
            return 'Нет исполнителя'
          }
        } else {
          return 'Нет исполнителя'
        }
      }
      // for (var i = 0; i < list.length; i++) {
      //   if (Number(list[i].PlanItem) === Number(id)) {
      //     return '<b>' + list[i].text ? list[i].text : list[i].dep_name + '</b>'
      //   } else {
      //     return 'Нет исполнителя'
      //   }
      // }
    }
    // eslint-disable-next-line
    gantt.templates.task_row_class = function (start_date, end_date, item) { // раскраска строк диаграммы
      var css = []
      if (shouldHighlightTask(item)) {
        css.push('highlighted_resource')
      }
      if (item.progress === 1) {
        css.push('closedtask')
      }
      if (item.isGap) {
        css.push('gaptask')
      }
      return css.join(' ')

      // if (Number(item.CompletePercent) >= 100 && !item.Guilty) {
      //   if (shouldHighlightTask(item)) {
      //     return 'highlighted_resource'
      //   } else {
      //     return ''
      //   }
      // } else {
      //   if (Number(item.CompletePercent) >= 100 && item.Guilty) {
      //     if (shouldHighlightTask(item)) {
      //       return 'expired_tasks highlighted_resource'
      //     } else {
      //       return 'expired_tasks'
      //     }
      //   } else {
      //     if (Number(item.CompletePercent) < 100 && item.Guilty) {
      //       if (shouldHighlightTask(item)) {
      //         return 'expired_inwork highlighted_resource'
      //       } else {
      //         return 'expired_inwork'
      //       }
      //     }
      //   }
      // }
    }
    gantt.templates.progress_text = function (start, end, task) {
      return `<span style='text-align:left;'>` + Math.ceil((task.closed === 1 ? 1 : task.progress) * 100) + '%</span>'
      // return `<span style='text-align:left;'>` + task.CompletePercent + '%</span>'
    }
    // var filterValue = '';
    // gantt.$doFilter = function (value) {
    //   filterValue = value
    //   gantt.refreshData()
    // }
    // gantt.attachEvent('onBeforeTaskDisplay', function (id, task) {
    //   if (!filterValue) return true
    //   var normalizedText = task.text.toLowerCase()
    //   var normalizedValue = filterValue.toLowerCase()
    //   return normalizedText.indexOf(normalizedValue) > -1
    // })
    // gantt.attachEvent('onGanttRender', function () {
    //   gantt.$root.querySelector('[data-text-filter]').value = filterValue
    // })
    // var textFilter = `<div class="v-input v-input--is-label-active v-input--is-dirty theme--light v-text-field v-text-field--is-booted"><div class="v-input__control"><div class="v-input__slot"><div class="v-text-field__slot"><label for="input-8429" class="v-label v-label--active theme--light" style="left: 0px; right: auto; position: absolute;">поиск</label><input data-text-filter id="input-8429" type="text" oninput="gantt.$doFilter(this.value)"></div></div></div></div>`
    //
    //
    function getTypeTask (item) {
      let text = 'N/A'
      let style = ''
      if (gantt.hasChild(item.id)) {
        style += 'font-weight: bold;'
      }
      // if (item.closed === 1 || Number(item.CompletePercent) >= 100) {
      //   style += 'text-decoration: line-through !important;'
      // }
      switch (item.type) {
        case 'task':
          text = 'задача'
          break
        case 'phase':
          text = 'суммарная задача'
          break
        case 'project':
          text = 'суммарная задача'
          break
        case 'milestone':
          text = 'ключевое событие'
          break
        case 'subplan':
          text = 'функциональный план'
          break
        default:
          text = 'N/A'
          break
      }
      return `<div style="${style}">${text}</div>`
    }
    function predictStart (item) {
      let style = ''
      if (gantt.hasChild(item.id)) {
        style += 'font-weight: bold;'
      }
      // if (item.closed === 1 || Number(item.CompletePercent) >= 100) {
      //   style += 'text-decoration: line-through !important;'
      // }
      return `<div style="${style}">${item.hasOwnProperty('predictDates') ? item.predictDates.hasOwnProperty('start') ? new Date(item.predictDates.start).toLocaleDateString() : '' : ''}</div>`
    }
    function predictEnd (item) {
      let style = ''
      if (gantt.hasChild(item.id)) {
        style += 'font-weight: bold;'
      }
      // if (item.closed === 1 || Number(item.CompletePercent) >= 100) {
      //   style += 'text-decoration: line-through !important;'
      // }
      return `<div style="${style}">${item.hasOwnProperty('predictDates') ? item.predictDates.hasOwnProperty('end') ? new Date(item.predictDates.end).toLocaleDateString() : '' : ''}</div>`
    }
    function endDiv (item) {
      let style = ''
      if (gantt.hasChild(item.id)) {
        style += 'font-weight: bold;'
      }
      // if (item.closed === 1 || Number(item.CompletePercent) >= 100) {
      //   style += 'text-decoration: line-through !important;'
      // }
      return `<div style="${style}">${new Date(item.end_date).toLocaleDateString()}</div>`
    }
    function factEndDiv (item) {
      let style = ''
      if (gantt.hasChild(item.id)) {
        style += 'font-weight: bold;'
      }
      // if (item.closed === 1 || Number(item.CompletePercent) >= 100) {
      //   style += 'text-decoration: line-through !important;'
      // }
      return `<div style="${style}">${item.EndWorkDate ? new Date(item.EndWorkDate).toLocaleDateString() : ''}</div>`
    }
    function startDiv (item) {
      let style = ''
      if (gantt.hasChild(item.id)) {
        style += 'font-weight: bold;'
      }
      // if (item.closed === 1 || Number(item.CompletePercent) >= 100) {
      //   style += 'text-decoration: line-through !important;'
      // }
      return `<div style="${style}">${new Date(item.start_date).toLocaleDateString()}</div>`
    }
    function durationDiv (item) {
      let style = ''
      if (gantt.hasChild(item.id)) {
        style += 'font-weight: bold;'
      }
      // if (item.closed === 1 || Number(item.CompletePercent) >= 100) {
      //   style += 'text-decoration: line-through !important;'
      // }
      return `<div style="${style}">${Math.round(item.duration / 8)}</div>`
    }
    function levelDiv (item) {
      let style = ''
      if (gantt.hasChild(item.id)) {
        style += 'font-weight: bold;'
      }
      // if (item.closed === 1 || Number(item.CompletePercent) >= 100) {
      //   style += 'text-decoration: line-through !important;'
      // }
      return `<div style="${style}">${String(item.$level + 1)}</div>`
    }
    function wbsDiv (item) {
      let style = ''
      if (gantt.hasChild(item.id)) {
        style += 'font-weight: bold;'
      }
      // if (item.closed === 1 || Number(item.CompletePercent) >= 100) {
      //   style += 'text-decoration: line-through !important;'
      // }
      return `<div style="${style}">${gantt.getWBSCode(item)}</div>`
    }
    function progressDiv (item) {
      let style = ''
      if (gantt.hasChild(item.id)) {
        style += 'font-weight: bold;'
      }
      // if (item.closed === 1 || Number(item.CompletePercent) >= 100) {
      //   style += 'text-decoration: line-through !important;'
      // }
      return `<div style="${style}">${Math.ceil((item.closed === 1 ? 1 : item.progress) * 100) + '%'}</div>`
    }
    function globalIdDiv (item) {
      let style = ''
      if (gantt.hasChild(item.id)) {
        style += 'font-weight: bold;'
      }
      // if (item.closed === 1 || Number(item.CompletePercent) >= 100) {
      //   style += 'text-decoration: line-through !important;'
      // }
      return `<div style="${style}">${item.global_id}${item.closed === 1 || Number(item.CompletePercent) >= 100 ? '<i class="fa fa-check" style="float:right;"></i>' : ''}</div>`
    }
    function workloadDiv (item) {
      let style = ''
      // let summ = 0
      if (gantt.hasChild(item.id)) {
        style += 'font-weight: bold;'
        // gantt.eachTask(function (task) {
        //   summ += task.workload
        // }, item.id)
      } else {
        // summ = item.workload
      }
      // let work = ''
      // // console.log(Math.max(summ, Math.round(summ)) % Math.min(summ, Math.round(summ)), Number(summ).toFixed(2), Math.round(summ))
      // if (Math.max(Number(Number(summ).toFixed(2)), Math.round(summ)) % Math.min(Number(Number(summ).toFixed(2)), Math.round(summ)) === 0) {
      //   work = String(Math.round(summ))
      // } else {
      //   work = Number(Number(summ).toFixed(2)) > 0 ? String(Number(summ).toFixed(2)).replace('.', ',') : '0'
      // }
      // return `<div style="${style}">${work > Number(item.Work).toFixed(2) ? String(Number(item.Work).toFixed(2)).replace('.', ',') : work}</div>`
      // return `<div style="${style}">${work}</div>`
      return `<div style="${style}">${item.workloadstring}</div>`
      // return `<div style="${style}">${work > Number(summ).toFixed(2) ? String(Number(summ).toFixed(2)).replace('.', ',') : work}</div>`
    }
    function executorDiv (list, item) {
      let result = ''
      const find = list.filter(f => Number(f.PlanItem) === Number(item.id))
      if (find && find.length > 0) {
        if (find.length === 1) {
          const element = find[0]
          let percent = (100 / 8 * element.capacity) === 100 ? '' : '(' + Math.round(100 / 8 * element.capacity) + '%)'
          result = `<div title='${element.text ? `${element.text} ${percent}` : element.dep_name}'>${(element.text ? element.text : element.dep_name)} ${percent}</div>`
        } else {
          for (let i = 0; i < find.length; i++) {
            const element = find[i]
            let percent = (100 / 8 * element.capacity) === 100 ? '' : '(' + Math.round(100 / 8 * element.capacity) + '%)'
            result += `<div class='owner-label' title='${element.text ? `${element.text} ${percent}` : element.dep_name}'>${(element.text ? element.text : element.dep_name).substr(0, 1)}</div>`
          }
        }
      } else {
        if (item.resource) {
          if (item.resource.length === 1) {
            const importFind = list.find(f => f.id === item.resource[0])
            if (importFind) {
              result = `<div title='${importFind.text ? importFind.text : importFind.dep_name}'>${importFind.text ? importFind.text : importFind.dep_name}</div>`
            }
          } else {
            for (let i = 0; i < item.resource.length; i++) {
              const importFind = list.find(f => f.id === item.resource[i])
              if (importFind) {
                result += `<div class='owner-label' title='${importFind.text ? importFind.text : importFind.dep_name}'>${(importFind.text ? importFind.text : importFind.dep_name).substr(0, 1)}</div>`
              }
            }
          }
        }
      }
      if (result === '' && (item.type === 'task' || item.type === 'milestone')) {
        return `<div class='noexecutor-label'>не назначен</div>`
      } else {
        return result
      }
    }
    // gantt.config.links.finish_to_start = 'ОН'
    // gantt.config.links.start_to_start = 'НН'
    // gantt.config.links.finish_to_finish = 'ОО'
    // gantt.config.links.start_to_finish = 'НО'
    // const durationFormatter = gantt.ext.formatters.durationFormatter({
    //   enter: 'day',
    //   store: 'day',
    //   format: 'day',
    //   short: true,
    //   minutesPerHour: 60,
    //   hoursPerDay: 8,
    //   hoursPerWeek: 40,
    //   daysPerMonth: 30,
    //   daysPerYear: 365,
    //   labels: {
    //     minute: {
    //       full: 'минута',
    //       plural: 'минут',
    //       short: 'мин'
    //     },
    //     hour: {
    //       full: 'час',
    //       plural: 'часа',
    //       short: 'ч'
    //     },
    //     day: {
    //       full: 'день',
    //       plural: 'дней',
    //       short: 'д'
    //     },
    //     week: {
    //       full: 'неделя',
    //       plural: 'недель',
    //       short: 'н'
    //     },
    //     month: {
    //       full: 'месяц',
    //       plural: 'месяцев',
    //       short: 'м'
    //     },
    //     year: {
    //       full: 'год',
    //       plural: 'лет',
    //       short: 'г'
    //     }
    //   }
    // })
    // const linksFormatter = gantt.ext.formatters.linkFormatter({
    //   durationFormatter: durationFormatter,
    //   labels: {
    //     finish_to_finish: 'ОО',
    //     finish_to_start: 'ОН',
    //     start_to_start: 'НН',
    //     start_to_finish: 'НО'
    //   }
    // })
    // Test MS Project-like links
    function formatGlobal (link) {
      var linkType = ''
      switch (Number(link.type)) {
        case 0:
          linkType = 'ОН'
          break
        case 1:
          linkType = 'НН'
          break
        case 2:
          linkType = 'ОО'
          break
        case 3:
          linkType = 'НО'
          break
        default:
          linkType = ''
          break
      }
      if (Number(link.LagFormat) === 2) {
        return Number(link.lag) !== 0 ? `${linkType}${link.lag > 0 ? '+' + link.lag : link.lag}д` : linkType !== 'ОН' ? linkType : ''
      } else if ((store.getters.readyForImport || store.getters.importCount === 0) && gantt.config.duration_unit === 'hour') { // 'importCount'
        return Number(link.lag) !== 0 ? `${linkType}${link.lag > 0 ? '+' + link.lag / 8 : link.lag / 8}д` : linkType !== 'ОН' ? linkType : ''
      } else {
        return Number(link.lag) !== 0 ? `${linkType}${link.lag > 0 ? '+' + link.lag : link.lag}д` : linkType !== 'ОН' ? linkType : ''
      }
    }
    // End Test MS Project-like links
    var scaleHeight = gantt.config.scale_height
    // Editors for inline editing
    // gantt.config.editor_types.index_editor = {
    //   show: function (id, column, config, placeholder) {
    //     // called when input is displayed, put html markup of the editor into placeholder
    //     // and initialize your editor if needed:
    //     // let val = { id: id, column: column, config: config, placeholder: placeholder }
    //     // console.log('show', val)
    //     var task = gantt.getTask(id)
    //     var links = task.$target;
    //       var labels = [];
    //       for(var i = 0; i < links.length; i++) {
    //         var link = gantt.getLink(links[i]);
    //         var pred = gantt.getTask(link.source);
    //         // labels.push(gantt.getGlobalTaskIndex(pred.id) + 1);
    //         labels.push(pred.global_id);
    //       }
    //     //     var global = gantt.getGlobalTaskIndex(id) + 1;
    //         var html = "<div><input type='text' name='" + column.name + "' value='" + labels.join(", ") + "'></div>";
    //         placeholder.innerHTML = html;
    //   },
    //   hide: function () {
    //     // called when input is hidden
    //     // destroy any complex editors or detach event listeners from here
    //   },

    //   set_value: function (value, id, column, node) { // получаем данные инпута для отображения в режиме редактирования
    //     // set input value
    //     // let val = {value: value, id: id, column: column, node: node}
    //     console.log('set_value', gantt.getTask(id).links)
    //     var task = gantt.getTask(id)
    //     var links = task.$target;
    //       var labels = [];
    //       for(var i = 0; i < links.length; i++) {
    //         var link = gantt.getLink(links[i]);
    //         var pred = gantt.getTask(link.source);
    //         labels.push(gantt.getGlobalTaskIndex(pred.id) + 1);
    //       }
    //     node.childNodes[0].childNodes[0].value = labels.join(", ") || "";
    //     // var task = gantt.getTask(id)

    //   },

    //   get_value: function (id, column, node) { // 2 - выход из редактирования, отображение изменений
    //     // console.log('get_value', gantt.getTask(id).links)
    //     return node.childNodes[0].childNodes[0].value;
    //   },

    //   is_changed: function (value, id, column, node) { // 1 Запись изменений
    //     console.log('task_id ', id)
    //     gantt.getTask(id).links = node.childNodes[0].childNodes[0].value;
    //     gantt.updateTask(id);
    //     var object_links =  gantt.getTask(id).$target.map(l => { return gantt.getLink(l) });
    //     var old_links = gantt.getTask(id).$target.map(l => { return gantt.getLink(l).source });
    //     console.log('old_links', old_links, object_links, gantt.getTask(id))
    //     var new_links = node.childNodes[0].childNodes[0].value.trim() !== '' ? node.childNodes[0].childNodes[0].value.split(',').map(n => { return gantt.getTaskByIndex(Number(n)-1).id }) : []  // массив ["1", "2", "3"]
    //     console.log('new_links', new_links)

    //     // target - id исходной задачи
    //     // source - id предшественника
    //     for (let index = 0; index < object_links.length; index++) {
    //       const link_id = object_links[index].id
    //       gantt.deleteLink(link_id)
    //     }
    //     for (let index = 0; index < new_links.length; index++) {
    //       const new_source = new_links[index]
    //       // TODO: запись ссылок в базу wasd
    //       var new_link = gantt.addLink({
    //         source: new_source,
    //         target: id,
    //         type: 0
    //       })
    //       console.log('new_link', new_link)
    //       gantt.updateLink(new_link)
    //       // if(gantt.autoSchedule) {
    //       //   gantt.autoSchedule(new_link.source)
    //       // }
    //     }

    //     // if (old_links.length < new_links.length) {
    //     //   let must_added_links = new_links.filter(o => {
    //     //     return old_links.indexOf(o) < 0
    //     //   })
    //     //   if (must_added_links) {
    //     //     // target - id исходной задачи
    //     //     // source - id предшественника
    //     //     for (let index = 0; index < object_links.length; index++) {
    //     //       const link_id = object_links[index].id
    //     //       gantt.deleteLink(link_id)
    //     //     }
    //     //     for (let index = 0; index < new_links.length; index++) {
    //     //       const new_source = new_links[index]
    //     //       var new_link = gantt.addLink({
    //     //         source: new_source,
    //     //         target: id,
    //     //         type: 0
    //     //       })
    //     //       console.log('new_link', new_link)
    //     //       gantt.updateLink(new_link)
    //     //       // if(gantt.autoSchedule) {
    //     //       //   gantt.autoSchedule(new_link.source)
    //     //       // }
    //     //     }
    //     //     console.log('must_added_links', must_added_links)
    //     //   }
    //     // }

    //     // for (let index = 0; index < new_links.length; index++) {
    //     //   const element = Number(new_links[index].trim()) - 1;
    //     //   let new_source = gantt.getTaskByIndex(element).id;
    //     //   for(var i = 0; i < old_links.length; i++) {
    //     //     var link = gantt.getLink(links[i])
    //     //     if (link.source === new_source)
    //     //     console.log(link)
    //     //   }
    //     // }

    //     // gantt.updateLink(link.id);
    //     // if(gantt.autoSchedule){
    //     //     gantt.autoSchedule(link.source);
    //     // }

    //     console.log('is_changed', gantt.getTask(id).links)
    //     return true
    //     // called before save/close. Return true if new value differs from the original one
    //     // returning true will trigger saving changes, returning false will skip saving
    //   },

    //   is_valid: function (value, id, column, node) { // 3
    //     // validate, changes will be discarded if the method returns false
    //     return true;
    //   },
    //   save: function (id, column, node) {
    //     // only for inputs with map_to:auto. complex save behavior goes here
    //   },
    //   focus: function (node) {
    //   }
    // }
    //
    function markerDiv (task) {
      let result = ''
      if (task.wasd_Requirement) {
        result += `<i style="margin-left: 4px; margin-right: 4px; color: #2E7D32;" title="Есть связанное обязательство" class="fas fa-file-alt"></i>`
      }
      if (task.wasd_Risks) {
        result += `<i style="margin-left: 4px; margin-right: 4px; color: #E65100;" title="Есть связанный риск" class="fas fa-bolt"></i>`
      }
      if (task.TaskExecutor && task.mainExecutor && task.TaskExecutor !== task.mainExecutor) {
        result += `<i style="margin-left: 4px; margin-right: 4px; color: #1565C0;" title="Задача переназначена" class="fas fa-user-friends"></i>`
      }
      if (task.isZni) {
        result += `<i style="margin-left: 4px; margin-right: 4px; color: #8dc015;" title="Есть запросы на изменение" class="fas fa-question-circle"></i>`
      }
      // result += `<i style="margin-left: 4px; margin-right: 4px; color: #2E7D32;" title="Есть связанное обязательство" class="fas fa-file-alt"></i>`
      // result += `<i style="margin-left: 4px; margin-right: 4px; color: #E65100;" title="Есть связанный риск" class="fas fa-bolt"></i>`
      // result += `<i style="margin-left: 4px; margin-right: 4px; color: #1565C0;" title="Задача переназначена" class="fas fa-user-friends"></i>`
      return result
    }
    //
    // var editors = {
    //   text: { type: 'text', map_to: 'text' },
    //   start_date: { type: 'date', map_to: 'start_date', min: new Date(2018, 0, 1), max: new Date(2019, 0, 1) },
    //   end_date: { type: 'date', map_to: 'end_date', min: new Date(2018, 0, 1), max: new Date(2019, 0, 1) },
    //   // duration: { type: 'duration', map_to: 'duration', min:0, max: 100, formatter: formatter },
    //   // priority: { type: 'select', map_to: 'priority', options: gantt.serverList('priority') },
    //   predecessors: { type: 'predecessor', map_to: 'auto', formatter: linksFormatter }
    // }
    // var textFilter = `<div class='gantt-sub-header' style='line-height:${scaleHeight / 2}px; text-align: left;'><div style='margin-left: 30px;'>Задача</div><div><i style='margin-left: 4px;' class='fa fa-search searchButton'></i><input data-text-filter id='search' type='text' class='searchbox' placeholder='поиск...' oninput='gantt.$doFilter(this.value)'><i style='margin-left: 4px;' class='clearicon fas fa-times' onclick='gantt.$doFilter("")'></i></div></div>`
    var textFilter = `<div class='gantt-sub-header' style='line-height:${scaleHeight / 2}px; text-align: left;'><div style='margin-left: 30px;'>Задача</div><div class='wrap'><i style='margin-left: 4px;' class='fa fa-search searchicon'></i><input data-text-filter id='search' type='text' class='searchbox' placeholder='поиск...' autocomplete='off' oninput='gantt.$doFilter(this.value)'><i style='margin-left: -2px;' class='clearicon fas fa-times' onclick='gantt.$doFilter("")'></i></div></div>`
    gantt.config.columns = [
      { name: 'global_id', label: '#', min_width: 40, width: 50, resize: true, template: globalIdDiv },
      { name: 'wbs', label: 'Иерархия', min_width: 50, width: 80, template: wbsDiv, hide: true },
      { name: 'level', label: 'Уровень', min_width: 50, width: 50, template: levelDiv, hide: true },
      { name: 'progress', min_width: 50, width: 80, label: 'Выполнение', resize: true, align: 'center', template: progressDiv },
      { name: 'markers', label: 'Признаки', min_width: 50, width: 67, align: 'left', resize: true, template: function (item) { return markerDiv(item) }, hide: true },
      // { name: 'progress', min_width: 50, width: 80, label: 'Выполнение', resize: true, align: 'center', template: function (item) { return Math.round(item.CompletePercent * 100) + '%' } },
      { name: 'text', label: textFilter, min_width: 350, width: 400, tree: true, resize: true, template: getGuiltyTasks },
      // { name: 'text', label: textFilter, min_width: 150, width: 800, tree: true, resize: true, template: expiredChildrenTasks },
      { name: 'type', label: 'Тип', min_width: 50, width: 80, resize: true, template: getTypeTask, hide: true },
      { name: 'duration', min_width: 50, width: 80, align: 'center', template: durationDiv, resize: true },
      { name: 'start_date', min_width: 50, width: 100, align: 'center', resize: true, template: startDiv },
      // { name: 'end_date', min_width: 50, width: 100, align: 'center', resize: true, template: expiredChildrenTasksDate },
      { name: 'end_date', min_width: 50, width: 100, align: 'center', resize: true, template: endDiv },
      { name: 'factend_date', label: 'Факт выполнение', min_width: 50, width: 100, align: 'center', resize: true, template: factEndDiv, hide: true },
      { name: 'predict_start', label: 'Прогноз начало', min_width: 50, width: 100, align: 'center', resize: true, hide: true, template: predictStart },
      { name: 'predict_end', label: 'Прогноз завершение', min_width: 50, width: 100, align: 'center', resize: true, hide: true, template: predictEnd },
      // { name: 'owner', min_width: 50, width: 130, align: 'left', resize: true, template: function (item) { return byId(gantt.serverList('res'), item) } },
      { name: 'owner', label: 'Ресурс', min_width: 50, width: 100, align: 'left', resize: true, template: function (item) { return executorDiv(gantt.serverList('res'), item) } },
      { name: 'work', label: 'Трудозатраты', min_width: 50, width: 100, align: 'left', resize: true, template: workloadDiv },
      {
        name: 'index_editor',
        label: 'Предшественники',
        min_width: 50,
        width: 80,
        resize: true,
        // editor: editors.predecessors,
        template: function (task) {
          var links = task.$target
          var labels = []
          for (var i = 0; i < links.length; i++) {
            var link = gantt.getLink(links[i])
            var pred = gantt.getTask(link.source)
            labels.push(pred.global_id + formatGlobal(link))
          }
          return labels.join(';')
        }
      },
      // {
      //   name: 'index_editor',
      //   label: 'Предшественники',
      //   min_width: 50,
      //   width: 120,
      //   resize: true,
      //   // editor: { type: "index_editor", map_to: "index_editor" },
      //   template: function (task) {
      //     var links = task.$target
      //     var labels = []
      //     for (var i = 0; i < links.length; i++) {
      //       var link = gantt.getLink(links[i])
      //       var pred = gantt.getTask(link.source)
      //       labels.push(pred.global_id)
      //     }
      //     return task.index_editor || labels.join(', ')
      //   }
      // },
      {
        name: 'successors',
        label: 'Последователи',
        min_width: 50,
        width: 80,
        resize: true,
        template: function (task) {
          var links = task.$source
          var labels = []
          for (var i = 0; i < links.length; i++) {
            var link = gantt.getLink(links[i])
            var pred = gantt.getTask(link.target)
            labels.push(pred.global_id + formatGlobal(link))
          }
          return labels.join(';')
        }
      }
    ]
    gantt.locale.labels.section_baseline = 'Planned'
    // Columns context menu
    // (function addContentMenu () {
    // eslint-disable-next-line
    var menu = new dhtmlXMenuObject()
    // menu.setIconsPath('../icons')
    // menu.setIconset('awesome')
    menu.renderAsContextMenu()
    menu.setSkin('dhx_terrace')
    gantt.attachEvent('onContextMenu', function (taskId, linkId, event) {
      var x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
      var y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop
      var target = (event.target || event.srcElement)
      // eslint-disable-next-line
      var column_id = target.getAttribute('column_id')
      menu.clearAll()
      addColumnsConfig()
      // eslint-disable-next-line
      if (column_id) {
        // eslint-disable-next-line
        addColumnToggle(column_id)
      }
      menu.showContextMenu(x, y)
      return false
    })
    menu.attachEvent('onClick', function (id, zoneId, cas) {
      var parts = (id + '').split('#')
      // eslint-disable-next-line
      var is_toggle = parts[0] == 'toggle'
      // eslint-disable-next-line
      var column_id = parts[1] || id
      // eslint-disable-next-line
      var column = gantt.getGridColumn(column_id)
      if (column) {
        // eslint-disable-next-line
        var visible = !is_toggle ? menu.getCheckboxState(id) : false
        column.hide = !visible
        gantt.render()
      }
      return true
    })
    // eslint-disable-next-line
    function addColumnToggle (column_name) {
      // eslint-disable-next-line
      var column = gantt.getGridColumn(column_name)
      var label = getColumnLabel(column)
      // add prefix to distinguish from the same item in 'show columns' menu
      // eslint-disable-next-line
      var item_id = 'toggle#' + column_name
      // eslint-disable-next-line
      menu.addNewChild(null, -1, item_id, `Скрыть '` + label + `'`, false)
      // eslint-disable-next-line
      menu.addNewSeparator(item_id)
    }
    function addColumnsConfig () {
      menu.addNewChild(null, -1, 'show_columns', 'Видимость колонок:', false)
      var columns = gantt.config.columns
      for (var i = 0; i < columns.length; i++) {
        if (columns[i].name !== 'text') {
          var checked = (!columns[i].hide)
          var itemLabel = getColumnLabel(columns[i])
          menu.addCheckbox('child', 'show_columns', i, columns[i].name, itemLabel, checked)
          // menu.setItemImage(i, '/icons/dhxmenu_chrd.gif')
        }
      }
    }
    function getColumnLabel (column) {
      if (column == null || column.name === 'text') {
        return ''
      } else {
        var locale = gantt.locale.labels
        var text = column.label !== undefined ? column.label : locale['column_' + column.name]
        text = text || column.name
        return text
      }
    }
    // })()
    //
    //
    var calcAllCapacity = {}
    function calcTasks (tasks) {
      var minTask = tasks.sort((a, b) => a.start_date.getTime() - b.start_date.getTime())[0]
      var maxTask = tasks.sort((a, b) => b.end_date.getTime() - a.end_date.getTime())[0]
      var start = minTask ? minTask.start_date : 0
      var end = maxTask ? maxTask.end_date : 0
      // console.log(start, end)
      return start === 0 || end === 0 ? 0 : gantt.calculateDuration(start, end)
    }
    function getResourceTasks (resourceId) {
      var s = gantt.getDatastore(gantt.config.resource_store)
      var tasks = []
      if (s.hasChild(resourceId)) {
        var dept = s.getChildren(resourceId)
        for (let i = 0; i < dept.length; i++) {
          const res = dept[i]
          tasks.push.apply(tasks, gantt.getTaskBy(gantt.config.resource_property, res))
        }
        if (!calcAllCapacity[dept]) {
          calcAllCapacity[dept] = calcTasks(tasks)
        }
      } else {
        tasks = gantt.getTaskBy(gantt.config.resource_property, resourceId)
      }
      if (!calcAllCapacity[resourceId]) {
        calcAllCapacity[resourceId] = calcTasks(tasks)
      }
      return tasks
    }
    // function calcWorkloadPortfolio (resource) {
    //   var total = 0
    //   if (resource.$level === 0) {
    //     var res = gantt.getDatastore(gantt.config.resource_store).getChildren(resource.id)
    //     for (let i = 0; i < res.length; i++) {
    //       const r = res[i]
    //       var workload = gantt.serverList('workload').filter(f => Number(f.userId) === Number(r))
    //       for (let j = 0; j < workload.length; j++) {
    //         total += workload[j].workload
    //       }
    //     }
    //     // console.log(gantt.getDatastore(gantt.config.resource_store).getChildren(resource.id))
    //     // return ''
    //   } else {
    //     var workl = gantt.serverList('workload').filter(f => Number(f.userId) === Number(resource.id))
    //     for (let i = 0; i < workl.length; i++) {
    //       total += workl[i].workload
    //     }
    //     // console.log(resource, workload)
    //   }
    //   return Math.round(total) || 0
    // }
    // function calcCapacityPortfolio (resource) {
    //   var total = 0
    //   if (resource.$level === 0) {
    //     var res = gantt.getDatastore(gantt.config.resource_store).getChildren(resource.id)
    //     for (let i = 0; i < res.length; i++) {
    //       const r = res[i]
    //       var capacity = gantt.serverList('workload').filter(f => Number(f.userId) === Number(r))
    //       for (let j = 0; j < capacity.length; j++) {
    //         total += capacity[j].capacity
    //       }
    //     }
    //   } else {
    //     var cap = gantt.serverList('workload').filter(f => Number(f.userId) === Number(resource.id))
    //     for (let i = 0; i < cap.length; i++) {
    //       total += cap[i].capacity
    //     }
    //     // console.log(resource, workload)
    //   }
    //   return Math.round(total) || 0
    // }
    function calcAllocate (resource) {
      // var tasks
      // var store = gantt.getDatastore(gantt.config.resource_store)
      // var field = gantt.config.resource_property
      // if (store.hasChild(resource.id)) {
      //   tasks = gantt.getTaskBy(field, store.getChildren(resource.id))
      // } else {
      //   tasks = gantt.getTaskBy(field, resource.id)
      // }
      // var totalDuration = 0
      // for (var i = 0; i < tasks.length; i++) {
      //   totalDuration += tasks[i].duration
      // }
      // return (totalDuration || 0) * 8

      var totalDuration = 0
      if (resource.$level === 2) {
        var assignment = gantt.getResourceAssignments(resource.id, resource.PlamItem)[0]
        // console.log('resource', resource, assignment)
        totalDuration = resource.duration * assignment.value
      } else {
        var assignments = getResourceAssignments(resource.id)
        assignments.forEach(function (assignment) {
          var task = gantt.getTask(assignment.task_id)
          totalDuration += Math.round(assignment.value * (task.type === 'milestone' ? 0 : (task.duration / 8)))
          // totalDuration += assignment.value
        })
      }
      return (totalDuration || 0)
    }
    function calcCapacity (resource) {
      var totalDuration = 0
      // var summ = 0
      // if (!gantt.$resourcesStore.hasChild(resource.id)) {
      //   var resList = gantt.serverList('res').filter(f => Number(f.id) === Number(resource.id))
      //   if (resList) {
      //     for (let i = 0; i < resList.length; i++) {
      //       var task = gantt.getTask(Number(resList[i].PlanItem))
      //       if (task.type !== 'milestone' && !gantt.hasChild(Number(resList[i].PlanItem))) {
      //         summ += task.duration // resList[i].capacity
      //       }
      //     }
      //   }
      //   console.log(summ)
      // }
      // return (summ || 0)

      var tasks = getResourceTasks(resource.id)
      var dept = gantt.getDatastore(gantt.config.resource_store).getChildren(resource.id)
      if (tasks && tasks.length > 0) {
        if (gantt.$resourcesStore.hasChild(resource.id)) {
          for (const key in calcAllCapacity) {
            if (calcAllCapacity.hasOwnProperty(key)) {
              var keys = key.split(',')
              if (keys.length > 0 && String(key) === String(dept)) {
                for (let i = 0; i < keys.length; i++) {
                  const element = keys[i]
                  totalDuration += calcAllCapacity[element]
                }
              } else {
                // totalDuration = calcAllCapacity[resource.id]
              }
            }
          }
        } else {
          totalDuration = calcAllCapacity[resource.id]
        }
      }
      return (totalDuration || 0)
    }
    //
    // eslint-disable-next-line
    gantt.templates.grid_row_class = function (start, end, task) {
      var css = []
      // if (gantt.hasChild(task.id)) {
      // css.push('folder_row')
      // }
      if (task.$virtual) {
        css.push('group_row')
      }
      if (shouldHighlightTask(task)) {
        css.push('highlighted_resource')
      }
      if (task.progress === 1) {
        css.push('closedtask')
      }
      if (task.isGap) {
        css.push('gaptask')
      }
      return css.join(' ')
    }
    // eslint-disable-next-line
    gantt.templates.resource_cell_class = function (start_date, end_date, resource, tasks) {
      var css = []
      css.push('resource_marker')
      if (tasks.length <= 1) {
        css.push('workday_ok')
      } else {
        css.push('workday_over')
      }
      return css.join(' ')
    }
    //
    var resourceMode = 'hours'
    // eslint-disable-next-line
    gantt.templates.resource_cell_value = function (start_date, end_date, resource, tasks) {
      var html = '<div>'
      if (resourceMode === 'hours') {
        html += tasks.length * 8
      } else {
        html += tasks.length
      }
      html += '</div>'
      return html
    }
    //
    // function toggleGroups (input) {
    //   gantt.$groupMode = !gantt.$groupMode
    //   if (gantt.$groupMode) {
    //     input.value = 'show gantt view'
    //     var groups = gantt.$resourcesStore.getItems().map(function (item) {
    //       var group = gantt.copy(item)
    //       group.group_id = group.id
    //       group.id = gantt.uid()
    //       return group
    //     })
    //     gantt.groupBy({
    //       groups: groups,
    //       relation_property: gantt.config.resource_property,
    //       group_id: 'group_id',
    //       group_text: 'text',
    //       delimiter: ', ',
    //       default_group_label: 'Not Assigned'
    //     })
    //   } else {
    //     input.value = 'show resource view'
    //     gantt.groupBy(false)
    //   }
    // }
    // function resourceOnClick (id) {
    //   console.log('second', id)
    // }
    // eslint-disable-next-line
    var resourceConfig = {
      scale_height: 30,
      columns: [
        {
          // eslint-disable-next-line
          name: 'name', label: 'Ресурс', tree: true, width: 500, template: function (resource) {
            if (resource.$level === 0) {
              return `<div style='font-weight: bold;'>${resource.text}</div>`
            } else {
              if (resource.Status === 1) {
                return `<div id='${resource.id}' style='text-decoration: line-through;'>${resource.text}</div>`
              } else {
                return `<div id='${resource.id}'>${resource.text}</div>`
              }
            }
          },
          resize: true
        },
        {
          // eslint-disable-next-line
          name: 'workload', label: 'Текущий проект (загрузка/потенциал)', align: 'center', template: function (resource) {
            var cap = calcCapacity(resource)
            var totalDuration = calcAllocate(resource)
            if (totalDuration > cap) {
              // return `<div style='background-color: #ffa9a9;'>${(totalDuration || 0)}</div>` // color: #ac1212
              return `<span style='color: #ac1212;'>${(totalDuration || 0)}</span><span>/${(cap || 0)}</span>` // color: #ac1212
            } else {
              // return `<div>${(totalDuration || 0)}</div>`
              return `<span>${(totalDuration || 0)}</span><span>/${(cap || 0)}</span>`
            }
          },
          resize: true
        },
        {
          // eslint-disable-next-line
          name: 'capacity', label: 'Портфель (загрузка/потенциал)', align: 'center', template: function (resource) {
            var workload = 0
            var capacity = 0
            // var title
            if (gantt.$resourcesStore.hasChild(resource.id)) {
            // if (resource.$level === 0) {
              var res = gantt.getDatastore(gantt.config.resource_store).getChildren(resource.id)
              for (let i = 0; i < res.length; i++) {
                const r = res[i]
                var work = gantt.serverList('workload').filter(f => Number(f.userId) === Number(r))
                for (let j = 0; j < work.length; j++) {
                  capacity += work[j].capacity
                  workload += work[j].workload
                }
              }
            } else {
              var workl = gantt.serverList('workload').filter(f => Number(f.userId) === Number(resource.id))
              for (let i = 0; i < workl.length; i++) {
                capacity += workl[i].capacity
                workload += workl[i].workload
              }
            }
            if (workload > capacity) {
              // return `<div ${title ? 'title="' + title + '"' : ''}><span style='color: #ac1212;'>${(Math.round(workload) || 0)}</span><span>/${(Math.round(capacity) || 0)}</span></div>`
              return `<div><span style='color: #ac1212;'>${(Math.round(workload) || 0)}</span><span>/${(Math.round(capacity) || 0)}</span></div>`
            } else {
              // var div = document.createElement('div')
              // div.innerText = `${(Math.round(workload) || 0)}/${(Math.round(capacity) || 0)}`
              // return `<div id='${resource.id}' dblclick='${resourceOnClick()}' ${title ? 'title="' + title + '"' : ''}><span>${(Math.round(workload) || 0)}</span><span>/${(Math.round(capacity) || 0)}</span></div>`
              return `<div><span>${(Math.round(workload) || 0)}</span><span>/${(Math.round(capacity) || 0)}</span></div>`
              // return div
            }
          }
        }
      ]
    }
    // function getRes (id) {
    //   return gantt.getResourceAssignments(id)
    // }
    // gantt.attachEvent('onEmptyClick', function (e) {
    //   if (e.target.className === 'gantt_task_cell' || e.target.className === 'gantt_cell' || e.target.classList[0] === 'gantt_cell' ) {
    //     var id = e.target.parentNode.attributes[1].nodeValue
    //     var name = e.target.parentNode.attributes[1].nodeName
    //     // e.target.parentNode.ondblclick = resourceOnClick(id)
    //     // <button type="button" class="mx-0 v-btn v-btn--depressed v-btn--flat v-btn--icon v-btn--round v-btn--rounded v-size--small" role="button" aria-expanded="false">
    //     //   <span class="v-btn__content">
    //     //     <i aria-hidden="true" class="v-icon notranslate fa fa fa fa-calendar" style="font-size: 16px;"></i>
    //     //   </span>
    //     // </button>
    //     var div = document.getElementById(id)
    //     // replaceWith
    //     var button = document.createElement('button')
    //     button.innerHTML = div.innerHTML
    //     button.addEventListener('dblclick', () => { resourceOnClick(id) })
    //     div.replaceWith(button)
    //     // e.target.appendChild(button)
    //     // console.log(div, e.target)
    //   }
    //   if (e.target.className === 'gantt_tree_content' || e.target.classList[0] === 'gantt_tree_icon') {
    //     var id = e.target.parentNode.parentNode.attributes[1].nodeValue
    //     // var name = e.target.parentNode.parentNode.attributes[1].nodeName
    //     console.log(id, e.target)
    //   }
    //   if (e.target.className === ''){
    //     var parent_classlist = e.target.parentNode.classList || ['nothing']
    //     var id
    //     for (var i = 0; i < parent_classlist.length; i++) {
    //       var class_value = parent_classlist[i].split('___')
    //       if (class_value[1]) {
    //         id = class_value[1]
    //       }
    //     }
    //     if (id) {
    //       console.log(id, e.target)
    //     }
    //   }
    // })

    //
    //
    //
    function shouldHighlightResource (resource) {
      var selectedTaskId = gantt.getState().selected_task
      if (gantt.isTaskExists(selectedTaskId)) {
        var selectedTask = gantt.getTask(selectedTaskId)
        var selectedResource = selectedTask[gantt.config.resource_property]
        if (resource.id === selectedResource) {
          return true
        } else if (gantt.$resourcesStore.isChildOf(selectedResource, resource.id)) {
          return true
        }
      }
      return false
    }
    // eslint-disable-next-line
    var resourceTemplates = {
      grid_row_class: function (start, end, resource) {
        var css = []
        if (gantt.$resourcesStore.hasChild(resource.id)) {
          css.push('folder_row')
          css.push('group_row')
        }
        if (shouldHighlightResource(resource)) {
          css.push('highlighted_resource')
        }
        return css.join(' ')
      },
      task_row_class: function (start, end, resource) {
        var css = []
        if (shouldHighlightResource(resource)) {
          css.push('highlighted_resource')
        }
        if (gantt.$resourcesStore.hasChild(resource.id)) {
          css.push('group_row')
        }
        return css.join(' ')
      }
    }
    var ganttLayoutResource = {
      css: 'gantt_container',
      rows: [
        {
          gravity: 2,
          cols: [
            { view: 'grid', width: 120, group: 'grids', scrollY: 'scrollVer' },
            { resizer: true, width: 1 },
            { view: 'timeline', scrollX: 'scrollHor', scrollY: 'scrollVer' },
            { view: 'scrollbar', id: 'scrollVer', group: 'vertical' }
          ]
        },
        { resizer: true, width: 1 },
        {
          gravity: 1,
          id: 'resources',
          config: resourceConfig,
          templates: resourceTemplates,
          cols: [
            { view: 'resourceGrid', group: 'grids', scrollY: 'resourceVScroll' },
            { resizer: true, width: 1 },
            { view: 'resourceHistogram', capacity: 24, scrollX: 'scrollHor', scrollY: 'resourceVScroll' },
            { view: 'scrollbar', id: 'resourceVScroll', group: 'vertical' }
          ]
        },
        { view: 'scrollbar', id: 'scrollHor' }
      ]
    }
    var ganttLayoutTasks = {
      css: 'gantt_container',
      rows: [
        {
          cols: [
            { view: 'grid', width: 500, group: 'grids', scrollY: 'scrollVer' },
            { resizer: true, width: 1 },
            { view: 'timeline', scrollX: 'scrollHor', scrollY: 'scrollVer' },
            { view: 'scrollbar', id: 'scrollVer', group: 'vertical' }
          ]
        },
        { view: 'scrollbar', id: 'scrollHor' }
      ]
    }
    var ganttLayoutOnlyGrid = {
      css: 'gantt_container',
      rows: [
        {
          cols: [
            { view: 'grid', group: 'grids', scrollY: 'scrollVer' },
            { view: 'scrollbar', id: 'scrollVer', group: 'vertical' }
          ]
        },
        { view: 'scrollbar', id: 'scrollHor' }
      ]
    }
    // gantt.config.grid_elastic_columns = true gantt.config.columns
    // var ganttLayoutTasksElastic = {
    //   css: 'gantt_container',
    //   cols: [
    //     {
    //       rows: [
    //         { view: 'grid', width: 200, scrollable: true, scrollX: 'gridScroll', scrollY: 'scrollVer' },
    //         { view: 'scrollbar', id: 'gridScroll', scroll: 'x', group: 'hor' }
    //       ]
    //     },
    //     { resizer: true, width: 1 },
    //     {
    //       rows: [
    //         { view: 'timeline', scrollX: 'timelineScroll', scrollY: 'scrollVer' },
    //         { view: 'scrollbar', id: 'timelineScroll', scroll: 'x', group: 'hor' }
    //       ]
    //     },
    //     { view: 'scrollbar', id: 'scrollVer' }
    //   ]
    // }
    // var ganttLayoutOnlyGrid = {
    //   css: 'gantt_container',
    //   cols: [
    //     {
    //       rows: [
    //         { view: 'grid', scrollable: true, scrollX: 'gridScroll', scrollY: 'scrollVer' },
    //         { view: 'scrollbar', id: 'gridScroll', scroll: 'x', group: 'hor' }
    //       ]
    //     },
    //     { view: 'scrollbar', id: 'scrollVer' }
    //   ]
    // }
    gantt.config.layout = ganttLayoutTasks // ganttLayoutTasks ganttLayoutTasksElastic
    store.dispatch('setGanttLayoutTasks', ganttLayoutTasks) // ganttLayoutTasks
    store.dispatch('setGanttLayoutResource', ganttLayoutResource)
    store.dispatch('setGanttLayoutOnlyGrid', ganttLayoutOnlyGrid) // ganttLayoutOnlyGrid
    //
    gantt.config.min_column_width = 50
    gantt.config.scale_height = 75
    // gantt.config.grid_width = 0
    // gantt.config.show_chart = false
    let zoomConfig = {
      levels: [
        {
          name: 'year',
          scales: [
            { unit: 'year', step: 1, format: '%Y' }
          ]
        },
        {
          name: 'quarter',
          scales: [
            { unit: 'month', step: 1, format: '%M' },
            {
              unit: 'quarter',
              step: 1,
              format: function (date) {
                var dateToStr = gantt.date.date_to_str('%M')
                var yearToStr = gantt.date.date_to_str('%Y')
                var endDate = gantt.date.add(gantt.date.add(date, 3, 'month'), -1, 'day')
                return dateToStr(date) + ' - ' + dateToStr(endDate) + ', ' + yearToStr(endDate)
              }
            }
          ]
        },
        //
        // {
        //   name: 'monthone',
        //   scales: [
        //     { unit: 'month', format: '%F, %Y', step: 1 },
        //     {
        //       unit: 'day',
        //       step: 12,
        //       format: function (date) {
        //         var hourToStr = gantt.date.date_to_str('%d %M')
        //         var intervalEnd = new Date(gantt.date.add(date, 12, 'day') - 1)
        //         return hourToStr(date) + ' - ' + hourToStr(intervalEnd)
        //       }
        //     }
        //   ]
        // },
        {
          name: 'month',
          scales: [
            { unit: 'month', format: '%F, %Y', step: 1 },
            { unit: 'week', format: '%W', step: 1 }
          ]
        },
        // {
        //   name: 'monthtwo',
        //   scales: [
        //     { unit: 'month', format: '%F, %Y', step: 1 },
        //     { unit: 'day', step: 6, format: function (date) {
        //         var hourToStr = gantt.date.date_to_str('%d %M')
        //         var intervalEnd = new Date(gantt.date.add(date, 6, 'day') - 1)
        //         return hourToStr(date) + ' - ' + hourToStr(intervalEnd)
        //       } }
        //   ]
        // },
        {
          name: 'monththree',
          scales: [
            { unit: 'month', format: '%F, %Y', step: 1 },
            {
              unit: 'day',
              step: 3,
              format: function (date) {
                var hourToStr = gantt.date.date_to_str('%d')
                var intervalEnd = new Date(gantt.date.add(date, 3, 'day') - 1)
                return hourToStr(date) + ' - ' + hourToStr(intervalEnd)
              }
            }
          ]
        },
        // {
        //   name: 'monthfour',
        //   scales: [
        //     { unit: 'month', format: '%F, %Y', step: 1 },
        //     { unit: 'day', step: 1, format: function (date) {
        //         var hourToStr = gantt.date.date_to_str('%d %M')
        //         var intervalEnd = new Date(gantt.date.add(date, 3, 'day') - 1)
        //         return hourToStr(date) + ' - ' + hourToStr(intervalEnd)
        //       } }
        //   ]
        // },
        {
          name: 'monthday',
          scales: [
            {
              unit: 'week',
              format: function (date) {
                var dateToStr = gantt.date.date_to_str('%d %M')
                var endDate = gantt.date.add(date, 6, 'day')
                var weekNum = gantt.date.date_to_str('%W')(date)
                return weekNum + ', ' + dateToStr(date) + ' - ' + dateToStr(endDate)
              },
              step: 1
            },
            {
              unit: 'day',
              step: 1,
              format: '%j %D',
              css: function (date) {
                if (!gantt.isWorkTime({ date: date, unit: 'day' })) {
                  return 'weekend'
                }
              }
            }
          ]
        },
        // {
        //   name: 'week',
        //   scales: [
        //     {
        //       unit: 'week',
        //       step: 1,
        //       format: function (date) {
        //         var dateToStr = gantt.date.date_to_str('%d %M')
        //         var endDate = gantt.date.add(date, -6, 'day')
        //         var weekNum = gantt.date.date_to_str('%W')(date)
        //         return weekNum + ', ' + dateToStr(date) + ' - ' + dateToStr(endDate)
        //       }
        //     },
        //     { unit: 'day', step: 12, format: function (date) {
        //         var dateToStr = gantt.date.date_to_str('%d %M')
        //         var endDate = gantt.date.add(date, -12, 'day')
        //         // var weekNum = gantt.date.date_to_str('%W')(date)
        //         return dateToStr(date) + ' - ' + dateToStr(endDate)
        //       }
        //     }
        //   ]
        // },
        {
          name: 'dayone',
          scales: [
            { unit: 'day', step: 1, format: '%d %M' },
            {
              unit: 'hour',
              format: function (date) {
                var hourToStr = gantt.date.date_to_str('%H:%i')
                var intervalEnd = new Date(gantt.date.add(date, 12, 'hour') - 1)
                return hourToStr(date) + ' - ' + hourToStr(intervalEnd)
              },
              step: 12,
              css: function (date) {
                if (!gantt.isWorkTime({ date: date, unit: 'day' })) {
                  return 'weekend'
                }
              }
            }
          ]
        },
        {
          name: 'daytwo',
          scales: [
            { unit: 'day', step: 1, format: '%d %M' },
            {
              unit: 'hour',
              format: function (date) {
                var hourToStr = gantt.date.date_to_str('%H:%i')
                var intervalEnd = new Date(gantt.date.add(date, 6, 'hour') - 1)
                return hourToStr(date) + ' - ' + hourToStr(intervalEnd)
              },
              step: 6,
              css: function (date) {
                if (!gantt.isWorkTime({ date: date, unit: 'day' })) {
                  return 'weekend'
                }
              }
            }
          ]
        },
        {
          name: 'day',
          scales: [
            { unit: 'day', step: 1, format: '%d %M' },
            {
              unit: 'hour',
              format: '%H:%i',
              step: 1,
              css: function (date) {
                if (!gantt.isWorkTime({ date: date, unit: 'day' })) {
                  return 'weekend'
                }
              }
            }
          ]
        }
      ],
      startDate: new Date(gantt.serverList('dates')[0].StartDate),
      endDate: new Date(gantt.serverList('dates')[0].FinishDate),
      useKey: 'ctrlKey',
      trigger: 'wheel',
      element: function () {
        return gantt.$root.querySelector('.gantt_task')
      }
    }
    //
    gantt.ext.zoom.init(zoomConfig)
    gantt.ext.zoom.setLevel('quarter')
    // gantt.templates.timeline_cell_class

    // var UNASSIGNED_ID = 5
    var WORK_DAY = 8
    var alloc = {}
    // eslint-disable-next-line
    function getAllocatedValue (tasks, resource, start_date, end_date) {
      if (gantt.$resourcesStore.hasChild(resource.id)) {
        return -1
      }
      var val = 0
      if (!alloc[val + resource.id]) {
        for (var i = 0; i < tasks.length; i++) {
          var task = tasks[i]
          // eslint-disable-next-line
          if (task.type !== gantt.config.types.milestone && task.type !== gantt.config.types.subplan && task.executor_id !== null) {
            // console.log(task.executor_id)
            // eslint-disable-next-line
            var find = task.executor_id.find(f => f.resource_id === Number(resource.id))
            if (find) {
              // eslint-disable-next-line
              var totalHours = gantt.calculateDuration(task.start_date <= start_date ? start_date : task.start_date, task.end_date > end_date ? end_date : task.end_date)
              val += totalHours / 100 * (100 / WORK_DAY * find.value)
            }
          }
        }
        alloc[val + resource.id] = val
      }
      if (alloc[val + resource.id] % 1) {
        return Math.round((alloc[val + resource.id] * 10) / 10)
      }
      return alloc[val + resource.id]
    }

    var cap = {}
    // eslint-disable-next-line
    function getCapacity (start_date, resource, tasks, end_date) {
      // Потенциал
      // getCapacity
      // var projectStart = new Date(gantt.serverList('dates')[0].StartDate)
      // var projectEnd = new Date(gantt.serverList('dates')[0].FinishDate)
      if (gantt.$resourcesStore.hasChild(resource.id)) {
        return -1
      }
      // eslint-disable-next-line
      var minTask = tasks.sort((a, b) => a.start_date.getTime() - b.start_date.getTime())[0]
      // eslint-disable-next-line
      var maxTask = tasks.sort((a, b) => b.end_date.getTime() - a.end_date.getTime())[0]
      // eslint-disable-next-line
      var start = minTask ? minTask.start_date : start_date
      // eslint-disable-next-line
      var end = maxTask ? maxTask.end_date : end_date
      var val = 0
      if (!cap[val + resource.id]) {
        // val = gantt.calculateDuration( projectStart > start_date ? projectStart : start_date, projectEnd < end_date ? projectEnd : end_date)
        // eslint-disable-next-line
        val = gantt.calculateDuration(start >= start_date ? start : start_date, end <= end_date ? end : end_date)
        // val = gantt.calculateDuration(minTask ? minTask.start_date > start_date ? minTask.start_date : start_date : start_date, maxTask ? maxTask.end_date < end_date ? maxTask.end_date : end_date : end_date)
        cap[val + resource.id] = val
      }
      if (cap[val + resource.id] % 1) {
        return Math.round((cap[val + resource.id] * 10) / 10)
      }
      return cap[val + resource.id]
    }
    // eslint-disable-next-line
    gantt.templates.histogram_cell_class = function (start_date, end_date, resource, tasks) {
      if (getAllocatedValue(tasks, resource, start_date, end_date) > getCapacity(start_date, resource, tasks, end_date)) {
        return 'column_overload'
      }
    }
    // eslint-disable-next-line
    gantt.templates.histogram_cell_label = function (start_date, end_date, resource, tasks) {
      if (tasks.length && !gantt.$resourcesStore.hasChild(resource.id)) {
        return getAllocatedValue(tasks, resource, start_date, end_date) + '/' + getCapacity(start_date, resource, tasks, end_date)
      } else {
        if (!gantt.$resourcesStore.hasChild(resource.id)) {
          return '' // '&ndash;'
        }
        return ''
      }
    }
    // eslint-disable-next-line
    gantt.templates.histogram_cell_allocated = function (start_date, end_date, resource, tasks) {
      return getAllocatedValue(tasks, resource, start_date, end_date)
    }
    // eslint-disable-next-line
    gantt.templates.histogram_cell_capacity = function (start_date, end_date, resource, tasks) {
      if (!gantt.isWorkTime(start_date)) {
        return 0
      } else {
        return getCapacity(start_date, resource, tasks, end_date)
      }
    }
    // gantt.locale.labels.section_owner = "Owner";
    gantt.config.resource_render_empty_cells = true
    function getResourceAssignments (resourceId) {
      var assignments
      var s = gantt.getDatastore(gantt.config.resource_store)
      var resource = s.getItem(resourceId)
      if (resource.$level === 0) {
        assignments = []
        s.getChildren(resourceId).forEach(function (childId) {
          assignments = assignments.concat(gantt.getResourceAssignments(childId))
        })
      } else if (resource.$level === 1) {
        assignments = gantt.getResourceAssignments(resourceId)
      } else {
        assignments = gantt.getResourceAssignments(resource.$resource_id, resource.$task_id)
      }
      return assignments
    }
    // var resourceConfig
    // gantt.ext.zoom.attachEvent('onAfterZoom', function (level, config) {
    //   var resourceView = gantt.$ui.getView('resourceTimeline') // or resource histogram as defined in the layout config
    //   gantt.mixin(resourceView.$getConfig(), config, true)
    //   gantt.render()
    // })
    // console.log(gantt.getScale())
    gantt.config.fit_tasks = true
    gantt.plugins({
      grouping: true,
      marker: true,
      overlay: true,
      auto_scheduling: true,
      critical_path: true
      // keyboard_navigation: true,
      // undo: true
    })
    return gantt
  },
  ganttAttachEvents (gantt) {
    var filterValue = ''
    var delay
    gantt.$doFilter = function (value) {
      filterValue = value
      clearTimeout(delay)
      delay = setTimeout(function () {
        gantt.render()
        gantt.$root.querySelector('[data-text-filter]').focus()
      }, 200)
    }
    // gantt.$doFilter = function (value) {
    //   filterValue = value
    //   gantt.refreshData()
    //   let taskId = store.getters.selectedTaskId
    //   console.log('taskId', taskId)
    //   if (taskId) {
    //     gantt.render()
    //     gantt.selectTask(taskId)
    //     gantt.showTask(taskId)
    //   }
    // }
    gantt.attachEvent('onBeforeTaskDisplay', function (id, task) {
      if (!filterValue) return true
      var normalizedText = task.text.toLowerCase()
      var normalizedValue = filterValue.toLowerCase()
      return normalizedText.indexOf(normalizedValue) > -1
    })
    gantt.attachEvent('onGanttRender', function () {
      var element = document.getElementById('search')
      element.onclick = element.select()
      gantt.$root.querySelector('[data-text-filter]').value = filterValue
    })
    gantt.attachEvent('onLoadStart', async () => {
      let startLoading = Date.now()
      // store.commit('setLoading', true)
      store.commit('setStartLoading', startLoading)
    })
    gantt.attachEvent('onBeforeTaskAutoSchedule', function (task, start, link, predecessor) {
      if (task.progress > 0 || (link && link.hasOwnProperty('ScheduleMode') && link.ScheduleMode === 0)) {
        return false
      } else {
        return true
      }
    })
    // gantt.attachEvent('onLoadEnd', () => {
    //   let endLoading = Date.now()
    //   store.commit('setEndLoading', endLoading)
    //   store.commit('setLoading', false)
    //   console.log('Загрузка завершена за ', (endLoading - store.getters.startLoading) / 1000)
    //   try {
    //     let tasksUnsorted = gantt.getTaskByTime()
    //     for (let i = 0; i < tasksUnsorted.length; i++) {
    //       tasksUnsorted[i].global_id = tasksUnsorted[i].$index + 1
    //     }
    //     this.$props.tasks.data = tasksUnsorted
    //     gantt.refreshData()
    //     console.log(tasksUnsorted)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // })
    //
    return gantt
  },
  async ganttLoadResources (gantt, plan) {
    let resources = await utils.getProdResources(plan)
    // let resources = await utils.getResources(plan)
    // console.log(resources1)
    gantt.serverList('res', resources)
    gantt.$resourcesStore = gantt.createDatastore({
      name: gantt.config.resource_store,
      type: 'treeDataStore',
      initItem: function (item) {
        item.parent = item.parent || gantt.config.root_id
        item[gantt.config.resource_property] = item.parent
        item.open = true
        return item
      }
    })
    gantt.$resourcesStore.attachEvent('onAfterSelect', function (id) {
      gantt.refreshData()
    })
    gantt.$resourcesStore.attachEvent('onParse', function () {
      var people = []
      gantt.$resourcesStore.eachItem(function (res) {
        if (!gantt.$resourcesStore.hasChild(res.id)) {
          var copy = gantt.copy(res)
          copy.key = res.id
          copy.label = res.text
          copy.unit = '%'
          people.push(copy)
        }
      })
      gantt.updateCollection('people', people)
    })
    gantt.$resourcesStore.parse(resources)
    // console.log('res', gantt.serverList('res'))
    return gantt
  },
  async ganttLoadServerLists (gantt, plan) {
    gantt.serverList('dates', await utils.getTestDates(plan))
    // console.log(gantt.serverList('dates')[0].StartDate)
    // gantt.serverList('dates', dev ? await planData.getDevDates(planId) : test ? await planData.getTestDates(planId) : await planData.getProdDates(planId)) // 10710 12828 10001 11318
    // let resources = await utils.getProdResources(plan)
    // gantt.serverList('res', resources)
    // console.log('res', gantt.serverList('res'))
    // gantt.$resourcesStore.parse(resources)
    //
    return gantt
  }
}
