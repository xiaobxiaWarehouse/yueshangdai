<template>
  <div class="register-wrap header-occupy">
    <x-header :left-options="{backText: ''}">注册<router-link :to="{ name: 'Login' }" slot="right">登录</router-link></x-header>
    <div class="register-form">
      <form class="page-form">
        <LumpListBox borderType="border-bottom">
          <label class="label fl mr72" slot="left"><span class="icon icon-pw"></span></label>
          <div class="form-box fl" slot="center">
            <div class="item">
              <div class="left">
                <input :type="seeStatus ? 'text' : 'password'" v-model="password" class="form-control form-text" placeholder="请输入登录密码">
              </div>
              <div class="right" v-if="password"><span :class="'icon' + ' icon-see-' + (seeStatus ? 'show' : 'hide')" @click="triggerSeeStatusHandle"></span></div>
            </div>
          </div>
        </LumpListBox>
        <LumpListBox borderType="border-bottom">
          <label class="label fl mr72" slot="left"><span class="icon icon-rePw"></span></label>
          <div class="form-box fl" slot="center">
            <input :type="seeStatus ? 'text' : 'password'" v-model="rePassword" class="form-control form-text" placeholder="请再次输入密码">
          </div>
        </LumpListBox>
      </form>
      <div class="msg-hint">密码长度必须包含8-16位数字和字母</div>
      <div class="buy-btn">
        <SubBtn :status="btnStatus" @click.native="registerHandle">完成</SubBtn>
      </div>
      <div class="register-other"><p class="text"><CheckOne @checkParentTrigger="checkParentTriggerHandle" :status="protocol"></CheckOne>已阅读并同意<router-link  class="a-link" to="/registerProtocol">《注册协议》</router-link></p></div>
      <toast v-model="hintPopStatus" type="text" :text="hintPopText" width="12rem" :time="3000"></toast>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Base64 } from 'js-base64'
  import { XHeader, Toast } from 'vux'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import SubBtn from '@/components/user/SubBtn'
  import CheckOne from '@/components/other/CheckOne'

  const Util = require('@/assets/js/util')

  let formFlag = true // 防止多次提交

  export default {
    components: {
      XHeader,
      LumpListBox,
      SubBtn,
      CheckOne,
      Toast
    },
    data () {
      return {
        password: '',
        rePassword: '',
        protocol: true,
        seeStatus: false,
        btnStatus: false,
        hintPopStatus: false,
        hintPopText: '恭喜您，注册成功，3s后跳转至首页',
        timer: null
      }
    },
    watch: {
      password: function () {
        this.password = Util.trim(this.password)
        this.triggeBtnActive()
      },
      rePassword: function () {
        this.rePassword = Util.trim(this.rePassword)
        this.triggeBtnActive()
      },
      protocol: function () {
        this.triggeBtnActive()
      }
    },
    destroyed: function () {
      // 清除定时器（注册成功提示）
      this.timer && clearInterval(this.timer)
    },
    computed: {
      ...mapGetters({
        params: 'register/getParams',
        loginStatus: 'login/loginStatus'
      })
    },
    methods: {
      triggerSeeStatusHandle () {
        this.seeStatus = !this.seeStatus
      },
      checkParentTriggerHandle: function (val) {
        this.protocol = val
      },
      registerHandle: function () {
        if (!formFlag) {
          return false
        }
        let _this = this
        // 验证
        if (!this.verificationHandle()) return false
        formFlag = false
        // 提交注册
        this.$http.post('/api/register', Object.assign(this.params, { password: Base64.encode(this.password) })).then((rs) => {
          let data = rs.data
          if (data.success) {
            this.hintPopStatus = true
            this.changeTime(() => {
              formFlag = true
              _this.$store.dispatch('login/setUserInfo', data.result)
              _this.$router.push({ name: 'Home' })
            })
          } else {
            formFlag = true
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
      triggeBtnActive: function () {
        this.btnStatus = this.password && this.rePassword && this.protocol
      },
      changeTime: function (callBack) {
        this.timer && clearInterval(this.timer)
        let time = 3
        this.timer = setInterval(() => {
          time--
          if (time <= 0 && callBack) {
            callBack.call()
            clearInterval(this.timer)
          } else {
            this.hintPopText = `恭喜您，注册成功，${time}s后跳转至首页`
          }
        }, 1000)
      },
      verificationHandle: function () {
        if (!this.btnStatus) return false
        if (!this.password) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入登录密码',
            position: 'middle'
          })
          return false
        }
        if (!Util.isPw(this.password)) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '密码必须包含8-16位数字、字母',
            position: 'middle'
          })
          return false
        }
        if (!this.rePassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请再次输入密码',
            position: 'middle'
          })
          return false
        }
        if (this.password !== this.rePassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '两次输入密码不一致',
            position: 'middle'
          })
          return false
        }
        if (!this.protocol) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请阅读并同意注册协议',
            position: 'middle'
          })
          return false
        }
        return true
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .register-form {
    margin-top: 0.53333333rem;
    .form-text{
      width: 7.46666666rem;
      font-size: @f30;
    }
    .form-box {
      position: absolute;
      left: 0;
      width: 100%;
      padding-left: 3.33333333rem;
      padding-right: 0.8rem;
      display: inline-block;
      .item {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
    .buy-btn {
      padding: 0 0.8rem;
      margin: 2.22222222rem 0 1.06666666rem;
    }
  }
  .msg-hint {
    padding: 0.4rem 0.8rem 0;
    color: @t-three-color;
    font-size: @f21;
  }
  button.btn {
    background-color: @noSelect-color;
    border-radius: 21px;
  &-active {
     background-color: @m-color;
   }
  }
  .register-other {
    width: 100%;
    padding: 0 0.8rem;
    overflow: hidden;
    .text {
      font-size: @f21;
      color: @t-two-color;
      .check-one {
        margin-right: 0.26666666rem;
      }
    }
    .a-link {
      color: @m-t-color;
    }
  }
</style>
