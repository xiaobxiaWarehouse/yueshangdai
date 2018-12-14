import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const withdrawRecordApi = '/api/withdrawRecord' // 提现记录

// initial state
const state = {
  withdrawRecordData: []
}

// getters
const getters = {
  getWithdrawRecord: state => state.withdrawRecordData
}

// actions
const actions = {
  getWithdrawRecord: ({ commit }, { pageCount, pageNo }) => {  // 提现记录
    return new Promise((resolve, reject) => {
      postAjax({
        url: withdrawRecordApi,
        data: {
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setWithdrawRecord', res.data.result.data)
          resolve(res.data.result.data)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  },
  getMoreWithdrawRecord: ({ commit }, { pageCount, pageNo }) => {  // 提现记录上拉加载更多
    return new Promise((resolve, reject) => {
      postAjax({
        url: withdrawRecordApi,
        data: {
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setMoreWithdrawRecord', res.data.result.data)
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
  setWithdrawRecord (state, data) {
    state.withdrawRecordData = data
  },
  setMoreWithdrawRecord (state, list) {
    state.withdrawRecordData.push(...list)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
