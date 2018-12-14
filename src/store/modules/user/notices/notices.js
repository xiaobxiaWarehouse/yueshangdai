import Vue from 'vue'
import Vuex from 'vuex'

import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const noticesApi = '/api/messageList'  // 消息列表

// initial state
const state = {
  userNoticesData: [], // 用户消息
  systemNoticesData: [] // 系统消息
}

// getters
const getters = {
  getUserNoticesData: (state) => state.userNoticesData,  // 用户消息
  getSystemNoticesData: (state) => state.systemNoticesData  // 系统消息
}

// actions
const actions = {
  getNotices: ({ commit }, { type, accountId, pageCount, pageNo }) => {  // 获取消息
    return new Promise((resolve, reject) => {
      postAjax({
        url: noticesApi,
        data: {
          type: type,
          accountId: accountId,
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        let data = res.data
        if (data.success) {
          if (type === 0) { // 系统消息
            commit('setSystemNotices', data.result.messageList)
          }
          if (type === 1) { // 用户消息
            commit('setUserNotices', data.result.messageList)
          }
          resolve(data.result.messageList)
        }
      })
    })
  },
  getMoreNotices: ({ commit }, { type, accountId, pageCount, pageNo }) => {  // 获取更多消息
    return new Promise((resolve, reject) => {
      postAjax({
        url: noticesApi,
        data: {
          type: type,
          accountId: accountId,
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        let data = res.data
        if (data.success) {
          if (type === 0) { // 系统消息
            commit('setMoreSystemNotices', data.result.messageList)
          }
          if (type === 1) { // 用户消息
            commit('setMoreUserNotices', data.result.messageList)
          }
          resolve()
        }
      })
    })
  }
}

// mutations
const mutations = {
  setSystemNotices (state, data) {
    state.systemNoticesData = data
  },
  setMoreSystemNotices (state, data) {
    state.systemNoticesData.push(...data)
  },
  setUserNotices (state, data) {
    state.userNoticesData = data
  },
  setMoreUserNotices (state, data) {
    state.userNoticesData.push(...data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
