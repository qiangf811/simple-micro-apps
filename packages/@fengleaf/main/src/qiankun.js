import { registerMicroApps, start, setDefaultMountApp } from 'qiankun'

function genActiveRule (routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix)
}

export default function run (routes = []) {
  const microApps = routes.map(route => ({
    name: route.name.replace('/', ''),
    entry: route[`${process.env.NODE_ENV}Url`],
    container: '#subapp-viewport',
    activeRule: genActiveRule(`${route.path}`),
    props: {
      keepAlive: true // 是否缓存，服务于vue的keep-alive
    }
  }))
  registerMicroApps(microApps)

  // routes[0] && setDefaultMountApp(`${routes[0].path}`)

  start()
}
