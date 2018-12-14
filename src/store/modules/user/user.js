import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const apiUrl = '/api/mineAccount' // 我的信息

// initial state
const state = {
  mineAccountData: {},
  seeStatus: true // 显示隐藏金额
}

// getters
const getters = {
  getMineAccountData: state => state.mineAccountData,
  getSeeStatus: state => state.seeStatus
}

// actions
const actions = {
  getMineAccount: ({ commit }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl
      }).then((res) => {
        let data = res.data
        if (data.success) {
          commit('setMineAccount', data.result)
          resolve()
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  },
  getSeeStatus: ({ commit }, { status }) => {
    commit('setSeeStatus', status)
  }
}

// mutations
const mutations = {
  setMineAccount (state, data) {
    state.mineAccountData = data
  },
  setSeeStatus (state, status) {
    state.seeStatus = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
