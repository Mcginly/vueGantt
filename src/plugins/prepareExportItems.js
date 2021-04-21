import moment from 'moment'
// import store from '../store'

function getProjectDuration (val) {
  let d = moment.duration(Number(val * 60 * 60 * 1000), 'milliseconds')
  let hours = Math.floor(Number(val))
  let minutes = d.minutes()
  let seconds = d.seconds()
  return `PT${hours}H${minutes}M${seconds}S`
}

function getConstraint (val) {
  switch (val) {
    case 0:
      return 4
    case 1:
      return 5
    case 2:
      return 6
    case 3:
      return 7
    case 4:
      return 2
    case 5:
      return 4
    default:
      return 0
  }
}

function notIn (key) {
  switch (key) {
    case 0:
      return false
    case 1:
      return false
    case 2:
      return false
    case 3:
      return false
    case 4:
      return false
    case 5:
      return false
    case 6:
      return false
    default:
      return true
  }
}

function sumValues (arr, gantt) {
  let sum = 0
  let over = 0
  let actual = 0
  for (let i = 0; i < arr.length; i++) {
    const task = gantt.getTask(arr[i].task_id)
    sum += arr[i].value * (task.duration / 8)
    over += task.duration
    actual += task.closed === 0 ? 0 : arr[i].value * (task.duration / 8)
    // let dateEnd = moment(task.start_date).add(moment.duration((task.duration * 60 * 60 * 1000) / 100 * Number(task.CompletePercent), 'milliseconds')).toDate()
    // console.log(formatFunc(task.start_date), formatFunc(dateEnd))
  }
  return { sum, over, actual }
}

function getLinkType (val, gantt) {
  switch (val) {
    case gantt.config.links.finish_to_start:
      return 1
    case gantt.config.links.finish_to_finish:
      return 0
    case gantt.config.links.start_to_start:
      return 3
    case gantt.config.links.start_to_finish:
      return 2
    default:
      return 1
  }
}

function predFind (preparedTasks, val, tasks) {
  let find = null
  const ganttTask = tasks.find(t => Number(t.id) === Number(val))
  for (let i = 0; i < preparedTasks.length; i++) {
    const element = preparedTasks[i].Task._content
    find = element.find(c => Number(c._content.Value) === Number(ganttTask.task_id))
    if (find) {
      find = preparedTasks[i]
      break
    }
  }
  if (find) {
    return find
  } else {
    return false
  }
}

export default {
  writeTask (i, task, wbs, start, end, isCritical) {
    let Task = {
      'UID': i + 1,
      'ID': i + 1,
      'Name': task.text,
      'Active': 1,
      'Manual': 0,
      'Type': 1, // null - Фикс. объем ресурсов, 1 - Фикс. длительность, 2 - Фикс. трудозатраты
      'IsNull': 0,
      'CreateDate': String(task.CreationDate).substr(0, 19),
      'WBS': wbs,
      'OutlineNumber': wbs,
      'OutlineLevel': Number(task.$level) + 1,
      'Priority': 500,
      'Start': start,
      'Finish': task.type === 'milestone' ? start : end,
      'Duration': getProjectDuration(task.duration), // `PT${String(task.duration)}H0M0S`,
      'ManualStart': start,
      'ManualFinish': task.type === 'milestone' ? start : end,
      'ManualDuration': getProjectDuration(task.duration), // `PT${String(task.duration)}H0M0S`,
      'DurationFormat': 7, // 7 - дни, 39 - предполагаемые дни
      'Work': getProjectDuration(Number(String(task.workloadstring).replace(',', '.'))), // getProjectDuration(Number(task.Work)), // `PT${String(task.Work)}H0M0S`,
      'ResumeValid': 0,
      'EffortDriven': 0,
      'Recurring': 0,
      'OverAllocated': Number(String(task.workloadstring).replace(',', '.')) > Number(task.duration) ? 1 : 0, // Number(task.Work) > Number(task.duration) ? 1 : 0,
      'Estimated': 0,
      'Milestone': task.type === 'milestone' ? 1 : 0,
      'Summary': task.type === 'project' ? 1 : 0,
      // 'DisplayAsSummary': 0,
      'Critical': isCritical ? 1 : 0,
      'IsSubproject': 0, // task.pic_type === 'project' ? 1 : 0,
      'IsSubprojectReadOnly': 0, // task.pic_type === 'project' ? 1 : 0,
      'ExternalTask': 0,
      // 'EarlyStart': formatFunc(task.start_date),
      // 'EarlyFinish': task.type === 'milestone' ? formatFunc(task.start_date) : formatFunc(task.end_date),
      // 'LateStart': formatFunc(task.start_date),
      // 'LateFinish': task.type === 'milestone' ? formatFunc(task.start_date) : formatFunc(task.end_date),
      'StartVariance': 0,
      'FinishVariance': 0,
      'WorkVariance': 0, // Number(task.Work) * 60 * 1000 + '.00',
      'FreeSlack': 0,
      'TotalSlack': 0,
      'StartSlack': 0,
      'FinishSlack': 0,
      'FixedCost': 0,
      'FixedCostAccrual': 1,
      'PercentComplete': task.closed === 1 ? '100' : task.CompletePercent,
      'PercentWorkComplete': task.closed === 1 ? '100' : task.CompletePercent,
      'Cost': 0,
      'OvertimeCost': 0,
      'OvertimeWork': 'PT0H0M0S',
      'ActualStart': start,
      'ActualDuration': getProjectDuration(Number(task.duration) / 100 * Number(task.closed === 1 ? '100' : task.CompletePercent)), // `PT${String(Number(task.duration) / 100 * Number(task.CompletePercent))}H0M0S`,
      'ActualCost': 0,
      'ActualOvertimeCost': 0,
      'ActualWork': getProjectDuration(Number(String(task.workloadstring).replace(',', '.')) / 100 * Number(task.closed === 1 ? '100' : task.CompletePercent)), // getProjectDuration(Number(task.Work) / 100 * Number(task.CompletePercent)),
      'ActualOvertimeWork': 'PT0H0M0S',
      'RegularWork': 'PT0H0M0S', // getProjectDuration(Number(task.Work)),
      'RemainingDuration': 'PT0H0M0S', // getProjectDuration(Number(task.duration) - (Number(task.duration) / 100 * Number(task.CompletePercent))),
      'RemainingCost': 0,
      'RemainingWork': 'PT0H0M0S', // getProjectDuration(Number(task.Work) - (Number(task.Work) / 100 * Number(task.CompletePercent))),
      'RemainingOvertimeCost': 0,
      'RemainingOvertimeWork': 'PT0H0M0S',
      'ACWP': 0,
      'CV': 0,
      'ConstraintType': getConstraint(task.ConstraintType),
      'CalendarUID': 3,
      'LevelAssignments': 1,
      'LevelingCanSplit': 1,
      'LevelingDelay': 0,
      'LevelingDelayFormat': 8,
      'IgnoreResourceCalendar': 1, // игнорировать календарь ресурсов
      'HideBar': 0,
      'Rollup': 0,
      'BCWS': 0,
      'BCWP': 0,
      'PhysicalPercentComplete': 0,
      'EarnedValueMethod': 0,
      'IsPublished': 1,
      'CommitmentType': 0,
      'Notes': task.description
    }
    // store.dispatch('setImportCount', i + 1)
    return Task
  },
  writeAssignment (id, resourceId, taskUid, task, start, end, value, gantt) {
    // var formatFunc = gantt.date.date_to_str('%Y-%m-%dT%H:%i:%s')
    let assignment = {
      'Assignment': {
        'UID': id, // arr[i].resource_id,
        // 'GUID': String(uuid()).toUpperCase(),
        'TaskUID': taskUid,
        'ResourceUID': resourceId, // <ResourceUID>1</ResourceUID>
        'PercentWorkComplete': task.closed === 1 ? '100' : task.CompletePercent, // <PercentWorkComplete>100</PercentWorkComplete>
        'ActualCost': 0, // <ActualCost>0</ActualCost>
        'ActualOvertimeCost': 0,
        'ActualOvertimeWork': 'PT0H0M0S',
        'ActualStart': start,
        'ActualWork': getProjectDuration(Number(value * (task.duration / 8)) / 100 * Number(task.closed === 1 ? '100' : task.CompletePercent)), // `PT${String(arr[i].value * (task.duration / 8))}H0M0S`,
        'ACWP': 0,
        'Confirmed': 0,
        'Cost': 0,
        'CostRateTable': 0,
        'CostVariance': 0,
        'CV': 0,
        'Delay': 0,
        'Finish': task.type === 'milestone' ? start : end,
        'FinishVariance': 0,
        'WorkVariance': 0, // Number(Number(arr[i].value * (task.duration / 8)) * 60 * 1000).toFixed(2).replace(',', '.'),
        'HasFixedRateUnits': 1,
        'FixedMaterial': 0,
        'LevelingDelay': 0,
        'LevelingDelayFormat': 7,
        'LinkedFields': 0,
        'Milestone': task.type === 'milestone' ? 1 : 0,
        'Overallocated': Number(value) > Number(task.duration / 8) ? 1 : 0,
        'OvertimeCost': 0,
        'OvertimeWork': 'PT0H0M0S',
        'RegularWork': getProjectDuration(value * (task.duration / 8)),
        'RemainingCost': 0,
        'RemainingOvertimeCost': 0,
        'RemainingOvertimeWork': 'PT0H0M0S',
        'RemainingWork': getProjectDuration(Number(value * (task.duration / 8)) - (Number(value * (task.duration / 8)) / 100 * Number(task.closed === 1 ? '100' : task.CompletePercent))), // 'PT0H0M0S',
        'ResponsePending': 0,
        'Start': start,
        'StartVariance': 0,
        'Units': Number(value / 8),
        'UpdateNeeded': 0,
        'VAC': 0,
        'Work': getProjectDuration(value * (task.duration / 8)),
        'WorkContour': 0,
        'BCWS': 0,
        'BCWP': 0,
        'BookingType': 0,
        'CreationDate': new Date().toISOString().substr(0, 19),
        'RateScale': 0,
        // 'BudgetCost': 0,
        // 'BudgetWork': 'PT0H0M0S',
        'TimephasedData': {
          'Type': 2,
          'UID': id,
          'Start': start,
          'Finish': task.type === 'milestone' ? start : end, // formatFunc(moment(task.start_date).add(moment.duration((task.duration * 60 * 60 * 1000) / 100 * Number(task.CompletePercent), 'milliseconds')).toDate()), // formatFunc(task.end_date),
          'Unit': Number(value / 8),
          'Value': getProjectDuration(Number(value * (task.duration / 8)) / 100 * Number(task.closed === 1 ? '100' : task.CompletePercent)) // 'PT0H0M0S'
        }
      }
    }
    // function calcFinishPercent (start, duration, percent) {
    //   // let d = moment.duration(Number(val * 60 * 60 * 1000), 'milliseconds')
    //   let dateEnd = moment(start).add(moment.duration((duration * 60 * 60 * 1000) / 100 * percent))
    // }
    if (task.closed === 1) {
      assignment.Assignment.ActualFinish = task.type === 'milestone' ? start : end
      assignment.Assignment.Stop = task.type === 'milestone' ? start : end
      assignment.Assignment.Resume = task.type === 'milestone' ? start : end
    } else {
      assignment.Assignment.Stop = start
      assignment.Assignment.Resume = start
    }
    return assignment
  },
  writeCalendarAndResources (gantt, calendar, allExecutors) {
    return new Promise(async (resolve, reject) => {
      try {
        let resources = []
        let globalCalendar = []
        let worktimes = [
          { 'WeekDay': { 'DayType': 1, 'DayWorking': 0 } },
          { 'WeekDay': { 'DayType': 2, 'DayWorking': 1, 'WorkingTimes': [{ 'WorkingTime': { 'FromTime': '09:00:00', 'ToTime': '13:00:00' } }, { 'WorkingTime': { 'FromTime': '14:00:00', 'ToTime': '18:00:00' } }] } },
          { 'WeekDay': { 'DayType': 3, 'DayWorking': 1, 'WorkingTimes': [{ 'WorkingTime': { 'FromTime': '09:00:00', 'ToTime': '13:00:00' } }, { 'WorkingTime': { 'FromTime': '14:00:00', 'ToTime': '18:00:00' } }] } },
          { 'WeekDay': { 'DayType': 4, 'DayWorking': 1, 'WorkingTimes': [{ 'WorkingTime': { 'FromTime': '09:00:00', 'ToTime': '13:00:00' } }, { 'WorkingTime': { 'FromTime': '14:00:00', 'ToTime': '18:00:00' } }] } },
          { 'WeekDay': { 'DayType': 5, 'DayWorking': 1, 'WorkingTimes': [{ 'WorkingTime': { 'FromTime': '09:00:00', 'ToTime': '13:00:00' } }, { 'WorkingTime': { 'FromTime': '14:00:00', 'ToTime': '18:00:00' } }] } },
          { 'WeekDay': { 'DayType': 6, 'DayWorking': 1, 'WorkingTimes': [{ 'WorkingTime': { 'FromTime': '09:00:00', 'ToTime': '13:00:00' } }, { 'WorkingTime': { 'FromTime': '14:00:00', 'ToTime': '18:00:00' } }] } },
          { 'WeekDay': { 'DayType': 7, 'DayWorking': 0 } }
        ]
        for (const key in calendar._worktime.dates) {
          if (Object.hasOwnProperty.call(calendar._worktime.dates, key) && notIn(Number(key))) {
            const element = calendar._worktime.dates[key]
            if (element === true) {
              // console.log(element)
              worktimes.push({
                'WeekDay': {
                  'DayType': 0,
                  'DayWorking': 1,
                  'TimePeriod': { 'FromDate': new Date(Number(key)).toISOString().substr(0, 11) + '00:00:00', 'ToDate': new Date(Number(key)).toISOString().substr(0, 11) + '23:59:50' },
                  'WorkingTimes': [{ 'WorkingTime': { 'FromTime': '09:00:00', 'ToTime': '13:00:00' } }, { 'WorkingTime': { 'FromTime': '14:00:00', 'ToTime': '18:00:00' } }]
                }
              })
            } else {
              worktimes.push({
                'WeekDay': {
                  'DayType': 0,
                  'DayWorking': 0,
                  'TimePeriod': { 'FromDate': new Date(Number(key)).toISOString().substr(0, 11) + '00:00:00', 'ToDate': new Date(Number(key)).toISOString().substr(0, 11) + '23:59:50' }
                }
              })
            }
          }
        }
        globalCalendar.push({
          'Calendar': {
            'UID': 3,
            // 'GUID': String(uuid()).toUpperCase(),
            'Name': 'Стандартный',
            'IsBaseCalendar': 1,
            'IsBaselineCalendar': 1,
            'BaseCalendarUID': '-1',
            'WeekDays': worktimes
          }
        })
        resources.push({
          'Resource': {
            'UID': 0,
            'ID': 0,
            'Type': 1,
            'IsNull': 0,
            'WorkGroup': 0,
            'MaxUnits': 1,
            'PeakUnits': 0,
            'OverAllocated': 0,
            'CanLevel': 1,
            'AccrueAt': 3,
            'Work': 'PT0H0M0S',
            'RegularWork': 'PT0H0M0S',
            'OvertimeWork': 'PT0H0M0S',
            'ActualWork': 'PT0H0M0S',
            'RemainingWork': 'PT0H0M0S',
            'ActualOvertimeWork': 'PT0H0M0S',
            'RemainingOvertimeWork': 'PT0H0M0S',
            'PercentWorkComplete': 0,
            'StandardRate': 0,
            'StandardRateFormat': 2,
            'Cost': 0,
            'OvertimeRate': 0,
            'OvertimeRateFormat': 2,
            'OvertimeCost': 0,
            'CostPerUse': 0,
            'ActualCost': 0,
            'ActualOvertimeCost': 0,
            'RemainingCost': 0,
            'RemainingOvertimeCost': 0,
            'WorkVariance': 0,
            'CostVariance': 0,
            'SV': 0,
            'CV': 0,
            'ACWP': 0,
            'BCWS': 0,
            'BCWP': 0,
            'IsGeneric': 0,
            'IsInactive': 0,
            'IsEnterprise': 0,
            'BookingType': 0,
            'CreationDate': new Date().toISOString().substr(0, 19),
            'IsBudget': 0
          }
        })
        for (let e = 0; e < allExecutors.length; e++) {
          const executor = allExecutors[e]
          // const assignments = gantt.serverList('res').filter(f => Number(f.id) === Number(executor.id) && f.PlanItem)
          const assignments = gantt.getResourceAssignments(Number(executor.id))
          let executorAllocate = sumValues(assignments, gantt)
          globalCalendar.push({
            'Calendar': {
              'UID': e + 1,
              // 'GUID': String(uuid()).toUpperCase(),
              'Name': executor.fullName,
              'IsBaseCalendar': 0,
              'IsBaselineCalendar': 0,
              'BaseCalendarUID': 3
            }
          })
          resources.push({
            'Resource': {
              'UID': e + 1,
              // 'GUID': String(uuid()).toUpperCase(),
              'ID': e + 1,
              'Name': executor.fullName,
              'Type': 1,
              'IsNull': 0,
              'Initials': String(executor.fullName).substr(0, 1),
              'WorkGroup': 0,
              'MaxUnits': 1,
              'PeakUnits': 1,
              'OverAllocated': executorAllocate.sum > executorAllocate.over ? 1 : 0,
              'CanLevel': 1,
              'AccrueAt': 3,
              'Work': getProjectDuration(executorAllocate.sum), // 'PT0H0M0S'
              'RegularWork': getProjectDuration(executorAllocate.sum), // 'PT0H0M0S'
              'OvertimeWork': 'PT0H0M0S',
              'ActualWork': getProjectDuration(executorAllocate.actual / 100 * Math.round(executorAllocate.actual / executorAllocate.sum * 100)), // `PT${String(executorAllocate.actual)}H0M0S`,
              'RemainingWork': getProjectDuration(Number(executorAllocate.sum - executorAllocate.actual) - (Number(executorAllocate.sum - executorAllocate.actual) / 100 * Math.round(executorAllocate.actual / executorAllocate.sum * 100))), // `PT${String(executorAllocate.sum - executorAllocate.actual)}H0M0S`,
              'ActualOvertimeWork': 'PT0H0M0S',
              'RemainingOvertimeWork': 'PT0H0M0S',
              'PercentWorkComplete': Math.round(executorAllocate.actual / executorAllocate.sum * 100),
              'StandardRate': 0,
              'StandardRateFormat': 2,
              'Cost': 0,
              'OvertimeRate': 0,
              'OvertimeRateFormat': 2,
              'OvertimeCost': 0,
              'CostPerUse': 0,
              'ActualCost': 0,
              'ActualOvertimeCost': 0,
              'RemainingCost': 0,
              'RemainingOvertimeCost': 0,
              'WorkVariance': Number(executorAllocate.sum * 60 * 1000).toFixed(2).replace(',', '.'),
              'CostVariance': 0,
              'SV': 0,
              'CV': 0,
              'ACWP': 0,
              'CalendarUID': e + 1,
              'BCWS': 0,
              'BCWP': 0,
              'IsGeneric': 0,
              'IsInactive': 0,
              'IsEnterprise': 0,
              'BookingType': 0,
              'IsCostResource': 0,
              'IsBudget': 0
              // <ExtendedAttribute>
              //   <FieldID>205520904</FieldID>
              //   <Value>ResourceUid=341d5335-d5d7-4e8e-b62a-5f62b68d80ab;ResourceType=575ac28d-1977-4e26-a903-1e001dadc7a6</Value>
              // </ExtendedAttribute>
            }
          })
          // console.log(executor.id, executorAllocate)
        }

        return resolve({ resources, globalCalendar })
      } catch (error) {
        return reject(error)
      }
    })
  },
  setPredecessors (preparedTasks, gantt, tasks) {
    return new Promise(async (resolve, reject) => {
      try {
        let returnTasks = preparedTasks
        for (let i = 0; i < preparedTasks.length; i++) {
          let existingTask = preparedTasks[i].Task._content.find(f => f._content.FieldID === 188743743)
          if (existingTask) {
            const task = tasks.find(t => Number(t.task_id) === Number(existingTask._content.Value))
            if (task) {
              for (let p = 0; p < task.$target.length; p++) {
                const link = gantt.getLink(task.$target[p])
                let predTask = predFind(preparedTasks, Number(link.source), tasks)
                returnTasks[i].Task._content.push({
                  _name: 'PredecessorLink',
                  _content: {
                    'PredecessorUID': predTask.Task.UID,
                    'Type': getLinkType(link.type, gantt),
                    'CrossProject': 0,
                    'LinkLag': link.LagFormat === 2 ? link.lag * 4800 : link.lag * 600,
                    'LagFormat': 7
                  }
                }
                )
              }
            }
          }
        }
        return resolve(returnTasks)
      } catch (error) {
        return reject(error)
      }
    })
  }
}
