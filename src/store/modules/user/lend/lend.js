import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const apiUrl = '/api/investmentRecordsList'

// initial state
const state = {
  lendOptimizSignData: [],
  lendLooseSignData: []
}

// getters
const getters = {
  getLendOptimizSignData: state => state.lendOptimizSignData, // 优选标
  getLendLooseSignData: state => state.lendLooseSignData  // 散标计划
}

// actions
const actions = {
  getLend: ({ commit }, { investType, pageCount, pageNo }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl,
        data: {
          investType: investType,
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        let data = res.data
        if (data.success) {
          if (investType === 2) { // 优选标
            commit('setLendOptimizSign', data.result.data)
          }
          if (investType === 3) { // 散标计划
            commit('setLendLooseSign', data.result.data)
          }
          resolve(data.result.data)
        } else {
          reject(data.errorMsg)
        }
      })
    })
  },
  getMoreLend: ({ commit }, { investType, pageCount, pageNo }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl,
        data: {
          investType: investType,
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          if (investType === 2) { // 优选标
            commit('setMoreLendOptimizSign', res.data.result.data)
          }
          if (investType === 3) { // 散标计划
            commit('setMoreLendLooseSign', res.data.result.data)
          }
          resolve(res.data.result.data)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setLendOptimizSign (state, data) {  // 优选标
    state.lendOptimizSignData = data
  },
  setMoreLendOptimizSign (state, list) {  // 优选标更多
    state.lendOptimizSignData.push(...list)
  },
  setLendLooseSign (state, data) {  // 散标计划
    state.lendLooseSignData = data
  },
  setMoreLendLooseSign (state, list) {  // 散标计划更多
    state.lendLooseSignData.push(...list)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
