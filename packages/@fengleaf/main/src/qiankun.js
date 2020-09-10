import { registerMicroApps, setDefaultMountApp, start } from 'qiankun'

function genActiveRule (routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix)
}

export default function run (routes = []) {
  const microApps = routes.map(route => ({
    name: route.name,
    entry: route.qiankunEntry,
    container: '#subapp-viewport',
    activeRule: genActiveRule(`${route.path}`)
  }))
  registerMicroApps(microApps)
  start()
  setDefaultMountApp(routes[0].path)
}
