import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const apiUrl = '/api/couponsList'   // 我的红包

// initial state
const state = {
  unusedCouponsData: [], // 未使用的红包
  usedCouponsData: [], // 已使用的红包
  datedCouponsData: []  // 已过期的红包
}

// getters
const getters = {
  getUnusedCouponsData: state => state.unusedCouponsData,
  getUsedCouponsData: state => state.usedCouponsData,
  getDatedCouponsData: state => state.datedCouponsData
}

// actions
const actions = {
  getCoupons: ({ commit }, { couponsStatus, pageCount, pageNo }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl,
        data: {
          couponsStatus: couponsStatus,
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          if (couponsStatus === 0) {  // 未使用的红包
            commit('setUnusedCoupons', res.data.result.couponsList)
          }
          if (couponsStatus === 1) {  // 已使用的红包
            commit('setUsedCoupons', res.data.result.couponsList)
          }
          if (couponsStatus === 2) {  // 已过期的红包
            commit('setDatedCoupons', res.data.result.couponsList)
          }
          resolve(res.data.result.couponsList)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  },
  getMoreCoupons: ({ commit }, { couponsStatus, pageCount, pageNo }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl,
        data: {
          couponsStatus: couponsStatus,
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          if (couponsStatus === 0) {  // 未使用的红包
            commit('setMoreUnusedCoupons', res.data.result.couponsList)
          }
          if (couponsStatus === 1) {  // 未使用的红包
            commit('setMoreUsedCoupons', res.data.result.couponsList)
          }
          if (couponsStatus === 2) {  // 已过期的红包
            commit('setMoreDatedCoupons', res.data.result.couponsList)
          }
          resolve(res.data.result.couponsList)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setUnusedCoupons (state, data) {  // 未使用的红包
    state.unusedCouponsData = data
  },
  setMoreUnusedCoupons (state, data) {  // 未使用的红包更多
    state.unusedCouponsData.push(...data)
  },
  setUsedCoupons (state, data) {  // 已使用的红包
    state.usedCouponsData = data
  },
  setMoreUsedCoupons (state, data) {  // 已使用的红包更多
    state.usedCouponsData.push(...data)
  },
  setDatedCoupons (state, data) { // 已过期的红包
    state.datedCouponsData = data
  },
  setMoreDatedCoupons (state, data) { // 已过期的红包更多
    state.datedCouponsData.push(...data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
