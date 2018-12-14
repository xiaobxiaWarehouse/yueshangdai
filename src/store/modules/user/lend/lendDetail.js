import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const apiUrl = '/api/investDetail'

// initial state
const state = {
  investDetailData: {}
}

// getters
const getters = {
  getInvestDetailData: state => state.investDetailData // 优选标
}

// actions
const actions = {
  getInvestDetail: ({ commit }, { id }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl,
        data: {
          investProductId: id
        }
      }).then((res) => {
        let data = res.data
        if (data.success) {
          commit('setInvestDetail', data.result)
          resolve()
        } else {
          console.log(data.errorMsg)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setInvestDetail (state, data) {  // 优选标
    state.investDetailData = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
