import Vue from 'vue'
import Vuex from 'vuex'

import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const riskSurveyApi = '/api/riskSurvey'  // 风险测评接口
const riskLevelApi = '/api/riskLevel' // 风险测评结果接口

// initial state
const state = {
  riskData: [], // 风险测评
  surveyResult: ''
}

// getters
const getters = {
  getRiskData: state => state.riskData,  // 获取风险测评问题
  getSurveyResult: state => state.surveyResult  // 获取测评结果
}

// actions
const actions = {
  getRisk: ({ commit }) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: riskSurveyApi
      }).then((res) => {
        let data = res.data
        if (data.success) {
          commit('setRisk', data.result.data)
          resolve()
        } else {
          reject(data.errorMsg)
        }
      })
    })
  },
  postRisk: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      postAjax({
        url: riskLevelApi,
        data: data
      }).then((res) => {
        let data = res.data
        if (data.success) {
          commit('setSurveyResult', data.result)
          resolve()
        } else {
          reject(data.errorMsg)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setRisk (state, data) { // 风险测评
    state.riskData = data
  },
  setSurveyResult (state, result) {  // 设置测评结果
    state.surveyResult = result
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
