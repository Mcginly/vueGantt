import config from '../config/config'
import axios from 'axios'
import moment from 'moment'
import store from '../store'

function checkToken (token) {
  return new Promise(async (resolve, reject) => {
    if (token === null) {
      try {
        const token = await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}${config.wasd_AUTH_PATH}${config.wasd_AUTH_USER}`, config.wasd_AUTH_PASS, { // wasd_API - вернуть после отладки
          headers: {
            'Content-Type': 'application/json',
            'ApplicationToken': config.wasd_WEB_API_TOKEN // wasd_API_TOKEN - вернуть после отладки
          }
        })
        store.dispatch('setToken', token.data.AuthToken)
        resolve(token.data.AuthToken)
      } catch (error) {
        store.dispatch('setToken', null)
        reject(error)
      }
    } else {
      try {
        const checkToken = await axios(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}${config.wasd_CHECK_TOKEN}${token}`) // wasd_API - вернуть после отладки
        store.dispatch('setToken', checkToken.data.AuthToken)
        resolve(checkToken.data.AuthToken)
      } catch (error) {
        store.dispatch('setToken', null)
        reject(error)
      }
    }
  })
}
//
function createPlanItem (task, token, splitTasks) {
  return new Promise(async (resolve, reject) => {
    // setTimeout(async () => {
    try {
      let newTasks = []
      const controlUserQuery = { 'Items': [{ 'Name': 'Type', 'Value': '0' }] }
      if (task.executor_id && task.executor_id.length > 1 && task.type !== 'project') { // Если несколько исполнителей
        if (splitTasks) { // Если разделять задачи
          for (let e = 0; e < task.executor_id.length; e++) {
            const newExecutor = {
              'Items': [
                { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': 3132 }] }, 'Name': 'User' }, // 'Value': task.executor_id[e].resource_id
                { 'Name': 'Type', 'Value': '2' }
              ]
            }
            // 1. Create ProjectTaskExecutor
            await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/b75f0503-2054-4186-ac6c-5afb1c167ab5`, newExecutor, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
              .then(async projectTaskExecutor => {
                // 2. Create ControlUser in ProjectTaskExecutor
                await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/b75f0503-2054-4186-ac6c-5afb1c167ab5`, controlUserQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
                  .then(async c => {
                    const multipleItemQuery = {
                      'Items': [
                        { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': 75145 }] }, 'Name': 'ProjectPlan' },
                        { 'Name': 'IndexNumber', 'Value': task.newId }, // task.wasdIndex
                        { 'Name': 'ItemType', 'Value': task.type === 'task' ? 0 : task.type === 'milestone' ? 2 : 0 }, //
                        { 'Name': 'Subject', 'Value': task.text },
                        // 00:00:10 23:59:50
                        { 'Name': 'StartDate', 'Value': moment(task.start_date).format('MM/DD/YYYY') + ' 00:00:10' },
                        { 'Name': 'EndDate', 'Value': moment(task.end_date).format('MM/DD/YYYY') + ' 23:59:50' },
                        // { 'Name': 'StartDate', 'Value': moment(task.start_date).format('MM/DD/YYYY hh:mm:ss') },
                        // { 'Name': 'EndDate', 'Value': moment(task.end_date).format('MM/DD/YYYY hh:mm:ss') },
                        { 'Name': 'PlanWorkLog', 'Value': task.duration * 60 }, //
                        { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': projectTaskExecutor.data }] }, 'Name': 'Executor' },
                        { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': 3132 }] }, 'Name': 'CreationAuthor' }, // CreationAuthor
                        { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': c.data }] }, 'Name': 'ControlUser' }, // ControlUser
                        { 'Name': 'ControlType', 'Value': '1' },
                        { 'Name': 'UnderControl', 'Value': 'True' },
                        { 'Name': 'CompletePercent', 'Value': task.closed ? '100' : String(Math.round(task.PercentComplete * 100)) }
                      ]
                    }
                    // 3. Create PlanItem
                    await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/be46e72c-dc98-4aed-af48-17b0e13fb137`, multipleItemQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
                      .then(async newPlanItem => {
                        newTasks.push(newPlanItem.data)
                        const multipleWorkForceQuery = {
                          'Items': [
                            { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': newPlanItem.data }] }, 'Name': 'PlanItem' },
                            { 'Name': 'Percent', 'Value': '100' }, // передать значение загрузки ресурса
                            { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': 3132 }] }, 'Name': 'WorkForce' } // 'Value': task.executor_id[e].resource_id
                          ]
                        }
                        // 4. Create WorkForcePlanItem
                        await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/8b568e4d-504d-49a2-918e-4c16c696e507`, multipleWorkForceQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
                          .catch(err => {
                            return reject(err)
                          })
                      })
                      .catch(err => {
                        return reject(err)
                      })
                  })
                  .catch(err => {
                    return reject(err)
                  })
              })
              .catch(err => {
                return reject(err)
              })
          }
          // Запишем созданные PlanItems для подготовки к записи связей задач в следующей итерации
          task.newPlanItems = newTasks
        } else { // если не делить задачи
          let executors = []
          for (let e = 0; e < task.executor_id.length; e++) {
            const newExecutor = {
              'Items': [
                { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': 3132 }] }, 'Name': 'User' }, // 'Value': task.executor_id[e].resource_id
                { 'Name': 'Type', 'Value': '2' }
              ]
            }
            // 1. Create ProjectTaskExecutor
            await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/b75f0503-2054-4186-ac6c-5afb1c167ab5`, newExecutor, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
              .then(projectTaskExecutor => {
                executors.push({ 'Items': [{ 'Name': 'Id', 'Value': projectTaskExecutor.data }] })
              })
              .catch(err => {
                return reject(err)
              })
          }
          //
          const mainExecutor = executors[0].Items[0]
          const coExecutors = executors.splice(0, 1)
          // 2. Create ControlUser in ProjectTaskExecutor
          await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/b75f0503-2054-4186-ac6c-5afb1c167ab5`, controlUserQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
            .then(async cc => {
              const oneItemQuery = {
                'Items': [
                  { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': 75145 }] }, 'Name': 'ProjectPlan' },
                  { 'Name': 'IndexNumber', 'Value': task.newId }, // task.wasdIndex
                  { 'Name': 'ItemType', 'Value': task.type === 'task' ? 0 : task.type === 'milestone' ? 2 : 0 }, //
                  { 'Name': 'Subject', 'Value': task.text },
                  // 00:00:10 23:59:50
                  { 'Name': 'StartDate', 'Value': moment(task.start_date).format('MM/DD/YYYY') + ' 00:00:10' },
                  { 'Name': 'EndDate', 'Value': moment(task.end_date).format('MM/DD/YYYY') + ' 23:59:50' },
                  // { 'Name': 'StartDate', 'Value': moment(task.start_date).format('MM/DD/YYYY hh:mm:ss') },
                  // { 'Name': 'EndDate', 'Value': moment(task.end_date).format('MM/DD/YYYY hh:mm:ss') },
                  { 'Name': 'PlanWorkLog', 'Value': task.duration * 60 },
                  { 'Data': { 'Items': [mainExecutor] }, 'Name': 'Executor' },
                  { 'DataArray': coExecutors, 'Name': 'InformTo' },
                  { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': 3132 }] }, 'Name': 'CreationAuthor' }, // CreationAuthor
                  { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': cc.data }] }, 'Name': 'ControlUser' }, // ControlUser
                  { 'Name': 'ControlType', 'Value': '1' },
                  { 'Name': 'UnderControl', 'Value': 'True' },
                  { 'Name': 'CompletePercent', 'Value': task.closed ? '100' : String(Math.round(task.PercentComplete * 100)) }
                ]
              }
              // 3. Create PlanItem
              await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/be46e72c-dc98-4aed-af48-17b0e13fb137`, oneItemQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
                .then(async newPlanTask => {
                  task.newPlanItems = newPlanTask.data
                  for (let ex = 0; ex < task.executor_id.length; ex++) {
                    // eslint-disable-next-line
                    const element = task.executor_id[ex]
                    const workForcesQuery = {
                      'Items': [
                        { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': newPlanTask.data }] }, 'Name': 'PlanItem' },
                        { 'Name': 'Percent', 'Value': '100' }, // передать значение загрузки ресурса
                        { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': 3132 }] }, 'Name': 'WorkForce' } // 'Value': element
                      ]
                    }
                    // 4. Create WorkForcePlanItem
                    await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/8b568e4d-504d-49a2-918e-4c16c696e507`, workForcesQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
                  }
                })
                .catch(err => {
                  return reject(err)
                })
            })
            .catch(err => {
              return reject(err)
            })
        }
      } else if (task.executor_id && task.executor_id.length === 1 && task.type !== 'project') { // Если один исполнитель
        const firstQuery = {
          'Items': [
            { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': 3132 }] }, 'Name': 'User' }, // 'Value': task.executor_id[0].resource_id
            { 'Name': 'Type', 'Value': '2' }
          ]
        }
        // 1. Create ProjectTaskExecutor
        await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/b75f0503-2054-4186-ac6c-5afb1c167ab5`, firstQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
          .then(async projectTaskExecutor => {
            // 2. Create ControlUser in ProjectTaskExecutor
            await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/b75f0503-2054-4186-ac6c-5afb1c167ab5`, controlUserQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
              .then(async ccc => {
                const oneItemQuery = {
                  'Items': [
                    { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': 75145 }] }, 'Name': 'ProjectPlan' },
                    { 'Name': 'IndexNumber', 'Value': task.newId }, // task.wasdIndex
                    { 'Name': 'ItemType', 'Value': task.type === 'task' ? 0 : task.type === 'milestone' ? 2 : 0 }, //
                    { 'Name': 'Subject', 'Value': task.text },
                    // 00:00:10 23:59:50
                    { 'Name': 'StartDate', 'Value': moment(task.start_date).format('MM/DD/YYYY') + ' 00:00:10' },
                    { 'Name': 'EndDate', 'Value': moment(task.end_date).format('MM/DD/YYYY') + ' 23:59:50' },
                    // { 'Name': 'StartDate', 'Value': moment(task.start_date).format('MM/DD/YYYY hh:mm:ss') },
                    // { 'Name': 'EndDate', 'Value': moment(task.end_date).format('MM/DD/YYYY hh:mm:ss') },
                    { 'Name': 'PlanWorkLog', 'Value': task.duration * 60 },
                    { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': projectTaskExecutor.data }] }, 'Name': 'Executor' },
                    { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': 3132 }] }, 'Name': 'CreationAuthor' }, // CreationAuthor
                    { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': ccc.data }] }, 'Name': 'ControlUser' }, // ControlUser
                    { 'Name': 'ControlType', 'Value': '1' },
                    { 'Name': 'UnderControl', 'Value': 'True' },
                    { 'Name': 'CompletePercent', 'Value': task.closed ? '100' : String(Math.round(task.PercentComplete * 100)) }
                  ]
                }
                // 3. Create PlanItem
                await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/be46e72c-dc98-4aed-af48-17b0e13fb137`, oneItemQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
                  .then(async newItem => {
                    task.newPlanItems = newItem.data
                    const workForceQuery = {
                      'Items': [
                        { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': newItem.data }] }, 'Name': 'PlanItem' },
                        { 'Name': 'Percent', 'Value': '100' }, // передать значение загрузки ресурса
                        { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': 3132 }] }, 'Name': 'WorkForce' } // 'Value': task.executor_id[e].resource_id
                      ]
                    }
                    // 4. Create WorkForcePlanItem
                    await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/8b568e4d-504d-49a2-918e-4c16c696e507`, workForceQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
                      .catch(err => {
                        return reject(err)
                      })
                  })
                  .catch(err => {
                    return reject(err)
                  })
              })
              .catch(err => {
                return reject(err)
              })
          })
          .catch(err => {
            return reject(err)
          })
      } else { // Если нет исполнителя
        const noExecutorItemQuery = {
          'Items': [
            { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': 75145 }] }, 'Name': 'ProjectPlan' },
            { 'Name': 'IndexNumber', 'Value': task.newId }, // task.wasdIndex
            { 'Name': 'ItemType', 'Value': task.type === 'project' ? 1 : task.type === 'task' ? 0 : task.type === 'milestone' ? 2 : task.type === 'phase' ? 1 : 0 }, //
            { 'Name': 'Subject', 'Value': task.text },
            // 00:00:10 23:59:50
            { 'Name': 'StartDate', 'Value': moment(task.start_date).format('MM/DD/YYYY') + ' 00:00:10' },
            { 'Name': 'EndDate', 'Value': moment(task.end_date).format('MM/DD/YYYY') + ' 23:59:50' },
            // { 'Name': 'StartDate', 'Value': moment(task.start_date).format('MM/DD/YYYY hh:mm:ss') },
            // { 'Name': 'EndDate', 'Value': moment(task.end_date).format('MM/DD/YYYY hh:mm:ss') },
            // { 'Name': 'PlanWorkLog', 'Value': task.duration * 60 },
            { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': 3132 }] }, 'Name': 'CreationAuthor' }, // CreationAuthor
            // ControlUser
            // { 'Name': 'ControlType', 'Value': '1' },
            // { 'Name': 'UnderControl', 'Value': 'True' },
            { 'Name': 'CompletePercent', 'Value': task.closed ? '100' : String(Math.round(task.PercentComplete * 100)) }
          ]
        }
        // 1. Create PlanItem
        await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/be46e72c-dc98-4aed-af48-17b0e13fb137`, noExecutorItemQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
          .then(noExecutorItem => {
            task.newPlanItems = noExecutorItem.data
          })
          .catch(err => {
            return reject(err)
          })
      }
      //
      // task.imported = true
      return resolve(true)
    // }, 0)
    } catch (error) {
      return reject(error)
    }
  })
}
//
function setParent (task, token, parent) {
  return new Promise(async (resolve, reject) => {
    try {
      if (parent) {
        if (Array.isArray(task.newPlanItems)) {
          for (let i = 0; i < task.newPlanItems.length; i++) {
            const el = task.newPlanItems[i]
            const multipleParentQuery = { 'Items': [{ 'Data': { 'Items': [{ 'Name': 'Id', 'Value': parent.newPlanItems }] }, 'Name': 'Parent' }, { 'Name': 'IndexNumber', 'Value': task.newId }] }
            await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Update/be46e72c-dc98-4aed-af48-17b0e13fb137/${el}`, multipleParentQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
              .catch(err => {
                return reject(err)
              })
          }
        } else {
          const parentQuery = { 'Items': [{ 'Data': { 'Items': [{ 'Name': 'Id', 'Value': parent.newPlanItems }] }, 'Name': 'Parent' }, { 'Name': 'IndexNumber', 'Value': task.newId }] }
          await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Update/be46e72c-dc98-4aed-af48-17b0e13fb137/${task.newPlanItems}`, parentQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
            .catch(err => {
              return reject(err)
            })
        }
        // /Update/{typeuid}/{entityid}
      }
      task.imported = true
      return resolve(true)
    } catch (error) {
      return reject(error)
    }
  })
}
//
function setLinks (task, token, links, tasks) {
  return new Promise(async (resolve, reject) => {
    try {
      let predecessors = links.filter(f => Number(f.target) === task.id)
      if (Array.isArray(task.newPlanItems)) {
        for (let i = 0; i < task.newPlanItems.length; i++) {
          for (let p = 0; p < predecessors.length; p++) {
            const l = predecessors[p]
            let linkTask = tasks.find(f => f.id === Number(l.source))
            if (linkTask) {
              if (Array.isArray(linkTask.newPlanItems)) {
                for (let li = 0; li < linkTask.newPlanItems.length; li++) {
                  const multipleLinkQuery = {
                    'Items': [
                      { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': task.newPlanItems[i] }] }, 'Name': 'OrderItem' },
                      { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': linkTask.newPlanItems[li] }] }, 'Name': 'PreviousItem' },
                      { 'Name': 'Lag', 'Value': l.lag / 8 },
                      { 'Name': 'LinkType', 'Value': l.type },
                      { 'Name': 'LagFormat', 'Value': '2' },
                      { 'Name': 'ScheduleMode', 'Value': '1' }
                    ]
                  }
                  // console.log(multipleLinkQuery)
                  await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/dc6bb364-395a-4104-97f0-cf377996ab20`, multipleLinkQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
                    .catch(err => {
                      reject(err)
                    })
                }
              } else {
                const multipleLinkQuery = {
                  'Items': [
                    { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': task.newPlanItems[i] }] }, 'Name': 'OrderItem' },
                    { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': linkTask.newPlanItems }] }, 'Name': 'PreviousItem' },
                    { 'Name': 'Lag', 'Value': l.lag / 8 },
                    { 'Name': 'LinkType', 'Value': l.type },
                    { 'Name': 'LagFormat', 'Value': '2' },
                    { 'Name': 'ScheduleMode', 'Value': '1' }
                  ]
                }
                // console.log(multipleLinkQuery)
                await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/dc6bb364-395a-4104-97f0-cf377996ab20`, multipleLinkQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
                  .catch(err => {
                    reject(err)
                  })
              }
            }
          }
        }
      } else {
        for (let p = 0; p < predecessors.length; p++) {
          const l = predecessors[p]
          let linkTask = tasks.find(f => f.id === Number(l.source))
          if (linkTask) {
            if (Array.isArray(linkTask.newPlanItems)) {
              for (let li = 0; li < linkTask.newPlanItems.length; li++) {
                const linkQuery = {
                  'Items': [
                    { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': task.newPlanItems }] }, 'Name': 'OrderItem' },
                    { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': linkTask.newPlanItems[li] }] }, 'Name': 'PreviousItem' },
                    { 'Name': 'Lag', 'Value': l.lag / 8 },
                    { 'Name': 'LinkType', 'Value': l.type },
                    { 'Name': 'LagFormat', 'Value': '2' },
                    { 'Name': 'ScheduleMode', 'Value': '1' }
                  ]
                }
                // console.log(linkQuery)
                await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/dc6bb364-395a-4104-97f0-cf377996ab20`, linkQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
                  .catch(err => {
                    reject(err)
                  })
              }
            } else {
              const linkQuery = {
                'Items': [
                  { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': task.newPlanItems }] }, 'Name': 'OrderItem' },
                  { 'Data': { 'Items': [{ 'Name': 'Id', 'Value': linkTask.newPlanItems }] }, 'Name': 'PreviousItem' },
                  { 'Name': 'Lag', 'Value': l.lag / 8 },
                  { 'Name': 'LinkType', 'Value': l.type },
                  { 'Name': 'LagFormat', 'Value': '2' },
                  { 'Name': 'ScheduleMode', 'Value': '1' }
                ]
              }
              // console.log(linkQuery)
              await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.wasd_WEB_API}API/REST/Entity/Insert/dc6bb364-395a-4104-97f0-cf377996ab20`, linkQuery, { headers: { 'Content-Type': 'application/json', 'AuthToken': token } }) // wasd_API - вернуть после отладки
                .catch(err => {
                  reject(err)
                })
            }
          }
        }
      }
      return resolve(true)
    } catch (error) {
      return reject(error)
    }
  })
}
//
function createItems (tasks, token, splitTasks) {
  return new Promise(async (resolve, reject) => {
    try {
      tasks.sort((a, b) => a.newId - b.newId)
      for (let i = 0; i < tasks.length; i++) {
        await createPlanItem(tasks[i], token, splitTasks)
          .then(ok => {
            if (i === tasks.length - 1) {
              store.dispatch('setImportCount', 0)
            } else {
              store.dispatch('setImportCount', i + 1)
            }
          },
          err => {
            console.log(`Ошибка записи задачи ${tasks[i].newId} - ${tasks[i].text}`, err)
            store.dispatch('setError', `Ошибка записи задачи ${tasks[i].newId} - ${tasks[i].text}`)
          })
      }
      return resolve(true)
    } catch (error) {
      return reject(error)
    }
  })
}
//
function createParents (tasks, token) {
  return new Promise(async (resolve, reject) => {
    try {
      for (let t = 0; t < tasks.length; t++) {
        let parent = tasks.find(f => f.id === Number(tasks[t].parent))
        await setParent(tasks[t], token, parent)
          .then(async ok => {
            //
          },
          err => {
            console.log(`Ошибка записи родителя задачи ${tasks[t].id} - ${tasks[t].text} .`, err)
            store.dispatch('setError', `Ошибка записи родителя задачи ${tasks[t].id} - ${tasks[t].text} .`)
          })
        if (t === tasks.length - 1) {
          store.dispatch('setImportCount', 0)
        } else {
          store.dispatch('setImportCount', t + 1)
        }
      }
      return resolve(true)
    } catch (error) {
      return reject(error)
    }
  })
}
//
function createLinks (tasks, token, links) {
  return new Promise(async (resolve, reject) => {
    try {
      for (let t = 0; t < tasks.length; t++) {
        await setLinks(tasks[t], token, links, tasks)
          .then(done => {
            //
          },
          err => {
            console.log(`Ошибка создания связей задачи ${tasks[t].id} - ${tasks[t].text} .`, err)
            store.dispatch('setError', `Ошибка создания связей задачи ${tasks[t].id} - ${tasks[t].text} .`)
          })
        store.dispatch('setImportCount', t + 1)
        if (t === tasks.length - 1) {
          store.dispatch('setSuccess', 'План проекта успешно сохранен.')
        }
      }
      return resolve(true)
    } catch (error) {
      return reject(error)
    }
  })
}

export default {
  // beginImport (tasks, splitTasks, links) {
  //   axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/api/v2/wasd/createplanitems`, { tasks, splitTasks, links })
  //     .then(resp => {
  //       console.log('beginImport', resp.data)
  //       if (resp.status === 200) {
  //         store.dispatch('setImportCount', 0)
  //         store.dispatch('setLoading', false)
  //         store.dispatch('setReadyForImport', true)
  //         store.dispatch('setSuccess', 'План проекта успешно сохранен.')
  //       } else if (resp.status === 500) {
  //         store.dispatch('setImportCount', 0)
  //         store.dispatch('setLoading', false)
  //         store.dispatch('setReadyForImport', true)
  //         store.dispatch('setError', 'Ошибка связи с сервером. Повторите попытку или обратитесь к администратору.')
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       store.dispatch('setImportCount', 0)
  //       store.dispatch('setLoading', false)
  //       store.dispatch('setReadyForImport', true)
  //       store.dispatch('setError', 'Ошибка связи с сервером. Повторите попытку или обратитесь к администратору.')
  //     })
  // }
  beginImport (tasks, splitTasks, links) {
    const startLoading = Date.now()
    tasks.sort((a, b) => a.newId - b.newId)
    checkToken(store.getters.token)
      .then(async token => {
        if (token) {
          createItems(tasks, token, splitTasks)
            .then(item => {
              if (item) { // если все задачи записаны
                createParents(tasks, token)
                  .then(parent => {
                    if (parent) {
                      createLinks(tasks, token, links)
                        .then(link => {
                          if (link) {
                            const endLoading = Date.now()
                            store.dispatch('setImportCount', 0)
                            store.dispatch('setLoading', false)
                            store.dispatch('setReadyForImport', true)
                            store.dispatch('setSuccess', 'План проекта успешно сохранен.')
                            console.log('Время записи: ' + (endLoading - startLoading) / 1000)
                          } else {
                            store.dispatch('setImportCount', 0)
                            store.dispatch('setLoading', false)
                            store.dispatch('setReadyForImport', true)
                            store.dispatch('setError', 'Ошибка создания связей. Повторите попытку или обратитесь к администратору.')
                            console.log('Ошибка создания связей')
                          }
                        },
                        err => {
                          store.dispatch('setImportCount', 0)
                          store.dispatch('setLoading', false)
                          store.dispatch('setReadyForImport', true)
                          store.dispatch('setError', 'Ошибка создания связей. Повторите попытку или обратитесь к администратору.')
                          console.log('Ошибка создания связей', err)
                        })
                    } else {
                      store.dispatch('setImportCount', 0)
                      store.dispatch('setLoading', false)
                      store.dispatch('setReadyForImport', true)
                      store.dispatch('setError', 'Ошибка создания связей. Повторите попытку или обратитесь к администратору.')
                      console.log('Ошибка записи родителя')
                    }
                  },
                  err => {
                    store.dispatch('setImportCount', 0)
                    store.dispatch('setLoading', false)
                    store.dispatch('setReadyForImport', true)
                    store.dispatch('setError', 'Ошибка записи родителя. Повторите попытку или обратитесь к администратору.')
                    console.log('Ошибка записи родителя', err)
                  })
              } else {
                store.dispatch('setImportCount', 0)
                store.dispatch('setLoading', false)
                store.dispatch('setReadyForImport', true)
                store.dispatch('setError', 'Ошибка создания задач. Повторите попытку или обратитесь к администратору.')
                console.log('Ошибка создания задач')
              }
            },
            err => {
              store.dispatch('setImportCount', 0)
              store.dispatch('setLoading', false)
              store.dispatch('setReadyForImport', true)
              store.dispatch('setError', 'Ошибка создания задач. Повторите попытку или обратитесь к администратору.')
              console.log('Ошибка создания задач', err)
            })
        } else {
          store.dispatch('setImportCount', 0)
          store.dispatch('setLoading', false)
          store.dispatch('setReadyForImport', true)
          store.dispatch('setError', 'Ошибка связи с сервером. Повторите попытку или обратитесь к администратору.')
        }
        // tasks.sort((a, b) => a.newId - b.newId)
        // for (let i = 0; i < tasks.length; i++) {
        //   await createPlanItem(tasks[i], token, splitTasks)
        //     .then(ok => {
        //       if (i === tasks.length - 1) {
        //         store.dispatch('setImportCount', 0)
        //       } else {
        //         store.dispatch('setImportCount', i + 1)
        //       }
        //     },
        //     err => {
        //       console.log(i + 1, err)
        //       store.dispatch('setError', `Ошибка записи задачи ${tasks[i].id} - ${tasks[i].text} .`)
        //     })
        // }
        // запись родителя
        // for (let t = 0; t < tasks.length; t++) {
        //   let parent = tasks.find(f => f.id === Number(tasks[t].parent))
        //   await setParent(tasks[t], token, parent)
        //     .then(async ok => {
        //       //
        //     },
        //     err => {
        //       console.log(`Ошибка записи родителя задачи ${tasks[t].id} - ${tasks[t].text} .`, err)
        //       store.dispatch('setError', `Ошибка записи родителя задачи ${tasks[t].id} - ${tasks[t].text} .`)
        //     })
        //   if (t === tasks.length - 1) {
        //     store.dispatch('setImportCount', 0)
        //   } else {
        //     store.dispatch('setImportCount', t + 1)
        //   }
        // }
        // создание связей
        // for (let t = 0; t < tasks.length; t++) {
        //   await setLinks(tasks[t], token, links, tasks)
        //     .then(done => {
        //       //
        //     },
        //     err => {
        //       console.log(`Ошибка создания связей задачи ${tasks[t].id} - ${tasks[t].text} .`, err)
        //       store.dispatch('setError', `Ошибка создания связей задачи ${tasks[t].id} - ${tasks[t].text} .`)
        //     })
        //   store.dispatch('setImportCount', t + 1)
        //   if (t === tasks.length - 1) {
        //     store.dispatch('setSuccess', 'План проекта успешно сохранен.')
        //   }
        // }
      },
      error => {
        store.dispatch('setImportCount', 0)
        store.dispatch('setLoading', false)
        store.dispatch('setReadyForImport', true)
        store.dispatch('setError', 'Ошибка связи с сервером. Повторите попытку или обратитесь к администратору.')
        console.log(error)
      })
  },
  async beginImportSQL (tasks, links, plan) {
    return new Promise(async (resolve, reject) => {
      const startLoading = Date.now()
      try {
        // http://localhost:3000/api/v2/sql/createplanitems // ${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/api/v2/sql/createplanitems
        await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/api/v2/sql/createplanitems`, { tasks, links, plan }) // ${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/api/v2/sql/createplanitems
          .then(resp => {
            console.log(resp.data)
            const endLoading = Date.now()
            console.log('Время записи: ' + (endLoading - startLoading) / 1000)
            // store.dispatch('setSuccess', 'План проекта успешно сохранен.')
            // store.dispatch('setImportCount', 0)
            // store.dispatch('setLoading', false)
            // store.dispatch('setReadyForImport', true)
            return resolve(true)
          })
          .catch(err => {
            console.error(err)
            // store.dispatch('setImportCount', 0)
            // store.dispatch('setLoading', false)
            // store.dispatch('setReadyForImport', true)
            // store.dispatch('setError', 'Ошибка связи с сервером. Повторите попытку или обратитесь к администратору.')
            return reject(err)
          })
      } catch (error) {
        return reject(error)
      }
    })
  },
  async getJsonUrl (data) {
    return new Promise(async (resolve, reject) => {
      try {
        await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/api/v2/createjson`, { data })
          .then(resp => {
            return resolve(resp.data)
          })
          .catch(err => {
            return reject(err)
          })
      } catch (error) {
        return reject(error)
      }
    })
  },

  async runProcess (data) {
    return new Promise(async (resolve, reject) => {
      try {
        var xml = `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
          <soap12:Body>
            <Run xmlns="http://www.wasd-bpm.ru/WFPWebService/">
              <userName>admin</userName>
              <password>SuperHero</password>
              <token>b2d6c56c-4623-4985-8a67-86d299706314</token>
              <instanceName>Тестовый запуск импорта SOAP</instanceName>
              <data>
                <Items>
                  <WebDataItem>
                    <Name>File</Name>
                    <Value>${data.file}</Value>
                  </WebDataItem>
                  <WebDataItem>
                    <Name>UserLogin</Name>
                    <Value>${data.login}</Value>
                  </WebDataItem>
                </Items>
              </data>
            </Run>
          </soap12:Body>
        </soap12:Envelope>`
        await axios.post(`${config.useProxy ? config.proxyAddress : ''}http://10.175.180.201/Modules/wasd.wasd.Workflow.Processes.Web/WFPWebService.asmx`, xml,
          { headers: { 'Content-Type': 'application/soap+xml;charset=utf-8' } })
          .then(resp => {
            return resolve(resp.data)
          })
          .catch(err => {
            if (err.response) {
              return reject(err.response.data)
            } else {
              return reject(err)
            }
          })
      } catch (error) {
        return reject(error)
      }
    })
  },
  async checkProcess (data) {
    return new Promise(async (resolve, reject) => {
      try {
        var xml = `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
          <soap12:Body>
            <GetStatus xmlns="http://www.wasd-bpm.ru/WFPWebService/">
              <userName>admin</userName>
              <password>SuperHero</password>
              <instanceId>${data}</instanceId>
            </GetStatus>
          </soap12:Body>
        </soap12:Envelope>`
        await axios.post(`${config.useProxy ? config.proxyAddress : ''}http://10.175.180.201/Modules/wasd.wasd.Workflow.Processes.Web/WFPWebService.asmx`, xml,
          { headers: { 'Content-Type': 'application/soap+xml;charset=utf-8' } })
          .then(resp => {
            return resolve(resp.data)
          })
          .catch(err => {
            if (err.response) {
              return reject(err.response.data)
            } else {
              return reject(err)
            }
          })
      } catch (error) {
        return reject(error)
      }
    })
  }
}
