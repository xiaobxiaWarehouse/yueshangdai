import axios from 'axios'
import { Base64 } from 'js-base64'
import config from '@/config'

const Util = require('@/assets/js/util')

axios.defaults.baseURL = config.host

export default ({ url = '', data = null, opts = {} }) => {
  let toKen = Util.getSessionStorage('toKen') ? Base64.decode(Util.getSessionStorage('toKen')) : ''
  let options = Object.assign({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'accessToken': toKen
    }
  }, opts)

  return new Promise((resolve, reject) => {
    axios.post(url, data, options).then((res) => {
      if (!res.data.success && res.data.errorCode === '300001') { // toKen失效（防止多平台登录、登录失效）
        // 清除登录信息
        Util.removeSessionStorage('userInfo')
        Util.removeSessionStorage('toKen')
        setTimeout(() => {
          window.location.href = '/app/index.html#/'
        }, 50)
        return false
      }
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}
