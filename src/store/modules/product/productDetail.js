import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const apiUrl = '/api/productDetail'
const addRecordsCountUrl = '/api/addRecordsCount' // 单个标投资记录总数

// initial state
const state = {
  data: {},
  addRecordsCount: 0
}

// getters
const getters = {
  getProductDetailData: state => state.data,
  getAddRecordsCount: state => state.addRecordsCount
}

// actions
const actions = {
  getProductDetail: ({ commit }, { id }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl,
        data: {
          productId: id
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setProductDetail', res.data.result)
          resolve(res)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  },
  getAddRecordsCount: ({ commit }, { id }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: addRecordsCountUrl,
        data: {
          productId: id
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setAddRecordsCount', res.data.result.count)
          resolve(res)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setProductDetail (state, data) {
    state.data = data
  },
  setAddRecordsCount (state, num) {
    state.addRecordsCount = num
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
