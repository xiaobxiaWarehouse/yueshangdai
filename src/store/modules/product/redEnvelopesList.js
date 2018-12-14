import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const apiUrl = '/api/redEnvelopesList'  // 可用红包列表

// initial state
const state = {
  redEnvelopesData: [],
  useEnveLoposData: {}  // 选择使用的红包
}

// getters
const getters = {
  getRedEnvelopesData: state => state.redEnvelopesData,
  getUseEnveLoposData: state => state.useEnveLoposData
}

// actions
const actions = {
  getRedEnvelopesList: ({ commit }, { id, type, investMoney }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: apiUrl,
        data: {
          productId: id,
          type: type,
          investMoney: investMoney
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setRedEnvelopesList', res.data.result.data)
          resolve(res)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  },
  getUseEnveLopos: ({ state, commit }, { id }) => {
    return new Promise((resolve, reject) => {
      let data = state.redEnvelopesData.filter((item) => {
        return item.envelopesId === id
      })[0]
      commit('setUseEnveLopos', data)
      resolve(data)
    })
  },
  clearUseEnveLopos: ({ commit }) => {
    commit('clearUseEnveLopos')
  }
}

// mutations
const mutations = {
  setRedEnvelopesList (state, data) {
    state.redEnvelopesData = data
  },
  setUseEnveLopos (state, data) {
    state.useEnveLoposData = data
  },
  clearUseEnveLopos (state) {
    state.useEnveLoposData = {}
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
