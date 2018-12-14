import Vue from 'vue'
import Vuex from 'vuex'
import postAjax from '@/plugins/PostAjax'

Vue.use(Vuex)

const bannerApi = '/api/bannerList' // banner接口
const recommendStandardApi = '/api/recommendStandard'  // 首页推荐标接口
const platformDataApi = '/api/totalInvest'  // 首页平台数据接口
const messageApi = '/api/messageIsRead' // 是否有未读消息

// initial state
const state = {
  bannerData: [],
  recommendStandardData: {}, // 首页推荐标
  platformData: {},  // 首页平台数据
  messageData: {} // 是否有未读消息
}

// getters
const getters = {
  getBannerData: state => state.bannerData, // banner
  getRecommendStandardData: state => state.recommendStandardData,  // 首页推荐标
  getPlatformData: state => state.platformData,  // 平台数据
  getMessageData: state => state.messageData  // 是否有未读消息
}

// actions
const actions = {
  getBanner: ({ commit }) => {
    return new Promise((resolve, reject) => { // banner
      postAjax({
        url: bannerApi
      }).then((res) => {
        let data = res.data
        if (data.success) {
          commit('setBanner', data.result.bannerList)
          resolve(data.result.bannerList)
        } else {
          console.log(data.errorMsg)
        }
      })
    })
  },
  getRecommendStandard: ({ commit }) => {  // 首页推荐标
    return new Promise((resolve, reject) => {
      postAjax({
        url: recommendStandardApi
      }).then((res) => {
        let data = res.data
        if (data.success) {
          commit('setRecommendStandard', data.result)
          resolve(data.result)
        } else {
          console.log(data.errorMsg)
        }
      })
    })
  },
  getPlatformData: ({ commit }) => {  // 首页平台数据
    return new Promise((resolve, reject) => {
      postAjax({
        url: platformDataApi
      }).then((res) => {
        let data = res.data
        if (data.success) {
          commit('setPlatformData', data.result)
          resolve(data.result)
        } else {
          console.log(data.errorMsg)
        }
      })
    })
  },
  getMessage: ({ commit }) => {
    postAjax({
      url: messageApi
    }).then((res) => {
      let data = res.data
      if (data.success) {
        commit('setMessage', data.result)
      } else {
        console.log(data.errorMsg)
      }
    })
  }
}

// mutations
const mutations = {
  setBanner (state, data) { // banner
    let bannerData = data.map((item, index) => {
      return {
        url: 'javascript:;',
        img: item.imgUrl
      }
    })
    state.bannerData = bannerData
  },
  setRecommendStandard (state, data) {  // 首页推荐标
    state.recommendStandardData = data
  },
  setPlatformData (state, data) { // 首页平台数据
    state.platformData = data
  },
  setMessage (state, data) {
    state.messageData = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
