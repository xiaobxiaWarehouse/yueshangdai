import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const apiUrl = '/api/helpCenter'   // 帮助中心接口

// initial state
const state = {
  proAskData: [], // 产品相关问题
  accountAskData: [], // 账户相关问题
  activityAskData: [] // 活动相关问题
}

// getters
const getters = {
  getProAskData: state => state.proAskData,  // 产品相关问题
  getAccountAskData: state => state.accountAskData,  // 账户相关问题
  getActivityAskData: state => state.activityAskData  // 活动相关问题
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
          if (type === 1) { // 产品相关问题
            commit('setProAsk', res.data.result.helpCenterList)
          }
          if (type === 2) { // 账户相关问题
            commit('setAccountAsk', res.data.result.helpCenterList)
          }
          if (type === 3) { // 活动相关问题
            commit('setActivityAsk', res.data.result.helpCenterList)
          }
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
          if (type === 1) { // 产品相关问题
            commit('setMoretProAsk', res.data.result.helpCenterList)
          }
          if (type === 2) { // 账户相关问题
            commit('setMoretAccountAsk', res.data.result.helpCenterList)
          }
          if (type === 3) { // 活动相关问题
            commit('setMoretActivityAsk', res.data.result.helpCenterList)
          }
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
  setProAsk (state, data) { // 产品相关问题
    state.proAskData = data
  },
  setMoretProAsk (state, data) { // 产品相关问题更多
    state.proAskData.push(...data)
  },
  setAccountAsk (state, data) { // 账户相关问题
    state.accountAskData = data
  },
  setMoretAccountAsk (state, data) {  // 账户相关问题更多
    state.accountAskData.push(...data)
  },
  setActivityAsk (state, data) {  // 活动相关问题
    state.activityAskData = data
  },
  setMoretActivityAsk (state, data) { // 活动相关问题更多
    state.activityAskData.push(...data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
