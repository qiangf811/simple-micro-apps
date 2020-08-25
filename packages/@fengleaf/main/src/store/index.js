import Vue from 'vue'
import Vuex from 'vuex'
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import { getApplicationMenu } from '@/api/common'
import { APP_MENU_COD, ROUTER_MAP } from '../constant'

const userInfoString = Cookies.get('userInfo')
export const userInfo = userInfoString ? JSON.parse(userInfoString) : {}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menuList: [],
    userInfo: { ...userInfo }
  },
  mutations: {
    ADD_MENU_LIST: (state, data) => {
      state.menuList = data
    }
  },
  actions: {
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
                const { appMenuRelativeUri } = item
                if (appMenuRelativeUri) {
                  const path = appMenuRelativeUri.substr(appMenuRelativeUri.lastIndexOf('/') + 1)
                  item.name = ROUTER_MAP[path].name
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
  },
  modules: {
  }
})
