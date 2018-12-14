import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// initial state
const state = {
  realNameData: {
    name: '',
    identityNumber: '',
    bankNumber: '',
    bankPhone: '',
    code: ''
  },
  codeStatus: false,
  btnStatus: false
}

// getters
const getters = {
  getRealName: state => state.realNameData
}

// actions
const actions = {
  addRealName: ({ commit }, obj) => {
    commit('addRealName', obj)
  },
  changeCodeStatus: ({ commit }, status) => {
    commit('changeCodeStatus', status)
  },
  changeBtnStatus: ({ commit }, status) => {
    commit('changeBtnStatus', status)
  }
}

// mutations
const mutations = {
  addRealName (state, obj) {
    state.realNameData = Object.assign(state.realNameData, obj)
  },
  changeCodeStatus (state, status) {
    state.codeStatus = status
  },
  changeBtnStatus (state, status) {
    state.btnStatus = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
