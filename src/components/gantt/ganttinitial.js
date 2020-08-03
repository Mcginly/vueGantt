import getdata from '../../config/utils'
import store from '../../store'

export default {
  ganttInitialConfig (gantt) {
    gantt.config.types['phase'] = 'phase'
    gantt.config.types['subplan'] = 'subplan'
    gantt.config.date_format = '%Y-%m-%d %H:%i:%s'
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
    gantt.config.min_column_width = 30
    gantt.config.scale_height = 75
    gantt.config.row_height = 24
    //
    gantt.config.duration_unit = 'hour'
    gantt.config.duration_step = 1
    gantt.config.work_time = true
    gantt.config.correct_work_time = true
    gantt.config.round_dnd_dates = false
    gantt.config.auto_scheduling_initial = false
    gantt.config.auto_scheduling = true
    gantt.config.auto_scheduling_strict = false
    gantt.config.auto_scheduling_compatibility = true
    gantt.setWorkTime({ date: new Date(2019, 0, 1), hours: false })
    gantt.setWorkTime({ date: new Date(2019, 0, 2), hours: false })
    gantt.setWorkTime({ date: new Date(2019, 0, 3), hours: false })
    gantt.setWorkTime({ date: new Date(2019, 0, 4), hours: false })
    gantt.setWorkTime({ date: new Date(2019, 0, 7), hours: false })
    gantt.setWorkTime({ date: new Date(2019, 0, 8), hours: false })
    gantt.setWorkTime({ date: new Date(2019, 2, 8), hours: false })
    gantt.setWorkTime({ date: new Date(2019, 4, 1), hours: false })
    gantt.setWorkTime({ date: new Date(2019, 4, 2), hours: false })
    gantt.setWorkTime({ date: new Date(2019, 4, 3), hours: false })
    gantt.setWorkTime({ date: new Date(2019, 4, 9), hours: false })
    gantt.setWorkTime({ date: new Date(2019, 4, 10), hours: false })
    gantt.setWorkTime({ date: new Date(2019, 5, 12), hours: false })
    gantt.setWorkTime({ date: new Date(2019, 10, 4), hours: false })
    gantt.setWorkTime({ date: new Date(2020, 0, 1), hours: false })
    gantt.setWorkTime({ date: new Date(2020, 0, 2), hours: false })
    gantt.setWorkTime({ date: new Date(2020, 0, 3), hours: false })
    gantt.setWorkTime({ date: new Date(2020, 0, 6), hours: false })
    gantt.setWorkTime({ date: new Date(2020, 0, 7), hours: false })
    gantt.setWorkTime({ date: new Date(2020, 0, 8), hours: false })
    gantt.setWorkTime({ date: new Date(2020, 1, 24), hours: false })
    gantt.setWorkTime({ date: new Date(2020, 2, 9), hours: false })
    gantt.setWorkTime({ date: new Date(2020, 4, 1), hours: false })
    gantt.setWorkTime({ date: new Date(2020, 4, 4), hours: false })
    gantt.setWorkTime({ date: new Date(2020, 4, 5), hours: false })
    gantt.setWorkTime({ date: new Date(2020, 4, 11), hours: false })
    gantt.setWorkTime({ date: new Date(2020, 5, 12), hours: false })
    gantt.setWorkTime({ date: new Date(2020, 10, 4), hours: false })
    gantt.setWorkTime({ date: new Date(2021, 0, 1), hours: false })
    gantt.setWorkTime({ date: new Date(2021, 0, 4), hours: false })
    gantt.setWorkTime({ date: new Date(2021, 0, 5), hours: false })
    gantt.setWorkTime({ date: new Date(2021, 0, 6), hours: false })
    gantt.setWorkTime({ date: new Date(2021, 0, 7), hours: false })
    gantt.setWorkTime({ date: new Date(2021, 0, 8), hours: false })
    gantt.setWorkTime({ date: new Date(2021, 1, 23), hours: false })
    gantt.setWorkTime({ date: new Date(2021, 2, 8), hours: false })
    gantt.setWorkTime({ date: new Date(2021, 4, 3), hours: false })
    gantt.setWorkTime({ date: new Date(2021, 4, 10), hours: false })
    gantt.setWorkTime({ date: new Date(2021, 5, 14), hours: false })
    gantt.setWorkTime({ date: new Date(2021, 10, 4), hours: false })
    gantt.setWorkTime({ hours: [9, 13, 14, 18] })
    //
    gantt.config.order_branch = true
    gantt.config.order_branch_free = true
    gantt.config.sort = true
    // gantt.config.keyboard_navigation_cells = true
    gantt.config.show_unscheduled = true
    gantt.config.placeholder_task = true
    // gantt.config.auto_types = true
    // gantt.config.details_on_create = true
    gantt.config.link_line_width = 1
    gantt.config.grid_resize = true
    gantt.config.readonly = true
    // gantt.config.grid_elastic_columns = true
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
    gantt.templates.task_text = function (start, end, task) {
      return ''
    }
    gantt.templates.rightside_text = function (start, end, task) {
      return task.text
    }
    gantt.templates.grid_folder = function (item) {
      switch (item.pic_type) {
        case 'task':
          return `<div class='gantt_tree_icon planTask'></div>`
        case 'project':
          return `<div class='gantt_tree_icon planSubPlan'></div>`
        case 'milestone':
          return `<div class='gantt_tree_icon planMilestone'></div>`
        case 'phase':
          return `<div class='gantt_tree_icon planPhaseTask'></div>`
        default:
          return ''
      }
    }
    gantt.templates.grid_file = function (item) {
      switch (item.pic_type) {
        case 'task':
          return `<div class='gantt_tree_icon planTask'></div>`
        case 'project':
          return `<div class='gantt_tree_icon planSubPlan'></div>`
        case 'milestone':
          return `<div class='gantt_tree_icon planMilestone'></div>`
        case 'phase':
          return `<div class='gantt_tree_icon planPhaseTask'></div>`
        default:
          return ''
      }
    }
    //
    gantt.config.type_renderers[gantt.config.types.phase] = function (task) {
      var mainEl = document.createElement('div')
      mainEl.setAttribute(gantt.config.task_attribute, task.id)
      var size = gantt.getTaskPosition(task)
      mainEl.innerHTML = [
        `<div class='project-left'></div>`,
        `<div class='project-right'></div>`
      ].join('')
      mainEl.className = 'custom-project'
      mainEl.style.left = size.left + 'px'
      mainEl.style.top = size.top + 7 + 'px'
      mainEl.style.width = size.width + 'px'
      return mainEl
    }
    //
    gantt.templates.task_class = function (start, end, task) {
      if (task.type === gantt.config.types.phase) {
        return 'phase_task'
      } else {
        if (task.type === gantt.config.types.subplan) {
          return 'subplan_task'
        } else {
          if (task.type === gantt.config.types.project) {
            return 'hide_project_progress_drag'
          } else {
            return ''
          }
        }
      }
    }
    gantt.templates.progress_text = function (start, end, task) {
      return `<span style='text-align:left; color: white; font-size:10pt;'>${Math.round(task.progress * 100)}%</span>`
    }
    // begin summary
    function calculateSummaryProgress (task) {
      if (task.type === gantt.config.types.task || task.type === gantt.config.types.milestone) return task.progress
      var totalToDo = 0
      var totalDone = 0
      gantt.eachTask(function (child) {
        if (child.type === gantt.config.types.task || child.type === gantt.config.types.milestone || child.type === gantt.config.types.subplan || child.type === gantt.config.types.phase) {
          totalToDo += child.duration
          totalDone += (child.progress || 0) * child.duration
        }
      }, task.id)
      if (!totalToDo) return 0
      else return totalDone / totalToDo
    }
    function refreshSummaryProgress (id, submit) {
      if (!gantt.isTaskExists(id)) return
      var task = gantt.getTask(id)
      task.progress = calculateSummaryProgress(task)
      if (!submit) {
        gantt.refreshTask(id)
      } else {
        gantt.updateTask(id)
      }
      if (!submit && gantt.getParent(id) !== gantt.config.root_id) {
        refreshSummaryProgress(gantt.getParent(id), submit)
      }
    }
    gantt.attachEvent('onParse', function () {
      gantt.eachTask(function (task) {
        // gantt.roundTaskDates(task)
        task.progress = calculateSummaryProgress(task)
      })
    })
    gantt.attachEvent('onAfterTaskUpdate', function (id) {
      refreshSummaryProgress(gantt.getParent(id), true)
    })
    gantt.attachEvent('onTaskDrag', function (id) {
      refreshSummaryProgress(gantt.getParent(id), false)
    })
    function formatEndDate (date, template) {
      // get 23:59:59 instead of 00:00:00 for the end date
      return template(new Date(date.valueOf() - 1))
    }
    function expiredChildrenTasksDate (task) {
      if (task.expired === 1) {
        // let dateToStr = gantt.date.date_to_str('%d.%m.%Y')
        return `<div style='color: red;'>` + formatEndDate(task.end_date, gantt.templates.date_grid) + '</div>'
      } else {
        // let dateToStr = gantt.date.date_to_str('%d.%m.%Y')
        return formatEndDate(task.end_date, gantt.templates.date_grid)
      }
    }
    function myFunc (task) {
      if (gantt.hasChild(task.id)) {
        let ch = gantt.getChildren(task.id)
        let expired = false
        for (let index = 0; index < ch.length; index++) {
          const element = ch[index]
          let chTask = gantt.getTask(element)
          if (chTask.expired === 1) {
            expired = true
          }
        }
        return expired
      } else {
        return false
      }
    }
    function expiredChildrenTasks (task) {
      if (gantt.hasChild(task.id)) {
        let ch = gantt.getChildren(task.id)
        let expired = false
        for (let index = 0; index < ch.length; index++) {
          const element = ch[index]
          let chTask = gantt.getTask(element)
          if (gantt.hasChild(chTask.id)) {
            expired = myFunc(chTask)
          } else {
            if (chTask.expired === 1) {
              expired = true
            }
          }
        }
        switch (expired) {
          case true:
            if (task.closed === 1 || task.progress >= 1) {
              return task.task_id ? `<div id="Task_${task.id}"><a href='` + task.url + `' style='color: red; text-decoration: line-through;' target='_blank'>` + task.text + `</a></div>`
                : `<div id="Task_null"><span style='color: red; text-decoration: line-through;'>` + task.text + `</span></div>`
            } else {
              return task.task_id ? `<div id="Task_${task.id}"><a href='` + task.url + `' style='color: red; text-decoration: none;' target='_blank'>` + task.text + `</a></div>`
                : `<div id="Task_null"><span style='color: red; text-decoration: none;'>` + task.text + `</span></div>`
            }
          case false:
            if (task.expired === 1) {
              if (task.closed === 1 || task.progress >= 1) {
                return task.task_id ? `<div id="Task_${task.id}"><a href='` + task.url + `' style='color: red; text-decoration: line-through;' target='_blank'>` + task.text + `</a></div>`
                  : `<div id="Task_null"><span style='color: red; text-decoration: line-through;'>` + task.text + `</span></div>`
              } else {
                return task.task_id ? `<div id="Task_${task.id}"><a href='` + task.url + `' style='color: red; text-decoration: none;' target='_blank'>` + task.text + `</a></div>`
                  : `<div id="Task_null"><span style='style='color: red; text-decoration: none;'>` + task.text + `</span></div>`
              }
            } else {
              if (task.closed === 1 || task.progress >= 1) {
                return task.task_id ? `<div id="Task_${task.id}"><a href='` + task.url + `' style='text-decoration: line-through;' target='_blank'>` + task.text + `</a></div>`
                  : `<div id="Task_null"><span style='text-decoration: line-through;'>` + task.text + `</span></div>`
              } else {
                return task.task_id ? `<div id="Task_${task.id}"><a href='` + task.url + `' style='text-decoration: none;' target='_blank'>` + task.text + `</a></div>`
                  : `<div id="Task_null"><span style='text-decoration: none;'>` + task.text + `</span></div>`
              }
            }
        }
      } else {
        switch (task.expired) {
          case 1:
            if (task.closed === 1 || task.progress >= 1) {
              return task.task_id ? `<div id="Task_${task.id}"><a href='` + task.url + `' style='color: red; text-decoration: line-through;' target='_blank'>` + task.text + `</a></div>`
                : `<div id="Task_null"><span style='color: red; text-decoration: line-through;'>` + task.text + `</span></div>`
            } else {
              return task.task_id ? `<div id="Task_${task.id}"><a href='` + task.url + `' style='color: red; text-decoration: none;' target='_blank'>` + task.text + `</a></div>`
                : `<div id="Task_null"><span style='color: red; text-decoration: none;'>` + task.text + `</span></div>`
            }
          case 0:
            if (task.closed === 1 || task.progress >= 1) {
              return task.task_id ? `<div id="Task_${task.id}"><a href='` + task.url + `' style='text-decoration: line-through;' target='_blank'>` + task.text + `</a></div>`
                : `<div id="Task_null"><span style='text-decoration: line-through;'>` + task.text + `</span></div>`
            } else {
              return task.task_id ? `<div id="Task_${task.id}"><a href='` + task.url + `' style='text-decoration: none;' target='_blank'>` + task.text + `</a></div>`
                : `<div id="Task_null"><span style='text-decoration: none;'>` + task.text + `</span></div>`
            }
          default: return task.task_id ? `<div id="Task_${task.id}"><a href='` + task.url + `' style='text-decoration: none;' target='_blank'>` + task.text + `</a></div>` : `<div id="Task_null"><span style='text-decoration: none;'>` + task.text + `</span></div>`
        }
      }
    }
    function byId (list, id) {
      const find = list.find(f => Number(f.PlanItem) === id)
      // console.log(find)
      if (find) {
        return '<b>' + find.text ? find.text : find.dep_name + '</b>'
      } else {
        return 'Нет исполнителя'
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
    gantt.templates.task_row_class = function (start_date, end_date, item) {
      if (item.progress >= 1 && item.expired !== 1) {
        return ''
      } else {
        if (item.progress >= 1 && item.expired === 1) {
          return 'expired_tasks'
        } else {
          if (item.progress < 1 && item.expired === 1) {
            return 'expired_inwork'
          }
        }
      }
    }
    gantt.templates.progress_text = function (start, end, task) {
      return `<span style='text-align:left;'>` + Math.round(task.progress * 100) + '%</span>'
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
    var textFilter = `<div>Задача <input data-text-filter id='search' type='text' placeholder='поиск...' oninput='gantt.$doFilter(this.value)' onclick="this.select()"></div>`
    gantt.config.columns = [
      { name: 'global_id', label: '#', min_width: 30, width: 30, resize: true, template: function (item) { return item.global_id } },
      { name: 'progress', min_width: 50, width: 80, label: 'Выполнение', resize: true, align: 'center', template: function (item) { return Math.round(item.progress * 100) + '%' } },
      { name: 'text', label: textFilter, min_width: 150, width: 400, tree: true, resize: true, template: expiredChildrenTasks },
      { name: 'duration', min_width: 50, width: 80, align: 'center', template: function (item) { return Math.round(item.duration / 8) }, resize: true },
      { name: 'start_date', min_width: 50, width: 100, align: 'center', resize: true },
      { name: 'end_date', min_width: 50, width: 100, align: 'center', resize: true, template: expiredChildrenTasksDate },
      { name: 'owner', min_width: 50, width: 130, align: 'left', resize: true, template: function (item) { return byId(gantt.serverList('res'), item.id) } },
      {
        name: 'index_editor',
        label: 'Предшественники',
        min_width: 50,
        width: 120,
        resize: true,
        // editor: { type: "index_editor", map_to: "index_editor" },
        template: function (task) {
          var links = task.$target
          var labels = []
          for (var i = 0; i < links.length; i++) {
            var link = gantt.getLink(links[i])
            var pred = gantt.getTask(link.source)
            labels.push(pred.global_id)
          }
          return task.index_editor || labels.join(', ')
        }
      },
      {
        name: 'successors',
        label: 'Последователи',
        min_width: 50,
        width: 120,
        resize: true,
        template: function (task) {
          var links = task.$source
          var labels = []
          for (var i = 0; i < links.length; i++) {
            var link = gantt.getLink(links[i])
            var pred = gantt.getTask(link.target)
            labels.push(pred.global_id)
          }
          return task.index_editor || labels.join(', ')
        }
      },
      { name: 'wbs', label: 'Иерархия', width: 60, resize: true, template: gantt.getWBSCode, hide: false }
    ]
    gantt.config.layout = {
      css: 'gantt_container',
      cols: [
        {
          width: 500,
          min_width: 300,
          rows: [
            { view: 'grid', scrollX: 'gridScroll', scrollable: true, scrollY: 'scrollVer' },
            { view: 'scrollbar', id: 'gridScroll', group: 'horizontal' }
          ]
        },
        { resizer: true, width: 1 },
        {
          rows: [
            { view: 'timeline', scrollX: 'scrollHor', scrollY: 'scrollVer' },
            { view: 'scrollbar', id: 'scrollHor', group: 'horizontal' }
          ]
        },
        { view: 'scrollbar', id: 'scrollVer' }
      ]
    }
    //
    //
    gantt.config.min_column_width = 50
    gantt.config.scale_height = 75
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
                var endDate = gantt.date.add(gantt.date.add(date, 3, 'month'), -1, 'day')
                return dateToStr(date) + ' - ' + dateToStr(endDate)
              }
            }
          ]
        },
        {
          name: 'month',
          scales: [
            { unit: 'month', format: '%F, %Y', step: 1 },
            { unit: 'week', format: '%W', step: 1 }
          ]
        },
        //
        {
          name: 'monthone',
          scales: [
            { unit: 'month', format: '%F, %Y', step: 1 },
            {
              unit: 'day',
              step: 12,
              format: function (date) {
                var hourToStr = gantt.date.date_to_str('%d %M')
                var intervalEnd = new Date(gantt.date.add(date, 12, 'day') - 1)
                return hourToStr(date) + ' - ' + hourToStr(intervalEnd)
              }
            }
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
                var endDate = gantt.date.add(date, -6, 'day')
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
    // var zoomConfig = {
    //   minColumnWidth: 80,
    //   maxColumnWidth: 150,
    //   levels: [
    //     [
    //       { unit: 'month', format: '%F, %Y', step: 1 },
    //       { unit: 'week', step: 1, format: function (date) {
    //          var dateToStr = gantt.date.date_to_str('%d %M')
    //          var endDate = gantt.date.add(date, -6, 'day')
    //          var weekNum = gantt.date.date_to_str('%W')(date)
    //          return weekNum + ', ' + dateToStr(date) + ' - ' + dateToStr(endDate)
    //        } }
    //     ],
    //     [
    //       { unit: 'month', format: '%F, %Y', step: 1 },
    //       { unit: 'day', step: 1, format: '%d %M' }
    //     ],
    //     [
    //       { unit: 'day', step: 1, format: '%d %M' },
    //       { unit: 'hour', format: hourRangeFormat(12), step: 12 }
    //     ],
    //     [
    //       { unit: 'day', step: 1, format: '%d %M' },
    //       { unit: 'hour', format: hourRangeFormat(6), step: 6 }
    //     ],
    //     [
    //       { unit: 'day', step: 1, format: '%d %M' },
    //       { unit: 'hour', format: '%H:%i', step: 1 }
    //     ]
    //   ],
    //   startDate: new Date(gantt.serverList('dates')[0].StartDate),
    //   endDate: new Date(gantt.serverList('dates')[0].FinishDate),
    //   useKey: "ctrlKey",
    //   trigger: "wheel",
    //   element: function () {
    //     return gantt.$root.querySelector(".gantt_task")
    //   }
    // }
    //
    gantt.ext.zoom.init(zoomConfig)
    gantt.ext.zoom.setLevel('month')
    console.log(gantt.getScale())
    gantt.config.fit_tasks = true
    return gantt
  },
  ganttAttachEvents (gantt) {
    var filterValue = ''
    gantt.$doFilter = function (value) {
      filterValue = value
      gantt.refreshData()
      let taskId = store.getters.selectedTaskId
      console.log('taskId', taskId)
      if (taskId) {
        gantt.render()
        gantt.selectTask(taskId)
        gantt.showTask(taskId)
      }
    }
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
    let resources = await getdata.getProdResources(plan)
    gantt.serverList('res', resources)
    console.log('res', gantt.serverList('res'))
    return gantt
  },
  async ganttLoadServerLists (gantt, plan) {
    gantt.serverList('dates', await getdata.getTestDates(plan))
    console.log(gantt.serverList('dates')[0].StartDate)
    // gantt.serverList('dates', dev ? await planData.getDevDates(planId) : test ? await planData.getTestDates(planId) : await planData.getProdDates(planId)) // 10710 12828 10001 11318
    // let resources = await getdata.getProdResources(plan)
    // gantt.serverList('res', resources)
    // console.log('res', gantt.serverList('res'))
    // gantt.$resourcesStore.parse(resources)
    //
    return gantt
  }
}
