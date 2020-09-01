import Vue from 'vue'
import Vuex from 'vuex'
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import { getApplicationList } from '@/api/common'

const userInfoString = Cookies.get('userInfo')
export const userInfo = userInfoString ? JSON.parse(userInfoString) : {}

if (process.env.NODE_ENV === 'development') {
  window.localStorage.setItem('WINNING_HIS_MAIN_APP_ID', '4302708202')
}

const currentAppId = window.localStorage.getItem('WINNING_HIS_MAIN_APP_ID')
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    applicationList: [], // 树形的系统数据集合
    flatApplicationList: [], // 子菜单被拍平的系统集合
    currentAppId: currentAppId, // 当前选择的系统id
    redirect: true, // 是否需要跳转至系统的第一个路由
    menu2AppMap: {}, // 菜单的path对应的系统id的map，用于点击浏览器前进后退修正当前系统
    userInfo: { ...userInfo }
  },
  getters: {
    currentApplication: (state) => state.flatApplicationList.find(({ id }) => id === state.currentAppId) || {}
  },
  mutations: {
    TOOGLE_CURRENT_APP_ID: (state, id) => {
      state.currentAppId = id
      window.localStorage.setItem('WINNING_HIS_MAIN_APP_ID', id)
    },
    ADD_APPLICATION_LIST: (state, data) => {
      state.applicationList = data
    },
    ADD_FLAT_APPLICATION_LIST: (state, data) => {
      state.flatApplicationList = data
    },
    ADD_MENU2APP_MAP: (state, data) => {
      state.menu2AppMap = data
    },
    ADD_APP_MENU_LIST: (state, { increase, menu }) => {
      const { currentAppId, flatApplicationList } = state
      const currentApp = flatApplicationList.find(({ id }) => id === currentAppId)
      if (!currentApp) return
      currentApp.children = currentApp.children || []
      const routerParentIds = state.menu2AppMap[menu.path]
      if (increase) { // 新增
        routerParentIds && routerParentIds.push(currentAppId)
        currentApp.children.push(menu)
      } else {
        // 删除
        const index = currentApp.children.findIndex(({ path }) => path === menu.path)
        currentApp.children.splice(index, 1)
        routerParentIds && routerParentIds.splice(routerParentIds.findIndex(id => id === currentAppId), 1)
      }
    },
    TOOGLE_REDIRECT: (state, redirect) => {
      state.redirect = redirect
    }
  },
  actions: {
    initApplication ({ commit, getters }) {
      return new Promise(async (resolve, reject) => {
        try {
          // const fetchLikely = getLikelyApp({
          //   userId: userInfo.userId,
          //   soid: [userInfo.hospitalSOID]
          // })
          const fetchLikely = Promise.resolve({
            success: true,
            data: [{
              'appSystemId': '12',
              'appSystemCode': '959608',
              'appSystemName': '日常工作',
              'appSystemRelativeUri': 'love',
              'appMenuList': [{
                'appMenuId': '430270826411',
                appMenuName: '账户-1',
                'appMenuLevel': null,
                'appMenuRelativeUri': '/feeCompare',
                port: 3000
              }]
            }]
          })
          const fetchNomal = getApplicationList({
            userId: userInfo.userId,
            soid: [userInfo.hospitalSOID]
          })
          const results = await Promise.allSettled([fetchLikely, fetchNomal])
          // 原始数据，进行字段更正及修改---他是一个树，用来渲染
          const applicationList = results
            .filter(
              p => p.status === 'fulfilled' &&
                p.value &&
                p.value.success === true)
            .reduce((r, c) => r.concat(c.value.data.map(app => ({
              name: app.appSystemName,
              id: app.appSystemId,
              children: getRoute(app.appMenuList, app.appSystemId)
            }))), [])
          const flatApplicationList = applicationList.map(app => ({
            ...app, children: getTreeLastLevel(app.children).flat(Infinity).filter(item => item.path)
          }))
          const appMenus = flatApplicationList.map(app => app.children).flat()
          const menu2AppMap = appMenus.reduce((r, { path, parentIds }) => {
            r[path] = parentIds
            return r
          }, {})
          commit('ADD_APPLICATION_LIST', applicationList)
          commit('ADD_FLAT_APPLICATION_LIST', flatApplicationList)
          commit('ADD_MENU2APP_MAP', menu2AppMap)
          resolve(appMenus)
        } catch (error) {
          Message({
            message: '服务异常，获取应用菜单失败',
            type: 'error',
            duration: 5000
          })
          reject(error)
        }
      })
    },
    toggleApp ({ commit, state }, id) {
      // 为了解决用户在点击浏览器导航后退-前进时，修复导航菜单数据
      // 修正当前菜单对应的系统id数组集合，将当前的系统的id放置数组最后一位
      restoreMenu2AppIdsStack(state.menu2AppMap, id)
      // 为了解决用户在点击浏览器导航后退-前进时，修复导航
      commit('TOOGLE_REDIRECT', true)
      commit('TOOGLE_CURRENT_APP_ID', id)
    },
    /**
     * 为了解决用户在点击浏览器导航后退-前进时，修复导航菜单数据专用
     */
    checkAppChange ({ commit, state }, { path, $router }) {
      const { currentAppId } = state
      const menuParentIds = state.menu2AppMap[path]
      if (menuParentIds && menuParentIds.length) {
        const menuApplicationId = menuParentIds[menuParentIds.length - 1] // 只取队列里的最后一个，因为最后一个是id是当前系统的id
        if (currentAppId !== menuApplicationId) {
          console.log('当前不是该系统的路由，需要修正')
          restoreMenu2AppIdsStack(state.menu2AppMap, menuApplicationId) // 修正当前菜单对应的系统id数组集合，将当前的系统的id放置数组最后一位
          commit('TOOGLE_REDIRECT', false)
          commit('TOOGLE_CURRENT_APP_ID', menuApplicationId)
        }
      } else { // 当前菜单已经被删除了，跳转不了了，返回原路由
        $router.back()
      }
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
}

function getRoute (list = [], appSystemId) {
  return list.map(item => {
    const obj = {
      parentIds: [appSystemId],
      id: item.appMenuId,
      name: item.appMenuName
    }
    if ((!item.appMenuList || !item.appMenuList.length) && item.appMenuRelativeUri) {
      obj.relativePath = item.appMenuRelativeUri.replace(/\/#/, '')
      obj.path = `/${item.appMenuId}`
    } else if (item.appMenuList.length) {
      obj.children = getRoute(item.appMenuList, appSystemId)
    }
    return obj
  })
}

function getTreeLastLevel (array) {
  return array.map(item => {
    if (item.children && item.children.length) {
      return getTreeLastLevel(item.children)
    }
    return item
  })
}
