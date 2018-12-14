import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// initial state
const state = {
  repaymentInfo: {
    repaymentMoney: 0,
    money: 0,
    fee: 0
  }
}

// getters
const getters = {
  getRepaymentInfo: state => state.repaymentInfo
}

// actions
const actions = {
  setRepaymentInfo: ({ commit }, Info) => {
    commit('setRepaymentInfo', Info)
  }
}

// mutations
const mutations = {
  setRepaymentInfo (state, Info) {
    state.repaymentInfo = Info
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
