export default {
  /*
  * @desc 返回格式化后的手机号码
  * @{String} value
  * @return {String} 188****8888
  * */
  phoneFormat: (value) => {
    if (!value) return ''
    return value.replace(/^(\d{3})(\d{4})/g, (all, $1) => {
      return $1 + '****'
    })
  },
  /*
  * @desc 返回格式化后的金额，且保留两位数字
  * @param {Number | String} s  要格式化的数字
  * @param {Number} n 保留几位小数
  * @return {String} 123,456.05
  * */
  moneyFormat: (s, n) => {
    if (!s) return '0.00'
    let firstStr = ''
    if (typeof s !== 'string') {
      s = s.toString()
    }
    if (s.charAt() === '+' || s.charAt() === '-') {
      firstStr = s.charAt()
      s = s.substring(1)
    }
    n = n > 0 && n <= 20 ? n : 2
    s = parseFloat((s + '').replace(/[^\d.-]/g, '')).toFixed(n) + ''
    let l = s.split('.')[0].split('').reverse()
    let r = s.split('.')[1]
    let t = ''
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
    }
    return firstStr + t.split('').reverse().join('') + '.' + r
  },
  /**
   * 限制最多两位小数
   */
  limitTwoNumber: (num) => {
    if (!num) return ''
    let reg = /^\d+(?:\.\d{2})?$/
    let val = Math.floor(num * 100) / 100
    if (!reg.test(num)) {
      return val
    } else {
      return num || ''
    }
  },
  /**
   * 取整
   */
  parseIntNum: (num) => {
    if (!num) return '0'
    return parseInt(num)
  },
  /**
   * @desc 返回格式化后的银行卡号
   * @param {String} value
   * @return {String} ****8888
   */
  bankCardFormat: (value, str) => {
    if (!value) return ''
    return value.replace(/(.*)(\d{4})$/, (all, $1, $2) => {
      return (str || '****') + $2
    })
  },
  /**
   * @desc 返回格式化后的银行卡号
   * @param {String} value
   * @return {String} 888888****888
   */
  bankCardFormat2: (value) => {
    if (!value) return ''
    let str1 = value.substr(0, 4)
    let str2 = value.substr(-4, 4)
    return str1 + '****' + str2
  },
  /**
   * @desc 返回格式化后的姓名
   * @param {String} value
   * @return 顾**
   */
  nameFormat: (value) => {
    if (!value) return ''
    let len = value.substr(1).length
    let str = value.substr(0, 1)
    for (let i = 0; i < len; i++) {
      str += '*'
    }
    return str
  },
  /**
   * @desc 返回格式化后的身份证号码
   * @param {String} str
   * @return 321***********8888
   */
  idCard: (str) => {
    if (!str) return ''
    return str.substr(0, 3) + '***********' + str.substr(-4)
  },
  /**
   * 对日期进行格式化，
   * @param date 要格式化的日期
   * @param format 进行格式化的模式字符串
   *     支持的模式字母有：
   *     y:年,
   *     M:年中的月份(1-12),
   *     d:月份中的天(1-31),
   *     h:小时(0-23),
   *     m:分(0-59),
   *     s:秒(0-59),
   *     S:毫秒(0-999),
   *     q:季度(1-4)
   * @return String
   */
  dateFormat: (date, format) => {
    date = new Date(date)
    format = format || 'yyyy-MM-dd hh:mm:ss'
    let map = {
      'M': date.getMonth() + 1, // 月份
      'd': date.getDate(), // 日
      'h': date.getHours(), // 小时
      'm': date.getMinutes(), // 分
      's': date.getSeconds(), // 秒
      'q': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
      let v = map[t]
      if (v !== undefined) {
        if (all.length > 1) {
          v = '0' + v
          v = v.substr(v.length - 2)
        }
        return v
      } else if (t === 'y') {
        return (date.getFullYear() + '').substr(4 - all.length)
      }
      return all
    })
    return format
  }
}
