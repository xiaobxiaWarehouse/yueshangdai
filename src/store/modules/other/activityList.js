import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const api = '/api/activityList'  // 专享活动列表

// initial state
const state = {
  activityData: []
}

// getters
const getters = {
  getActivityData: state => state.activityData // 专享活动列表
}

// actions
const actions = {
  getActivityList: ({ commit }, { pageCount, pageNo }) => {  // 专享活动列表
    return new Promise((resolve, reject) => {
      postAjax({
        url: api,
        data: {
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setActivityList', res.data.result.activityList)
          resolve(res.data.result.activityList)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  },
  getMoreActivityList: ({ commit }, { pageCount, pageNo }) => { // 专享活动列表更多
    return new Promise((resolve, reject) => {
      postAjax({
        url: api,
        data: {
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setMoreActivityList', res.data.result.activityList)
          resolve(res.data.result)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setActivityList (state, data) { // 专享活动列表
    state.activityData = data
  },
  setMoreActivityList (state, data) {  // 专享活动列表更多
    state.activityData.push(...data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
