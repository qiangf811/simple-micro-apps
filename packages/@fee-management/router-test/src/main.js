import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import QIANKUN from '@ fengleaf/qiankun'

export * from '@ fengleaf/qiankun'

Vue.config.productionTip = false

Vue.use(QIANKUN, {
  render: h => h(App),
  store,
  router
})
