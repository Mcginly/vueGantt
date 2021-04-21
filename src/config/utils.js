import moment from 'moment'
import config from './config'
import axios from 'axios'
import store from '../store'

moment.updateLocale('ru', { week: {
  dow: 1
} })
moment.updateLocale('en', { week: {
  dow: 1
} })

export default {
  getPeriodFormat (val) {
    switch (val) {
      case 0:
        return { begin: moment().startOf('week').format('YYYY-MM-DD'), end: moment().endOf('week').format('YYYY-MM-DD') }
      case 1:
        return { begin: moment().startOf('week').subtract(1, 'week').format('YYYY-MM-DD'), end: moment().endOf('week').subtract(1, 'week').format('YYYY-MM-DD') }
      case 2:
        return { begin: moment().startOf('month').format('YYYY-MM-DD'), end: moment().endOf('month').format('YYYY-MM-DD') }
      case 3:
        return { begin: moment().startOf('month').subtract(1, 'month').startOf('month').format('YYYY-MM-DD'), end: moment().endOf('month').subtract(1, 'month').endOf('month').format('YYYY-MM-DD') }
      case 4:
        return { begin: moment().startOf('year').format('YYYY-MM-DD'), end: moment().endOf('year').format('YYYY-MM-DD') }
      case 5:
        return { begin: moment().startOf('year').subtract(1, 'year').startOf('year').format('YYYY-MM-DD'), end: moment().endOf('year').subtract(1, 'year').endOf('year').format('YYYY-MM-DD') }
      default:
        return { begin: moment().startOf('week').format('YYYY-MM-DD'), end: moment().endOf('week').format('YYYY-MM-DD') }
    }
  },
  labelDataFormat (obj) {
    return { begin: moment(obj.begin).format('DD.MM.YYYY'), end: moment(obj.end).format('DD.MM.YYYY') }
  },
  singleDateFormatForQuery (date) {
    return moment(date).format('YYYY-MM-DD')
  },
  toggleFullScreen () {
    let doc = window.document
    let docEl = doc.documentElement
    let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen
    let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl)
    } else {
      cancelFullScreen.call(doc)
    }
  },
  async getProjects () {
    try {
      const query = {
        srv: config.SERVER
      }
      const resp = await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/api/v2/tasks/projects`, query)
      return resp.data
    } catch (error) {
      return null
    }
  },
  async getUsersSQL () {
    try {
      const resp = await axios.get(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/alluserswasd/${config.SERVER}`)
      return resp.data
    } catch (error) {
      console.log(error)
      return null
    }
  },
  async getTestDates (plan) {
    return axios.get(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}${config.API_TEST_DATES}${plan}`).then(resp => {
      return resp.data
    }).catch(err => {
      return err
    })
  },
  async getProdResources (plan) {
    return axios.get(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}${config.PROD_RES}${plan}`).then(resp => {
      return resp.data
    }).catch(err => {
      return err
    })
  },
  async getGlobalShedule () {
    try {
      const query = {
        srv: config.SERVER
      }
      const resp = await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}${config.GLOBAL_SHEDULE}`, query)
      return resp.data
    } catch (error) {
      return null
    }
  },
  async getGlobalExceptionShedule () {
    try {
      const query = {
        srv: config.SERVER
      }
      const resp = await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}${config.GLOBAL_EXCEPTION_SHEDULE}`, query)
      return resp.data
    } catch (error) {
      return null
    }
  },
  async getResources (plan) {
    try {
      const query = {
        srv: config.SERVER,
        plan: plan
      }
      const resp = await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}${config.RESOURCES}`, query)
      return resp.data
    } catch (error) {
      return null
    }
  },
  async getWorkloadPortfolio () {
    try {
      const query = {
        srv: config.SERVER
      }
      const resp = await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}${config.WORKLOAD}`, query)
      return resp.data
    } catch (error) {
      return null
    }
  },
  async getForRequirementsDataPack () {
    try {
      const resp = await axios.get(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/api/v2/reports/prepared/forrequirements/${config.SERVER}`)
      return resp.data.data
    } catch (error) {
      console.log(error)
      return null
    }
  },
  getFlatDataTable (sourceData) {
    var flatTable = {
      CRDO: 0,
      RCDO: 0,
      REDO: 0,
      ERDO: 0,
      CRA: 0,
      CRD: 0,
      CRN: 0,
      CRC: 0,
      RCA: 0,
      RCD: 0,
      RCN: 0,
      RCC: 0,
      REA: 0,
      RED: 0,
      REN: 0,
      REC: 0,
      ERA: 0,
      ERD: 0,
      ERN: 0,
      ERC: 0
    }
    sourceData.forEach(item => {
      // console.log('item: ', item)
      if (item.IsProfitable && item.Status === 3 && item.Delay > 0 && item.RequirementExecutorName !== 'WASD') {
        flatTable.CRDO++
      }
      if (item.IsProfitable && item.Status === 3 && item.Delay > 0 && item.RequirementExecutorName === 'WASD') {
        flatTable.RCDO++
      }
      if (!item.IsProfitable && item.Status === 3 && item.Delay > 0 && item.RequirementExecutorName === 'WASD') {
        flatTable.REDO++
      }
      if (!item.IsProfitable && item.Status === 3 && item.Delay > 0 && item.RequirementExecutorName !== 'WASD') {
        flatTable.ERDO++
      }
      if (item.IsProfitable && (item.Status !== 8 || item.Status !== 9) && item.RequirementExecutorName !== 'WASD') {
        flatTable.CRA++
      }
      if (item.IsProfitable && item.Status === 3 && item.RequirementExecutorName !== 'WASD') {
        flatTable.CRD++
      }
      if (item.IsProfitable && (item.Status === 5 || item.Status === 6) && item.RequirementExecutorName !== 'WASD') {
        flatTable.CRN++
      }
      if ((item.IsProfitable && item.Status === 6 && item.RequirementExecutorName !== 'WASD') || (item.IsProfitable && item.Status === 5 && item.IsPenaltiesApplied && item.RequirementExecutorName !== 'WASD')) {
        flatTable.CRC++
      }
      if (item.IsProfitable && (item.Status !== 8 || item.Status !== 9) && item.RequirementExecutorName === 'WASD') {
        flatTable.RCA++
      }
      if (item.IsProfitable && item.Status === 3 && item.RequirementExecutorName === 'WASD') {
        flatTable.RCD++
      }
      if (item.IsProfitable && (item.Status === 5 || item.Status === 6) && item.RequirementExecutorName === 'WASD') {
        flatTable.RCN++
      }
      if ((item.IsProfitable && item.Status === 6 && item.RequirementExecutorName === 'WASD') || (item.IsProfitable && item.Status === 5 && item.IsPenaltiesApplied && item.RequirementExecutorName === 'WASD')) {
        flatTable.RCC++
      }
      if (!item.IsProfitable && (item.Status !== 8 || item.Status !== 9) && item.RequirementExecutorName === 'WASD') {
        flatTable.REA++
      }
      if (!item.IsProfitable && item.Status === 3 && item.RequirementExecutorName === 'WASD') {
        flatTable.RED++
      }
      if (!item.IsProfitable && (item.Status === 5 || item.Status === 6) && item.RequirementExecutorName === 'WASD') {
        flatTable.REN++
      }
      if ((!item.IsProfitable && item.Status === 6 && item.RequirementExecutorName === 'WASD') || (!item.IsProfitable && item.Status === 5 && item.IsPenaltiesApplied && item.RequirementExecutorName === 'WASD')) {
        flatTable.REC++
      }
      if (!item.IsProfitable && (item.Status !== 8 || item.Status !== 9) && item.RequirementExecutorName !== 'WASD') {
        flatTable.ERA++
      }
      if (!item.IsProfitable && item.Status === 3 && item.RequirementExecutorName !== 'WASD') {
        flatTable.ERD++
      }
      if (!item.IsProfitable && (item.Status === 5 || item.Status === 6) && item.RequirementExecutorName !== 'WASD') {
        flatTable.ERN++
      }
      if ((!item.IsProfitable && item.Status === 6 && item.RequirementExecutorName !== 'WASD') || (!item.IsProfitable && item.Status === 5 && item.IsPenaltiesApplied && item.RequirementExecutorName !== 'WASD')) {
        flatTable.ERC++
      }
    })
    store.dispatch('setFlatTable', flatTable)
  },
  async getReportRequirementsData (query) {
    try { //    /api/v2/reports/requirements
      let newDate = null
      if (query.date) {
        const [year, month, day] = new Date(query.date).toISOString().substr(0, 10).split('-')
        var dateStr = `${year}-${month}-${day}`
        newDate = dateStr
      }
      const apiQuery = {
        ProjectOffice: query.projectOffice,
        Project: query.project && query.project.length > 0 ? query.project.join(', ') : '0',
        IsNotDeadline: query.isNotDeadline,
        Date: newDate,
        ContractType: query.contractType,
        ProfitableContractor: query.profitableContractor,
        AccountContractor: query.accountContractor,
        ProfitableContract: query.contractType === 0 || query.contractType === 1 ? null : query.profitableContract,
        AccountContract: query.contractType === 0 || query.contractType === 2 ? null : query.accountContract,
        ContractCurator: query.contractCurator,
        Responsible: query.responsible
      }
      console.log('apiQuery', apiQuery)
      const resp = await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}${config.API_GET_REPORT}`, apiQuery)
      // console.log('getData', resp)
      return resp.data
    } catch (error) {
      return null
    }
  },
  async insertGanttPlan (plan) {
    try {
      const resp = await axios.post(`${config.useProxy ? config.proxyAddress : ''}http://localhost:3000/api/v2/mongo/test`, plan)
      return resp.data
    } catch (error) {
      return null
    }
  },
  async getGanttPlan (plan) {
    try {
      const resp = await axios.get(`${config.useProxy ? config.proxyAddress : ''}http://localhost:3000/api/v2/mongo/test/${plan}`)
      return resp.data
    } catch (error) {
      return null
    }
  },
  async getWikiCategories () {
    try {
      const resp = await axios.get(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/api/v2/pg/wiki/categories`)
      return resp.data
    } catch (error) {
      return null
    }
  },
  async getWikiArticles (data) {
    try {
      const resp = await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/api/v2/pg/wiki/articles`, data)
      return resp.data
    } catch (error) {
      return null
    }
  },
  async insertWikiAny (data) {
    try {
      const resp = await axios.post(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/api/v2/pg/wiki/new`, data)
      return resp.data
    } catch (error) {
      return null
    }
  }
}
