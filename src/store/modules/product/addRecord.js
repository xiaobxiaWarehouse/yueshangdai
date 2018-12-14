import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const rankApi = '/api/rank'  // 排行榜接口
const addRecordApi = '/api/addRecords' // 加入记录

// initial state
const state = {
  rankData: [],
  addRecordData: []
}

// getters
const getters = {
  getRankData: state => state.rankData, // 排行榜
  getAddRecordData: state => state.addRecordData // 加入记录
}

// actions
const actions = {
  getRank: ({ commit }, { id }) => {  // 排行榜
    return new Promise((resolve, reject) => {
      postAjax({
        url: rankApi,
        data: {
          productId: id
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setRank', res.data.result.rankList)
          resolve(res)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  },
  getAddRecord: ({ commit }, { id, pageCount, pageNo }) => { // 加入记录
    return new Promise((resolve, reject) => {
      postAjax({
        url: addRecordApi,
        data: {
          productId: id,
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setAddRecord', res.data.result.investRecordList)
          resolve(res.data.result.investRecordList)
        } else {
          reject(res.data.errorMsg)
        }
      })
    })
  },
  getMoreAddRecord: ({ commit }, { id, pageCount, pageNo }) => {  // 加入记录更多
    return new Promise((resolve, reject) => {
      postAjax({
        url: addRecordApi,
        data: {
          productId: id,
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setAddMoreRecord', res.data.result.investRecordList)
          resolve(res.data.result.investRecordList)
        } else {
          reject(res.data.errorMsg)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setRank (state, data) { // 排行榜
    state.rankData = data
  },
  setAddRecord (state, data) {  // 加入记录
    state.addRecordData = data
  },
  setAddMoreRecord (state, list) {  // 加入记录更多
    state.addRecordData.push(...list)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
