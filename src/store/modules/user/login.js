import Vue from 'vue'
import Vuex from 'vuex'
import { Base64 } from 'js-base64'
import postAjax from '@/plugins/PostAjax'

const Util = require('@/assets/js/util')

Vue.use(Vuex)

const logoutApi = '/api/logout'  // 退出接口
const userInfoApi = '/api/getUserInfo'  // 获取用户信息接口

// initial state
const state = {
  userInfo: {}
}

// getters
const getters = {
  getUserInfo: (state) => {
    if (state.userInfo.userNo) {
      return state.userInfo
    }
    return Util.getSessionStorage('userInfo') ? JSON.parse(Base64.decode(Util.getSessionStorage('userInfo'))) : {}
  }
}

// actions
const actions = {
  setUserInfo: ({ commit }, data) => {
    commit('setUserInfo', data)
    commit('setToKen', data.accessToken)
  },
  updateUserInfo: ({ commit }) => { // 更新用户数据
    return new Promise((resolve, reject) => {
      postAjax({
        url: userInfoApi
      }).then((res) => {
        if (res.data.success) {
          commit('setUserInfo', res.data.result)
          resolve()
        }
      })
    })
  },
  removeUserInfo: ({ commit }) => {
    commit('removeUserInfo')
  },
  logout: ({ commit }) => {  // 退出系统
    return new Promise((resolve, reject) => {
      postAjax({
        url: logoutApi
      }).then((res) => {
        let data = res.data
        if (data.success) { // 退出成功
          // 清除用户信息
          commit('removeUserInfo')
          // 清除toKen
          commit('removeToKen')
          resolve()
        } else {
          reject(data)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setUserInfo (state, data) {
    state.userInfo = data
    Util.setSessionStorage('userInfo', Base64.encode(JSON.stringify(data)))
  },
  removeUserInfo (state) {
    state.userInfo = {}
    Util.removeSessionStorage('userInfo')
  },
  setToKen (state, str) {
    Util.setSessionStorage('toKen', Base64.encode(str))
  },
  removeToKen (state) {
    Util.removeSessionStorage('toKen')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
