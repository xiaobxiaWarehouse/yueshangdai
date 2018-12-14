import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const apiUrl = '/api/invitedList'   // 帮助中心接口

// initial state
const state = {
  invitedData: {}
}

// getters
const getters = {
  getInvitedData: state => state.invitedData
}

// actions
const actions = {
  getInvited: ({ commit }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl
      }).then((res) => {
        if (res.data.success) {
          commit('setInvited', res.data.result)
          resolve(res.data.result)
        } else {
          reject(res.data.errorMsg)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setInvited (state, data) {
    state.invitedData = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
