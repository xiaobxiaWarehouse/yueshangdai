import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const rechargeRecordApi = '/api/chargeRecord' // 充值记录

// initial state
const state = {
  rechargeRecordData: []
}

// getters
const getters = {
  getRechargeRecord: state => state.rechargeRecordData
}

// actions
const actions = {
  getRechargeRecord: ({ commit }, { pageCount, pageNo }) => { // 充值记录
    return new Promise((resolve, reject) => {
      postAjax({
        url: rechargeRecordApi,
        data: {
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setRechargeRecord', res.data.result.data)
          resolve(res.data.result.data)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  },
  getMoreRechargeRecord: ({ commit }, { pageCount, pageNo }) => {  // 充值记录上拉加载更多
    return new Promise((resolve, reject) => {
      postAjax({
        url: rechargeRecordApi,
        data: {
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setMoreRechargeRecord', res.data.result.data)
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
  setRechargeRecord (state, data) {
    state.rechargeRecordData = data
  },
  setMoreRechargeRecord (state, list) {
    state.rechargeRecordData.push(...list)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
