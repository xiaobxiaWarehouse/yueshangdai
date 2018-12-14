import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const apiUrl = '/api/helpCenter'   // 帮助中心接口

// initial state
const state = {
  hotAskData: [] // 热门问题
}

// getters
const getters = {
  getHotAskData: state => state.hotAskData
}

// actions
const actions = {
  getAsk: ({ commit }, { type, isHot, pageCount, pageNo }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl,
        data: {
          type: type,
          isHot: isHot,
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setHotAsk', res.data.result.helpCenterList)
          resolve(res.data.result.helpCenterList)
        } else {
          reject(res.data.errorMsg)
        }
      })
    })
  },
  getMoreAsk: ({ commit }, { type, isHot, pageCount, pageNo }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl,
        data: {
          type: type,
          isHot: isHot,
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setMoreHotAsk', res.data.result.helpCenterList)
          resolve(res.data.result.helpCenterList)
        } else {
          reject(res.data.errorMsg)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setHotAsk (state, data) { // 产品相关问题
    state.hotAskData = data
  },
  setMoreHotAsk (state, data) { // 产品相关问题更多
    state.hotAskData.push(...data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
