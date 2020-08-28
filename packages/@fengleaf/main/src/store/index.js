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
    userInfo: { ...userInfo }

  },
  getters: {
    currentApplication: (state) => state.clonedApplicationList.find(({ id }) => id === state.currentAppId) || {},
    menu2AppMap: (state) => {
      const dd = state.clonedApplicationList
        .map(app => app.children.map(menu => menu)).flat()
        .reduce((r, { path, parentIds }) => {
          if (path in r) {
            r[path] = r[path].length > parentIds.length ? r[path] : parentIds
          } else {
            r[path] = parentIds
          }
          return r
        }, {})
      console.log(dd)
      return dd
    }
  },
  mutations: {
    ADD_CURRENT_APP_ID: (state, id) => {
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
      }
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
            children: Array.isArray(app.appMenu) ? app.appMenu.map(menu => ({
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
      const map = getters.menu2AppMap
      // 将path与系统id的映射关系中parentIds重置，将当前切换的系统id放置到最后
      for (const key of Object.keys(map)) {
        const index = map[key].indexOf(id)
        const len = map[key].length - 1
        if (~index) {
          let temp = map[key][len]
          map[key][len] = map[key][index]
          map[key][index] = temp
        }
      }
      commit('ADD_CURRENT_APP_ID', id)
    },
    checkAppChange ({ commit, state, getters }, path) {
      const { currentAppId } = state
      const menuParentIds = getters.menu2AppMap[path]
      const menuApplicationId = menuParentIds[menuParentIds.length - 1] // 只取最后一个
      if (currentAppId !== menuApplicationId) {
        console.log('当前不是该系统的路由，需要修正')
        commit('ADD_CURRENT_APP_ID', menuApplicationId)
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
