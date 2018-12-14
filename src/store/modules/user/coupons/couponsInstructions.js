import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const apiUrl = '/api/RedEnvelopeInstructions'   // 红包使用说明接口

// initial state
const state = {
  couponsInstructionsData: [] // 红包使用说明
}

// getters
const getters = {
  getCouponsInstructionsData: state => state.couponsInstructionsData
}

// actions
const actions = {
  getCouponsInstructions: ({ commit }, { pageCount, pageNo }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl,
        data: {
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setCouponsInstructions', res.data.result.helpCenterList)
          resolve(res.data.result.helpCenterList)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  },
  getMoreCouponsInstructions: ({ commit }, { pageCount, pageNo }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl,
        data: {
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setMoreCouponsInstructions', res.data.result.helpCenterList)
          resolve(res.data.result.helpCenterList)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setCouponsInstructions (state, data) {
    state.couponsInstructionsData = data
  },
  setMoreCouponsInstructions (state, data) {
    state.couponsInstructionsData.push(...data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
