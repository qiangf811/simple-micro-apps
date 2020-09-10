import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 3
  },
  mutations: {
    'add-count': (state, data) => {
      state.count = data
    }
  },
  actions: {
  },
  modules: {
  }
})
