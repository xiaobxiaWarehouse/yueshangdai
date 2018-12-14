/**
 * 设置html的fontSize
 *
 */
export function init () {
  setSize()
  window.addEventListener('resize', setSize, false)
  window.addEventListener('orientationchange', setSize, false)

  function setSize () {
    let html = document.getElementsByTagName('html')[0]
    let width = html.getBoundingClientRect().width
    html.style.fontSize = width / 16 + 'px'
  }
}

/**
 * 设置sessionStorage
 *
 */
export function setSessionStorage (key, value) {
  sessionStorage.setItem(key, value)
}

/**
 * 获取sessionStorage
 *
 */
export function getSessionStorage (key) {
  let value = sessionStorage.getItem(key)
  return !value ? '' : decodeURIComponent(value)
}

/**
 * 删除sessionStorage
 *
 */
export function removeSessionStorage (key) {
  if (sessionStorage.getItem(key)) {
    sessionStorage.removeItem(key)
    return this
  }
  return false
}

/**
 * 去空格
 * */
export function trim (str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
/**
 * 限制最多两位小数
 */
export function limitTwoNumber (num) {
  if (!num) return ''
  let reg = /^\d+(?:\.\d{2})?$/
  let val = Math.floor(num * 100) / 100
  if (!reg.test(num)) {
    return val
  } else {
    return num || ''
  }
}

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
export function dateFormat (date, format) {
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

/**
 *
 * @desc   判断是否为手机号
 * @param  {String|Number} str
 * @return {Boolean}
 */
export function isPhoneNum (str) {
  return /^(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$/.test(str)
}

/**
 * @desc   登录密码规格
 * @parem  {String|Number} str
 * @return {Boolean}
 */
export function isPw (str) {
  return /^(?![^a-zA-Z]+$)(?!\D+$).{8,16}$/.test(str)
}

/**
 * @desc   交易密码规格
 * @parem  {String|Number} str
 * @return {Boolean}
 */
export function isTradePassword (str) {
  return /^\d{6}$/g.test(str)
}

/**
 *
 * @desc  判断是否为身份证号
 * @param  {String|Number} str
 * @return {Boolean}
 */
export function isIdCard (str) {
  return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str)
}

/**
 *
 * @desc   判断是否为邮箱地址
 * @param  {String}  str
 * @return {Boolean}
 */
export function isEmail (str) {
  return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(str)
}

/**
 * @desc   合并对象数组并根据字段去重
 * @param {Array} m 参考数组
 * @param {Array} t 目标数组
 * @param {String} field 对象字段
 * @return {Array} 返回目标数组不重复部分
 */
export function mergerRepeatArrObject (m, t, field) {
  if (!t.length) return t
  if (field) {
    let c = []
    m.map((bObj, index) => {
      let f = true
      t.map((aObj) => {
        if (aObj[field] === bObj[field]) {
          f = false
        }
      })
      if (f) {
        c.push(m[index])
      }
    })
    return c
  }
}

/**
 * @desc floatAdd 加法精确值
 * @param {Number} arg1
 * @param {Number} arg2
 * @return {Number}
 */
export function floatAdd (a, b) {
  let c
  let d
  let e
  try {
    c = a.toString().split('.')[1].length
  } catch (f) {
    c = 0
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) {
    d = 0
  }
  e = Math.pow(10, Math.max(c, d))
  return (this.floatMul(a, e) + this.floatMul(b, e)) / e
}

/**
 * @desc floatSub 减法精确值
 * @param {Number} arg1
 * @param {Number} arg2
 * @return {Number}
 */
export function floatSub (a, b) {
  let c
  let d
  let e
  try {
    c = a.toString().split('.')[1].length
  } catch (f) {
    c = 0
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) {
    d = 0
  }
  e = Math.pow(10, Math.max(c, d))
  return (this.floatMul(a, e) - this.floatMul(b, e)) / e
}

/**
 * @desc floatMul 乘法精确值
 * @param {Number} arg1
 * @param {Number} arg2
 * @return {Number}
 */
export function floatMul (a, b) {
  let c = 0
  let d = a.toString()
  let e = b.toString()
  try {
    c += d.split('.')[1].length
  } catch (f) {

  }
  try {
    c += e.split('.')[1].length
  } catch (f) {

  }
  return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c)
}

/**
 * @desc floatDiv 除法精确值
 * @param {Number} arg1
 * @param {Number} arg2
 * @return {Number}
 */
export function floatDiv (a, b) {
  let c
  let d
  let e = 0
  let f = 0
  try {
    e = a.toString().split('.')[1].length
  } catch (g) {

  }
  try {
    f = b.toString().split('.')[1].length
  } catch (g) {

  }
  c = Number(a.toString().replace('.', ''))
  d = Number(b.toString().replace('.', ''))
  return this.floatMul(c / d, Math.pow(10, f - e))
}

/**
 * @name isLeapYear
 * @desc 判断是闰年还是平年
 * @param {Number} year
 * @return {Boolean}
 */
export function isLeapYear (year) {
  let b1 = year % 4 === 0
  let b2 = year % 100 !== 0
  let b3 = year % 400 === 0
  return (b1 && b2) || b3
}

export function getInvestDay (limit, limitUnit) {
  if (limitUnit === '0') {  // 天
    return parseInt(limit)
  }
  if (limitUnit === '1') {  // 月
    return floatMul(parseInt(limit), 30)
  }
  if (limitUnit === '2') {  // 年
    return floatMul(parseInt(limit), 360)
  }
  return 0
}
