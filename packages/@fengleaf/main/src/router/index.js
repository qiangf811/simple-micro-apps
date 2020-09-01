import Vue from 'vue'
import Router from 'vue-router'
import Container from '../views/index.vue'
import store from '../store'
import path from 'path'

Vue.use(Router)

const originalPush = Router.prototype.push

Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  mode: 'history',
  routes: []
})

export function initRouter (runMicroApps) {
  store.dispatch('initApplication').then(menuList => {
    const routes = menuList.map(item => ({
      path: item.path,
      name: item.path,
      component: Container,
      microAppEntry: '//172.16.6.213' + path.resolve('/', item.relativePath + '/')
    }))
    router.addRoutes(routes)
    runMicroApps && runMicroApps(routes)
  })
}

export default router
