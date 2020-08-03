import moment from 'moment'
import config from './config'
import axios from 'axios'

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
      const resp = await axios.get(`${config.useProxy ? config.proxyAddress : ''}${config.API_ADDRESS}/alluserselma/${config.SERVER}`)
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
  }
}
