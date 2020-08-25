import Vue from 'vue'
import WinComponents from 'winning-components'
import 'winning-components/lib/finance-theme/index.css'

Vue.use(WinComponents)

// 引入组件库所有svg
const reqComponentIcons = require.context('winning-components/lib/finance-theme/icon-svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(reqComponentIcons)
