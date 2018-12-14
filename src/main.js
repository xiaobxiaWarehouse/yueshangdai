// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router'
import store from './store'
import { ToastPlugin, ConfirmPlugin, AjaxPlugin } from 'vux'
import VueScroller from 'vue-scroller'
import Filters from './filters'
import config from '@/config'

FastClick.attach(document.body)

// 设置全局vux的插件
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(AjaxPlugin)
Vue.use(VueScroller)

Vue.http.defaults.baseURL = config.host

// 全局定义过滤器
for (let k of Object.keys(Filters)) {
  Vue.filter(k, Filters[k])
}

Vue.http.defaults.headers.common['version'] = 'v1.0'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
