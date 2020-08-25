import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import QIANKUN from '@fee-management/qiankun'

export * from '@fee-management/qiankun'

Vue.config.productionTip = false

Vue.use(QIANKUN, {
  render: h => h(App),
  store,
  router
})
