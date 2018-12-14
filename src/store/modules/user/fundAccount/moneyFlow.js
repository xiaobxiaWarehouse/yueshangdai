import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const moneyFlowApiUrl = '/api/moneyFlowList'  // 资金流水接口
const loanApiUrl = '/api/loanList'  // 出借记录接口
const withdrawApiUrl = '/api/withdrawList'  // 提现记录接口
const chargeApiUrl = '/api/chargeList'  // 充值记录接口

const ApiArr = [moneyFlowApiUrl, loanApiUrl, withdrawApiUrl, chargeApiUrl]

// initial state
const state = {
  moneyFlowData: [], // 资金流水
  loanData: [],  // 出借
  withdrawData: [],  // 提现
  chargeData: []  // 充值
}

// getters
const getters = {
  getMoneyFlowData: state => state.moneyFlowData,
  getLoanData: state => state.loanData,
  getWithdrawData: state => state.withdrawData,
  getChargeData: state => state.chargeData
}

// actions
const actions = {
  getMoneyFlow: ({ commit }, { pageCount, pageNo }) => { // 资金
    return new Promise((resolve, reject) => {
      postAjax({
        url: moneyFlowApiUrl,
        data: {
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setMoneyFlow', res.data.result.data)
          resolve(res.data.result.data)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  },
  getLoan: ({ commit }, { pageCount, pageNo }) => {  // 出借
    return new Promise((resolve, reject) => {
      postAjax({
        url: loanApiUrl,
        data: {
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        let data = res.data
        if (data.success) {
          commit('setLoan', data.result.data)
          resolve(data.result.data)
        } else {
          console.log(data.errorMsg)
        }
      })
    })
  },
  getWithdraw: ({ commit }, { pageCount, pageNo }) => {  // 提现
    return new Promise((resolve, reject) => {
      postAjax({
        url: withdrawApiUrl,
        data: {
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        let data = res.data
        if (data.success) {
          commit('setWithdraw', data.result.data)
          resolve(data.result.data)
        } else {
          console.log(data.errorMsg)
        }
      })
    })
  },
  getCharge: ({ commit }, { pageCount, pageNo }) => {  // 充值
    return new Promise((resolve, reject) => {
      postAjax({
        url: chargeApiUrl,
        data: {
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        let data = res.data
        if (data.success) {
          commit('setCharge', data.result.data)
          resolve(data.result.data)
        } else {
          console.log(data.errorMsg)
        }
      })
    })
  },
  getMoreData: ({ commit }, { type, pageCount, pageNo }) => {
    let api = ApiArr[type]
    return new Promise((resolve, reject) => {
      postAjax({
        url: api,
        data: {
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        let data = res.data
        if (data.success) {
          commit('setMoreData', { data: data.result.data, type: type })
          resolve(data.result.data)
        } else {
          console.log(data.errorMsg)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setMoneyFlow (state, data) {  // 资金
    state.moneyFlowData = data
  },
  setLoan (state, data) { // 出借
    state.loanData = data
  },
  setWithdraw (state, data) { // 提现
    state.withdrawData = data
  },
  setCharge (state, data) { // 充值
    state.chargeData = data
  },
  setMoreData (state, { data, type }) { // 获取更多数据
    if (type === 0) { // 资金
      state.moneyFlowData.push(...data)
      return false
    }
    if (type === 1) { // 出借
      state.loanData.push(...data)
      return false
    }
    if (type === 2) { // 提现
      state.withdrawData.push(...data)
      return false
    }
    if (type === 3) { // 充值
      state.chargeData.push(...data)
      return false
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
