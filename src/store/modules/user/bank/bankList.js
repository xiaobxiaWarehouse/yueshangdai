import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const apiUrl = '/api/supportBankList' // 支持银行列表

// initial state
const state = {
  bankListData: null,
  selectBankInfo: null
}

// getters
const getters = {
  getBankList: state => state.bankListData,
  getSelectBankInfo: state => state.selectBankInfo
}

// actions
const actions = {
  getBankList: ({ commit }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl
      }).then((res) => {
        if (res.data.success) {
          commit('setBankList', res.data.result.data)
          resolve()
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  },
  setSelectBankInfo: ({ commit }, Obj) => {
    commit('setSelectBankInfo', Obj)
  },
  clearSelectBankInfo: ({ commit }) => {
    commit('clearSelectBankInfo')
  }
}

// mutations
const mutations = {
  setBankList (state, data) {
    state.bankListData = data
  },
  setSelectBankInfo (state, Obj) {
    state.selectBankInfo = Obj
  },
  clearSelectBankInfo (state) {
    state.selectBankInfo = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
