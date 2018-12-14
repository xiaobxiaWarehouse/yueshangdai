import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const apiUrl = '/api/productList'

// initial state
const state = {
  productOptimizSignData: [],
  productLooseSignData: []
}

// getters
const getters = {
  getProductOptimizSignData: state => state.productOptimizSignData,  // 优选标
  getProductLooseSignData: state => state.productLooseSignData  // 散标计划
}

// actions
const actions = {
  getProduct: ({ commit }, { productType, pageCount, pageNo }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl,
        data: {
          productType: productType,
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        let data = res.data
        if (data.success) {
          if (productType === 2) {  // 优选标
            commit('setOptimizSignProduct', data.result.productList)
          }
          if (productType === 3) {  // 散标计划
            commit('setLooseSignProduct', data.result.productList)
          }
          resolve(data.result.productList)
        } else {
          reject(data.errorMsg)
        }
      })
    })
  },
  getMoreProduct: ({ commit }, { productType, pageCount, pageNo }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl,
        data: {
          productType: productType,
          pageCount: pageCount,
          pageNo: pageNo
        }
      }).then((res) => {
        let data = res.data
        if (data.success) {
          if (productType === 2) {  // 优选标
            commit('setMoreOptimizSignProduct', data.result.productList)
          }
          if (productType === 3) {  // 散标计划
            commit('setMoreLooseSignProduct', data.result.productList)
          }
          resolve(data.result.productList)
        } else {
          reject(data.errorMsg)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setOptimizSignProduct (state, data) { // 优选标
    state.productOptimizSignData = data
  },
  setMoreOptimizSignProduct (state, list) {  // 优选标更多
    state.productOptimizSignData.push(...list)
  },
  setLooseSignProduct (state, data) { // 散标计划
    state.productLooseSignData = data
  },
  setMoreLooseSignProduct (state, list) {  // 散标计划更多
    state.productLooseSignData.push(...list)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
