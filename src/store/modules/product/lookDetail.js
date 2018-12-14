import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const projectDescriptionApi = 'api/projectDescription'  // 项目描述
const qualificationAuditApi = 'api/qualificationAudit'  // 资质审核

// initial state
const state = {
  projectDescriptionData: {},
  qualificationAuditData: []
}

// getters
const getters = {
  getProjectDescriptionData: state => state.projectDescriptionData,  // 项目描述
  getQualificationAuditData: state => state.qualificationAuditData  // 资质审核
}

// actions
const actions = {
  getProjectDescription: ({ commit }, { id }) => {  // 项目描述
    return new Promise((resolve, reject) => {
      postAjax({
        url: projectDescriptionApi,
        data: {
          productId: id
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setProjectDescription', res.data.result)
          resolve(res)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  },
  getQualificationAudit: ({ commit }, { id }) => {  // 资质审核
    return new Promise((resolve, reject) => {
      postAjax({
        url: qualificationAuditApi,
        data: {
          productId: id
        }
      }).then((res) => {
        if (res.data.success) {
          commit('setQualificationAudit', res.data.result.qualificationAuditList)
          resolve(res.data.result.qualificationAuditList)
        } else {
          console.log(res.data.errorMsg)
        }
      })
    })
  }
}

// mutations
const mutations = {
  setProjectDescription (state, data) {
    state.projectDescriptionData = data
  },
  setQualificationAudit (state, data) {
    state.qualificationAuditData = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
