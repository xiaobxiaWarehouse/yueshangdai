import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const apiUrl = '/api/userBankCard' // 我的银行卡接口

// initial state
const state = {
  userBankCardData: null
}

// getters
const getters = {
  getUserBankCardData: state => state.userBankCardData
}

// actions
const actions = {
  getUserBankCard: ({ commit }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl
      }).then((res) => {
        if (res.data.success) {
          resolve()
          commit('setUserBankCard', res.data.result.data)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setUserBankCard (state, data) {
    state.userBankCardData = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
