import store from '../store'

export default function (to, from, next) {
  const planId = to.params.plan_id
  // const currUser = store.getters.user
  if (to.path === '/') {
    store.dispatch('setPageHeader', '')
    store.dispatch('setShowToolbar', false)
  }
  if (to.name === 'plan') {
    store.dispatch('setShowToolbar', true)
  }
  function checkCookie (name) {
    var matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([[\].$?*|{}[\]([\])[\][\]\\[\]/[\]+^])/g, '\\$1') + '=([^;]*)'))
    return matches ? decodeURIComponent(matches[1]) : undefined
  }
  function setPlanName (plan) {
    console.log('setPlanName', plan)
    if (plan) {
      const project = store.getters.projects.find(f => f.CurrentPlan === plan)
      if (project) {
        // store.dispatch('setShowToolbar', true)
        store.dispatch('setPageHeader', project.Name)
      }
    } else {
      store.dispatch('setShowToolbar', false)
      store.dispatch('setPageHeader', '')
    }
  }
  // if (currUser) {
  if (checkCookie('user_id') !== undefined) {
    store.dispatch('setUser', checkCookie('user_id'))
    // console.log(store.getters.projects)
    setTimeout(() => {
      setPlanName(planId)
    }, 1000)
    next()
  } else {
    setTimeout(() => {
      const cUser = store.getters.user
      if (cUser) {
        // console.log(store.getters.projects)
        setTimeout(() => {
          setPlanName(planId)
        }, 1000)
        next()
      } else {
        store.dispatch('setPageHeader', '')
        store.dispatch('setShowToolbar', false)
        next('/login?loginError')
      }
    }, 1500)
  }
}
