import Vue from 'vue'
import App from './App.vue'
import router, { initRouter } from './router'
import store from './store'
import runApp from './qiankun'

import './plugins' // 引入UI插件

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

initRouter(runApp)
