import store from '../store'
import utils from '../config/utils'

export default function (to, from, next) {
  const planId = to.params.plan_id
  if (to.path === '/' || to.name === 'history' || to.name === 'portfolio') {
    store.dispatch('setPageHeader', '')
    store.dispatch('setShowToolbar', false)
  }
  if (to.name === 'plan') {
    store.dispatch('setShowToolbar', true)
  }
  if (to.name === 'requirements') {
    utils.getForRequirementsDataPack()
      .then(r => {
        store.dispatch('setAccountContractData', r.accounts)
        store.dispatch('setProfitableContractData', r.profitables)
        store.dispatch('setAllContractors', r.contractors)
        store.dispatch('setProjectOfficeData', r.offices)
      })
    store.dispatch('setPageHeader', 'Отчет по обязательствам')
    document.title = 'Отчет по обязательствам'
    store.dispatch('setShowToolbar', false)
  }
  if (to.name === 'kanban') {
    store.dispatch('setShowToolbar', false)
    store.dispatch('setPageHeader', 'Доска задач')
  }
  if (to.name === 'wiki') {
    if (to.query['page'] && to.query['items']) {
      store.dispatch('setWikiPage', Number(to.query['page']))
      store.dispatch('setWikiItemsPerPage', Number(to.query['items']))
      console.log(to.query)
    } else {
      store.dispatch('setWikiPage', 1)
      store.dispatch('setWikiItemsPerPage', 8)
    }
    store.dispatch('setPageHeader', 'База знаний WASD')
    document.title = 'База знаний WASD'
    store.dispatch('setShowToolbar', true)
  }
  if (to.name === 'article' || to.name === 'editarticle') {
    const articleId = to.params.article_id
    if (articleId) {
      const text = `SELECT id::INTEGER, category::INTEGER, name, description, icon, color, creator::INTEGER, updater::INTEGER, "dateCreated"::VARCHAR, "dateUpdated"::VARCHAR, false as hover FROM public.articles
      where id = $1;`
      const values = [articleId]
      utils.getWikiArticles({ text, values })
        .then(r => {
          if (r.data && r.data.length > 0) {
            store.dispatch('setWikiCurrentArticle', r.data[0])
            utils.getWikiCategories()
              .then(с => {
                store.dispatch('setWikiCategories', с.data)
                store.dispatch('setWikiFlatCategories', с.flat)
                const category = с.flat.find(f => f.id === r.data[0].category).name
                store.dispatch('setPageHeader', `${r.data[0].name} - ${category}`)
                document.title = `${r.data[0].name} - ${category}`
              })
              .catch(e => console.log(e))
            console.log(r.data[0])
          } else {
            store.dispatch('setWikiCurrentArticle', null)
          }
        })
        .catch(e => console.log(e))
      //
    }
  }
  function checkCookie (name) {
    var matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([[\].$?*|{}[\]([\])[\][\]\\[\]/[\]+^])/g, '\\$1') + '=([^;]*)'))
    return matches ? decodeURIComponent(matches[1]) : undefined
  }
  function setPlanName () {
    if (planId) {
      const project = store.getters.projects.find(f => f.CurrentPlan === planId)
      if (project) {
        let currentPlan = ''
        if (project.PlanObject) {
          currentPlan = `<a href='http://${window.location.hostname}/Projects/ProjectPlan/View/${project.CurrentPlan}' target='_blank' class='caption' style='color: #757575; text-decoration: none;'>(${JSON.parse(project.PlanObject).Name})</a>`
        }
        let mainHeader = `<a href='http://${window.location.hostname}/Projects/Project/AllInfo/${project.Id}' target='_blank' style='color: #616161; text-decoration: none;'>${project.Name}</a>`
        store.dispatch('setPageHeader', `${mainHeader} ${currentPlan}`)
        document.title = 'План проекта ' + project.Name
        store.dispatch('setProject', project)
      }
    } else {
      store.dispatch('setShowToolbar', false)
      store.dispatch('setPageHeader', '')
      document.title = 'WASD КСП'
      store.dispatch('setProject', null)
    }
  }
  if (checkCookie('user_id') !== undefined) {
    const user = checkCookie('user_id')
    store.dispatch('setUser', user)
    if (from.name === 'login') {
      setTimeout(async () => {
        if (planId) {
          const projects = await utils.getProjects()
          store.dispatch('setProjects', projects.data)
          setPlanName()
        }
      }, 1000)
      if (store.getters.fromPath) {
        window.location.href = store.getters.fromPath
      } else {
        next()
      }
      store.dispatch('setFromPath', null)
    } else {
      setTimeout(async () => {
        if (planId) {
          const projects = await utils.getProjects()
          store.dispatch('setProjects', projects.data)
          setPlanName()
        }
      }, 1000)
      next()
    }
  } else {
    setTimeout(() => {
      const cUser = store.getters.user
      if (cUser) {
        const cUsers = store.getters.users
        if (cUsers) {
          const currentUser = cUsers.find(f => f.login === cUser)
          store.dispatch('setUserLdap', currentUser)
        }
        setTimeout(async () => {
          if (planId) {
            const projects = await utils.getProjects()
            store.dispatch('setProjects', projects.data)
            setPlanName()
          }
        }, 1000)
        next()
      } else {
        store.dispatch('setPageHeader', '')
        store.dispatch('setShowToolbar', false)
        store.dispatch('setProject', null)
        if (to.name === 'plan') {
          store.dispatch('setFromPath', to.path)
        }
        document.title = 'Авторизация'
        next('/login?loginError')
      }
    }, 1500)
  }
}
