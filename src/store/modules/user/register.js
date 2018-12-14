import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// state
const state = {
  params: {
    mobileNo: '',
    code: '',
    type: '',
    password: ''
  }
}

// getters
const getters = {
  getParams: (state) => {
    return state.params
  }
}

// actions
const actions = {
  nextStep ({ commit }, params) {
    commit('setParams', params)
  }
}

// mutations
const mutations = {
  setParams (state, params) {
    state.params = Object.assign(state.params, params)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
