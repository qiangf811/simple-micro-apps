import { registerMicroApps, start } from 'qiankun'

function genActiveRule (routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix)
}

export default function run (routes = []) {
  const microApps = routes.map(route => ({
    name: route.name.replace('/', ''),
    entry: route.microAppEntry,
    container: '#subapp-viewport',
    activeRule: genActiveRule(`${route.path}`),
    props: {
      keepAlive: false // 是否缓存，服务于vue的keep-alive
    }
  }))
  registerMicroApps(microApps)
  start()
}
