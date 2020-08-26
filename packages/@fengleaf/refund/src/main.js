import Vue from 'vue'
import App from './App.vue'
import store from './store'
import MicroApp from '@winning/micro-app'
export * from '@winning/micro-app'

Vue.config.productionTip = false

Vue.use(MicroApp, {
  render: h => h(App),
  store
})
