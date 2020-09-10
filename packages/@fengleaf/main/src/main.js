import Vue from 'vue'
import App from './App.vue'
import router, { routes } from './router'

import './plugins' // 引入UI插件

import runApp from './qiankun'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

runApp(routes)
