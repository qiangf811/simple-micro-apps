import Vue from 'vue'
import App from './App.vue'
import store from './store'

import QIANKUN from '@fengleaf/qiankun'
export * from '@fengleaf/qiankun'

Vue.config.productionTip = false

if (window.__POWERED_BY_QIANKUN__) {
  /* eslint-disable */
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}

Vue.use(QIANKUN, {
  render: h => h(App),
  store
})
