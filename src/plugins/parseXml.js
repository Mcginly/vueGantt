// WorkFormat
// 1 m (minutes)
// 2 h (hours, default))
// 3 d (days)
// 4 w (weeks)
// 5 mo (months)

// Task Type
// 0 Fixed units
// 1 Fixed duration
// 2 Fixed work

// Link Type
// 0 FF (finish-to-finish)
// 1 FS (finish-to-start)
// 2 SF (start-to-finish)
// 3 SS (start-to-start)

// Resource Type
// 0 Material (consumable supplies like steel, concrete, or soil)
// 1 Work (people and equipment)
// 2 Cost resource

class Project {
  constructor (Title = '', FileName = '', LastSaved = null, GUID = '', WorkFormat = 2, StartDate = null, FinishDate = null, ScheduleFromStart = true) {
    this.Title = Title
    this.FileName = FileName
    this.LastSaved = new Date(LastSaved)
    this.GUID = GUID
    this.WorkFormat = Number(WorkFormat)
    this.StartDate = new Date(StartDate)
    this.FinishDate = new Date(FinishDate)
    this.ScheduleFromStart = Boolean(ScheduleFromStart)
  }
}
class Task {
  // eslint-disable-next-line
  constructor ($custom_data, parent = '0', duration, Work) {
    // eslint-disable-next-line
    this.$custom_data = $custom_data
    // eslint-disable-next-line
    this.text = $custom_data ? $custom_data.Name : ''
    this.parent = parent
    this.id = Number($custom_data.UID)
    this.global_id = Number($custom_data.ID)
    this.open = true
    this.progress = Number($custom_data.PercentComplete) / 100
    this.closed = Number($custom_data.PercentComplete) >= 100 ? 1 : 0
    this.start_date = new Date($custom_data.Start)
    this.end_date = new Date($custom_data.Finish)
    this.duration = Number(duration)
    this.Work = Number(Work)
  }
}
//
function isObject (a) {
  return (!!a) && (a.constructor === Object)
}
function durationInHours (duration) {
  const X = duration
  const regexH = /T(.*)H/
  const regexM = /H(.*)M/
  let h = regexH.exec(X)
  let m = regexM.exec(X)
  let total = 0
  if (h !== null) {
    total += Number(h[1])
  }
  if (m !== null) {
    total += (Number(m[1]) / 60)
  }
  return total
}
function findWBS (rawTasks, task) {
  let WBS = task.WBS
  let WBSarr = WBS.split('.')
  let parentWBSarr = WBSarr.splice(0, WBSarr.length - 1)
  let parentWBS = parentWBSarr.join('.')
  if (parentWBS === '') {
    return '0'
  } else {
    let findParent = rawTasks.find(f => f.WBS === parentWBS)
    return isObject(findParent) ? findParent.UID : '0'
  }
}
//

export default {
  async importProject (data) {
    try {
      const rawData = data.Project
      const rawTasks = rawData.Tasks.Task
      let tasks = []
      for (let i = 1; i < rawTasks.length; i++) {
        const rawTask = rawTasks[i]
        tasks.push(new Task(rawTask, findWBS(rawTasks, rawTask), durationInHours(rawTask.Duration), durationInHours(rawTask.Work)))
      }
      const project = new Project(rawData.Title, rawData.Name, rawData.LastSaved, rawData.GUID, rawData.WorkFormat, rawData.StartDate, rawData.FinishDate, rawData.ScheduleFromStart)
      return { rawData, project, rawTasks, tasks }
    } catch (error) {
      return error
    }
  }
}
