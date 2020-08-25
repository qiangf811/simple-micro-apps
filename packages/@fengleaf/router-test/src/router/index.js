import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'zzzz',
    component: Home
  },
  {
    path: '/b',
    name: 'zdddee',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "xxxxx111" */ '../views/About.vue')
  }
]

export default function router() {
  return new VueRouter({
    base: '/receiptPrinting',
    // mode: 'history',
    routes
  })

}