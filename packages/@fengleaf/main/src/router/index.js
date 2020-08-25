import Vue from 'vue'
import Router from 'vue-router'

import store from '../store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: []
})

export function initRouter (runMicroApps) {
  store.dispatch('getMenuList').then(res => {
    const routes = res.map(item => ({
      path: item.path,
      name: item.path,
      component: () => import(`../views/index.vue`),
      meta: { title: item.name, requireAuth: true },
      developmentUrl:  item.developmentUrl
    }))
    router.addRoutes(routes.concat({
      path: '/',
      redirect: res[0].path
    }))
    runMicroApps && runMicroApps(routes)
  })
}

export default router
