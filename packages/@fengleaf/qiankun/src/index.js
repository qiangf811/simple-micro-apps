/* eslint-disable */
import '../src/public-path'

let instance = null
let render = () => { }
let appBootstrap
let appMount
let appUnmount
const noop = () => { }

export default {
  install: function (Vue, options = {}) {
    const { bootstrap = noop, mount = noop, unmount = noop, ...vue } = options
    appBootstrap = bootstrap
    appMount = mount
    appUnmount = unmount

    render = function (props = {}) {
      const { container, keepAlive } = props
      const opts = { ...vue }
      let { router } = opts
      if (router) {
        router = router()
        opts.router = router
      } // 这里执行函数new一个新的路由实例， 否则无法响应URL的变化。
      if (window.__POWERED_BY_QIANKUN__ && keepAlive && window.__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__) {
        // 当前仅当选项为keepalive时做处理
        const cachedInstance = window.__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__
        const cachedNode = cachedInstance._vnode // 从最初的Vue实例上获得_vnode
        router && router.apps.push(...cachedInstance.$router.apps) // 让当前路由在最初的Vue实例上可用
        opts.render = () => cachedNode
        instance = new Vue(opts)
        router && router.onReady(() => {
          const { path } = router.currentRoute
          const { path: oldPath } = cachedInstance.$router.currentRoute
          if (path !== oldPath) { // 当前路由和上一次卸载时不一致，则切换至新路由
            cachedInstance.$router.push(path)
          }
        })

        instance.cachedInstance = cachedInstance // 缓存最初的Vue实例

        instance.$mount(container ? container.querySelector('#app') : '#app')
      } else {
        // 正常实例化
        instance = new Vue(opts).$mount(container ? container.querySelector('#app') : '#app')
      }
    }
    if (!window.__POWERED_BY_QIANKUN__) {
      render()
    }
  }
}

export async function bootstrap(props) {
  appBootstrap(props)
}

export async function mount(props) {
  // console.log('[vue] props from main framework', props)
  render(props)
  appMount(props)
}

export async function unmount(props) {
  const { keepAlive } = props
  if (keepAlive) {
    const cachedInstance = instance.cachedInstance || instance
    window.__CACHE_INSTANCE_BY_QIAN_KUN_FOR_VUE__ = cachedInstance
    const cachedNode = cachedInstance._vnode
    cachedNode.data.keepAlive = true
    cachedNode.data.hook.destroy(cachedNode)
    // 卸载当前实例， 缓存的实例由于keep-alive生效，将不会真正被销毁，从而触发activated与deactivated
    if (instance.cachedInstance) {
      instance.$destroy()
      instance = null
    }
  } else {
    instance.$destroy()
    instance.$el.innerHTML = ''
    instance = null
  }
  appUnmount(props)
}
