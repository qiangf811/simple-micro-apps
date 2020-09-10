import Vue from 'vue'
import Router from 'vue-router'
import Container from '../views/index.vue'

Vue.use(Router)

const originalPush = Router.prototype.push

Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export const routes = [
  {
    path: '/refund',
    name: 'refund',
    component: Container,
    qiankunEntry: 'http://123.1.1.1'
  }, {
    path: '/charge',
    name: 'charge',
    component: Container,
    qiankunEntry: 'http://localhost:3001'
  }]

const router = new Router({
  mode: 'history',
  routes
})

export default router
