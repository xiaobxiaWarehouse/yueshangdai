import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const apiUrl = '/api/moneyFlowDetail'  // 单个资金流水详情

// initial state
const state = {
  moneyFlowDetailData: {}
}

// getters
const getters = {
  getMoneyFlowDetailData: state => state.moneyFlowDetailData
}

// actions
const actions = {
  getMoneyFlowDetail: ({ commit }, { id }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl,
        data: {
          moneyFlowId: id
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setMoneyFlowDetail', res.data.result)
          resolve()
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setMoneyFlowDetail (state, data) {
    state.moneyFlowDetailData = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
