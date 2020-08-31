import Vue from 'vue'
import Vuex from 'vuex'
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import { getApplicationMenu } from '@/api/common'
import { APP_MENU_COD, ROUTER_MAP } from '../constant'
import data from '../../data'
import { deepClone } from '../lib/util'

const userInfoString = Cookies.get('userInfo')
export const userInfo = userInfoString ? JSON.parse(userInfoString) : {}

const currentAppId = window.localStorage.getItem('WINNING_HIS_MAIN_APP_ID')
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    applicationList: [],
    clonedApplicationList: [],
    currentAppId: currentAppId,
    redirect: true,
    userInfo: { ...userInfo }

  },
  getters: {
    currentApplication: (state) => state.clonedApplicationList.find(({ id }) => id === state.currentAppId) || {},
    menu2AppMap: (state) => {
      return state.applicationList
        .map(app => app.children.map(menu => menu)).flat()
        .reduce((r, { path, parentIds }) => {
          r[path] = parentIds
          return r
        }, {})
    }
  },
  mutations: {
    TOOGLE_CURRENT_APP_ID: (state, id) => {
      state.currentAppId = id
      window.localStorage.setItem('WINNING_HIS_MAIN_APP_ID', id)
    },
    ADD_APPLICATION_LIST: (state, data) => {
      state.applicationList = data
      state.clonedApplicationList = deepClone(data)
    },
    ADD_APP_MENU_LIST: (state, { increase, menu }) => {
      const { currentAppId, clonedApplicationList } = state
      const currentApp = clonedApplicationList.find(({ id }) => id === currentAppId)
      if (!currentApp) return
      currentApp.children = currentApp.children || []
      if (increase) { // 新增
        if (!menu.parentIds.includes(currentAppId)) {
          menu.parentIds.push(currentAppId)
        }
        currentApp.children.push(menu)
      } else {
        // 删除
        const index = currentApp.children.findIndex(({ path }) => path === menu.path)
        currentApp.children.splice(index, 1)
        menu.parentIds.splice(menu.parentIds.findIndex(id => id === currentAppId), 1)
      }
    },
    TOOGLE_REDIRECT: (state, redirect) => {
      state.redirect = redirect
    }
  },
  actions: {
    initApplication ({ commit }) {
      return new Promise((resolve, reject) => {
        Promise.resolve(data).then(appList => {
          const applicationList = appList.map(app => ({
            name: app.appSystemName,
            path: app.appSystemRelativeUri,
            id: app.appSystemId,
            children: Array.isArray(app.appMenuList) ? app.appMenuList.map(menu => ({
              parentIds: [app.appSystemId],
              id: menu.appMenuId,
              name: menu.appMenuName,
              path: `/${menu.appMenuRelativeUri.substr(menu.appMenuRelativeUri.lastIndexOf('/') + 1)}`,
              port: menu.port
            })) : []
          }))
          const appMenus = applicationList.map(app => app.children.map(menu => menu)).flat()
          commit('ADD_APPLICATION_LIST', applicationList)
          resolve(appMenus)
        })
      })
    },
    toggleApp ({ commit, state, getters }, id) {
      // 为了解决用户在点击浏览器导航后退-前进时，修复导航菜单数据
      // 修正当前菜单对应的系统id数组集合，将当前的系统的id放置数组最后一位
      restoreMenu2AppIdsStack(getters.menu2AppMap, id)
      // 为了解决用户在点击浏览器导航后退-前进时，修复导航
      commit('TOOGLE_REDIRECT', true)
      commit('TOOGLE_CURRENT_APP_ID', id)
    },
    /**
     * 为了解决用户在点击浏览器导航后退-前进时，修复导航菜单数据专用
     */
    checkAppChange ({ commit, state, getters }, path) {
      const { currentAppId } = state
      const menuParentIds = getters.menu2AppMap[path]
      if (menuParentIds) {
        const menuApplicationId = menuParentIds[menuParentIds.length - 1] // 只取队列里的最后一个，因为最后一个是id是当前系统的id
        if (currentAppId !== menuApplicationId) {
          console.log('当前不是该系统的路由，需要修正')
          restoreMenu2AppIdsStack(getters.menu2AppMap, menuApplicationId) // 修正当前菜单对应的系统id数组集合，将当前的系统的id放置数组最后一位
          commit('TOOGLE_REDIRECT', false)
          commit('TOOGLE_CURRENT_APP_ID', menuApplicationId)
        }
      }
    },
    getMenuList ({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await getApplicationMenu({
            userId: userInfo.userId,
            appSystemId: APP_MENU_COD
          })
          if (res.success) {
            if (res.data && Array.isArray(res.data)) {
              if (!res.data.length) {
                Message({
                  message: '当前登录用户未设置门诊费用应用菜单权限，请联系管理员添加',
                  type: 'warning',
                  duration: 5000
                })
              }
              res.data = res.data.slice(2, 5)
              res.data.forEach(item => {
                const { appMenuRelativeUri, appMenuName } = item
                if (appMenuRelativeUri) {
                  const path = appMenuRelativeUri.substr(appMenuRelativeUri.lastIndexOf('/') + 1)
                  item.name = appMenuName || ROUTER_MAP[path].name
                  item[`${process.env.NODE_ENV}Url`] = ROUTER_MAP[path][`${process.env.NODE_ENV}Url`]
                  item.path = `/${path}`
                }
              })
              commit('ADD_MENU_LIST', res.data)
              resolve(res.data)
            } else {
              Message({
                message: '当前登录用户未获取到应用菜单，请联系管理员添加相应菜单权限',
                type: 'warning',
                duration: 5000
              })
              reject()
            }
          } else {
            Message({
              message: '服务异常，获取应用菜单失败',
              type: 'error',
              duration: 5000
            })
            reject()
          }
        } catch (error) {
          Message({
            message: '服务异常，获取应用菜单失败',
            type: 'error',
            duration: 5000
          })
          reject(error)
        }
      })
    }
  }
})

function restoreMenu2AppIdsStack (obj, appId) {
  // 将path与系统id的映射关系中parentIds重置，将当前切换的系统id放置到最后
  for (const key of Object.keys(obj)) {
    const index = obj[key].indexOf(appId)
    const len = obj[key].length - 1
    if (~index) {
      let temp = obj[key][len]
      obj[key][len] = obj[key][index]
      obj[key][index] = temp
    }
  }
  console.log(obj)
}
