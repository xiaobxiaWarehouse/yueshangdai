import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'
const Util = require('@/assets/js/util')

Vue.use(Vuex)

const redPackUrl = '/api/redEnvelopesNumber'  // 可用红包个数
const tradersPasswordVerifyApi = 'api/tradersPasswordVerify'  // 效验交易密码接口
const buyInvestOrderApi = 'api/buyInvestOrder'  // 创建订单接口
const buyPurchaseApi = 'api/buyPurchase'  // 确认支付

// initial state
const state = {
  investMoney: '', // 投资金额
  redPackNum: 0, // 可使用的红包个数
  interest: 0, // 利息
  investOrderData: {}, // 订单信息
  protocol: true  // 保存是否同意协议
}

// getters
const getters = {
  getInvestMoney: state => state.investMoney, // 投资金额
  getRedPackNum: state => state.redPackNum, // 可使用的红包个数
  getInterest: state => state.interest,  // 利息
  getInvestOrderData: state => state.investOrderData,  // 订单信息
  getProtocol: state => state.protocol
}

// actions
const actions = {
  setInvestMoney: ({ commit }, { investMoney }) => {  // 投资金额
    commit('setInvestMoney', investMoney)
  },
  clearInvestMoney: ({ commit }) => { // 清除投资金额
    commit('clearInvestMoney')
  },
  setInterest: ({ commit }, { investMoney, apr, limit, limitUnit }) => {  // 利息
    let day = Util.getInvestDay(limit, limitUnit) // 投资天数
    let interest = Util.floatMul(Util.floatMul(investMoney, Util.floatDiv(apr, 100)), Util.floatDiv(day, 365))  // 利息计算 = 本金 * par/100 * 30/365
    commit('setInterest', interest)
  },
  clearInterest: ({ commit }) => {  // 清除利息
    commit('clearInterest')
  },
  getRedPackNum: ({ commit }, { id, type, investMoney }) => { // 可使用的红包个数
    return new Promise((resolve, reject) => {
      postAjax({
        url: redPackUrl,
        data: {
          productId: id,
          type: type,
          investMoney: investMoney
        },
        toKen: Util.getSessionStorage('toKen')
      }).then((res) => {
        if (res.data.success) {
          commit('setRedPackNum', res.data.result.totalNumber)
          resolve(res)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  },
  clearRedPackNum: ({ commit }) => {  // 清除可使用的红包个数
    commit('clearRedPackNum')
  },
  tradersPasswordVerify: ({ commit }, { tradePassword, productId, amount, tradeNo }) => {  // 效验交易密码
    return new Promise((resolve, reject) => {
      postAjax({
        url: tradersPasswordVerifyApi,
        data: {
          tradePassword: tradePassword,
          productId: productId,
          amount: amount,
          tradeNo: tradeNo
        }
      }).then((res) => {
        if (res.data.success) { // 校验成功
          resolve()
        } else {  // 校验失败
          reject(res.data)
        }
      })
    })
  },
  setInvestOrder: ({ commit }, { productId, amount, awardId }) => {  // 创建订单
    return new Promise((resolve, reject) => {
      postAjax({
        url: buyInvestOrderApi,
        data: {
          productId: productId,
          amount: amount,
          awardId: awardId
        }
      }).then((res) => {
        let data = res.data
        if (data.success) { // 创建成功
          commit('setInvestOrder', data.result)
          resolve(data)
        } else {  // 创建失败
          reject(data.errorMsg)
        }
      })
    })
  },
  buyPurchase: ({ commit }, { productId, amount, balance, awardId, tradePassword, bankCardNo, money, tradeNo }) => {  // 确认支付
    return new Promise((resolve, reject) => {
      postAjax({
        url: buyPurchaseApi,
        data: {
          productId: productId,         // 产品ID
          amount: amount,               // 购买金额
          balance: balance,             // 使用账户余额
          awardId: awardId,             // 红包id
          tradePassword: tradePassword, // 交易密码
          bankCardNo: bankCardNo,       // 银行卡号
          money: money,                 // 充值金额
          tradeNo: tradeNo              // 订单号
        }
      }).then((res) => {
        let data = res.data
        if (data.success) { // 支付成功
          resolve(data)
        } else {  // 支付失败
          reject(data)
        }
      })
    })
  },
  getProtocol: ({ commit }, value) => {
    commit('setProtocol', value)
  }
}

// mutations
const mutations = {
  setInvestMoney (state, investMoney) { // 设置投资金额
    state.investMoney = investMoney
  },
  clearInvestMoney (state) {  // 清除投资金额
    state.investMoney = 0
  },
  setRedPackNum (state, data) { // 红包个数
    state.redPackNum = data
  },
  clearRedPackNum (state) {
    state.redPackNum = 0
  },
  setInterest (state, interest) { // 利息
    state.interest = interest
  },
  clearInterest (state) { // 清除利息
    state.interest = 0
  },
  setInvestOrder (state, data) {  // 订单信息
    state.investOrderData = data
  },
  setProtocol (state, value) {
    state.protocol = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
