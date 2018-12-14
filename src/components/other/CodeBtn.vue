<template>
    <div class="code-btn"><span :class="status && active ? 'acitve' : ''" @click="getCodeHandle">{{text}}</span></div>
</template>

<script>
  const Util = require('@/assets/js/util')

  export default {
    props: ['status', 'phone', 'url', 'noteType'],
    data () {
      return {
        active: true,
        text: '获取验证码',
        timer: null
      }
    },
    destroyed () {
      // 清除定时器（注册成功提示）
      this.timer && clearInterval(this.timer)
    },
    methods: {
      getCodeHandle: function () {
        if (!this.phone) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入手机号码',
            position: 'middle'
          })
          return false
        }
        if (!Util.isPhoneNum(this.phone)) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '手机格式不正确',
            position: 'middle'
          })
          return false
        }
        if (!this.status) return false
        if (!this.active) return false
        this.$http.post('/api/getCode', {
          mobileNo: this.phone,
          type: this.noteType || '001'
        }).then(rs => {
          let data = rs.data
          if (data.success) {
            this.changeText()
          } else {
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: data.errorMsg,
              position: 'middle'
            })
            return false
          }
        })
      },
      changeText: function () {
        this.active = false
        this.timer && clearInterval(this.timer)
        let time = 60
        this.text = `${time}s后重新获取`
        this.timer = setInterval(() => {
          time--
          if (time <= 0) {
            clearInterval(this.timer)
            this.text = '获取验证码'
            this.active = true
          } else {
            this.text = `${time}s后重新获取`
          }
        }, 1000)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

 .code-btn {
   span {
     font-size: @f30;
     color: @t-three-color;
     &.acitve {
       color: @m-color;
     }
   }
 }
</style>
