module.exports = {
  proxyAddress: 'http://10.175.180.201:8888/',
  useProxy: true,
  SERVER: 'prod',
  IMPORT_SERVER: 'http://10.175.180.200:9099/',
  EXPORT_SERVER: 'http://10.175.180.201:8192',
  API_ADDRESS: 'http://10.175.180.201:3000',
  API_LOCAL_ADDRESS: 'http://localhost:3000',
  API_GET_PORTFOLIO: '/projectportfolio',
  wasd_API: 'http://10.175.180.201/',
  wasd_WEB_API: 'http://10.175.180.200/', // dev для отладки импорта планов
  wasd_NEW_PLAN: 'API/REST/Entity/Insert/9255a063-d9a2-4f10-abe5-1b7bdeef9013', // POST,
  wasd_API_TOKEN: '233E3D503480BFAC32839C50BF31E98D08833BAF2FCE888529137527CD09CC9696D840F3FEA3F84B03B6F4C81F2001CF4DBE005CB13AF0C65AD6FD90C1B2387B',
  wasd_WEB_API_TOKEN: 'D635093DB1FC6B5F259AD945BFE6081C6E763EAB6E48F42375AA46F3C4617DFC0EC845AC257F902FAE3225897E13745EEB406CF3E0548D2206C15FCDA965BAB0', // dev
  wasd_AUTH_PATH: 'API/REST/Authorization/LoginWith?username=',
  wasd_CHECK_TOKEN: 'API/REST/Authorization/CheckToken?token=',
  wasd_AUTH_USER: 'admin',
  wasd_AUTH_PASS: '"SuperHero"',
  LDAP_AUTH: '/ldaplogon',
  API_TEST_DATES: '/prod/dates/',
  PROD_RES: '/proddata/resources/',
  GLOBAL_SHEDULE: '/api/v2/shedule/global',
  GLOBAL_EXCEPTION_SHEDULE: '/api/v2/shedule/exceptionglobal',
  RESOURCES: '/api/v2/resources',
  PLAN: '/api/v2/project/plan',
  WORKLOAD: '/api/v2/workload/portfolio',
  API_GET_REPORT: '/api/v2/reports/requirements/'
}
// https://dhtmlx.com/clients/ info@wasd.ru 20250663
