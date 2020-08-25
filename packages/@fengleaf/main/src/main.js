import Vue from 'vue'
import App from './App.vue'
import router, { initRouter } from './router'
import store from './store'

import './plugins' // 引入UI插件

import runApp from './qiankun'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

initRouter(runApp)
