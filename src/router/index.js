import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'
// import store from '../store'
// import Home from '../views/Home.vue'

Vue.use(Router)

// const routerNew = new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       // component: Home,
//       component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
//       beforeEnter: AuthGuard
//     },
//     {
//       path: '/projectplan/:plan_id',
//       name: 'plan',
//       // route level code-splitting
//       // this generates a separate chunk (about.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import(/* webpackChunkName: "history" */ '../components/gantt/GanttApp.vue'),
//       beforeEnter: AuthGuard
//     },
//     {
//       path: '/history',
//       name: 'history',
//       // route level code-splitting
//       // this generates a separate chunk (about.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import(/* webpackChunkName: "history" */ '../views/History.vue'),
//       beforeEnter: AuthGuard
//     },
//     {
//       path: '/portfolio',
//       name: 'portfolio',
//       // route level code-splitting
//       // this generates a separate chunk (about.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import(/* webpackChunkName: "portfolio" */ '../views/Portfolio.vue'),
//       beforeEnter: AuthGuard
//     },
//     {
//       path: '/login',
//       name: 'login',
//       component: () => import(/* webpackChunkName: "login" */ '../components/Auth/Login.vue')
//     }
//   ],
//   mode: 'history'
// })
// // routerNew.afterEach((to, from, next) => {
// //   store.dispatch('setPageHeader', '')
// //   setTimeout(() => {
// //     console.log('afterEach', store.getters.projects)
// //   }, 1000)
// // })

// export default routerNew

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      // component: Home,
      component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
      beforeEnter: AuthGuard
    },
    {
      path: '/wiki',
      name: 'wiki',
      // component: Home,
      component: () => import(/* webpackChunkName: "wiki" */ '../components/wiki/MainWiki.vue'),
      beforeEnter: AuthGuard
    },
    {
      path: '/reports/requirements',
      name: 'requirements',
      component: () => import(/* webpackChunkName: "requirements" */ '../components/reports/Requirements.vue'),
      beforeEnter: AuthGuard
    },
    {
      path: '/kanban',
      name: 'kanban',
      // component: Home,
      component: () => import(/* webpackChunkName: "kanban" */ '../components/kanban/Kanban.vue'),
      beforeEnter: AuthGuard
    },
    {
      path: '/wiki/view/:article_id',
      name: 'article',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "article" */ '../components/wiki/ViewWikiArticle.vue'),
      beforeEnter: AuthGuard
    },
    {
      path: '/wiki/edit/:article_id',
      name: 'editarticle',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "editarticle" */ '../components/wiki/EditWikiArticle.vue'),
      beforeEnter: AuthGuard
    },
    {
      path: '/projectplan/:plan_id/:task_id',
      name: 'plan',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "plan" */ '../components/gantt/GanttApp.vue'),
      beforeEnter: AuthGuard
    },
    {
      path: '/history',
      name: 'history',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "history" */ '../views/History.vue'),
      beforeEnter: AuthGuard
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "portfolio" */ '../views/Portfolio.vue'),
      beforeEnter: AuthGuard
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../components/Auth/Login.vue')
    }
  ],
  mode: 'history'
})
