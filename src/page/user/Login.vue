<template>
  <div class="login-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">登录<router-link :to="{ name: 'Register' }" slot="right">注册</router-link></x-header>
    <div class="login-form">
      <form class="page-form">
        <LumpListBox borderType="border-bottom">
          <label class="label fl mr72" slot="left"><span class="icon icon-phone"></span></label>
          <div class="input-box fl" slot="center">
            <input type="number" v-model="mobileNo" class="form-control text-phone" :maxlength="11" placeholder="请输入手机号码" autocomplete="off">
          </div>
        </LumpListBox>
        <LumpListBox borderType="border-bottom">
          <label class="label fl mr72" slot="left"><span class="icon icon-pw"></span></label>
          <div class="input-see-box" slot="center">
            <InputSeeTrigger @setPwParent="setPwParentHandle" msg="请输入登录密码"></InputSeeTrigger>
          </div>
        </LumpListBox>
      </form>
      <div class="buy-btn">
        <SubBtn :status="btnStatus" @click.native="loginHandle">登录</SubBtn>
      </div>
      <div class="link-box"><router-link to="/resetPw" class="a-link fr">忘记密码？</router-link></div>
    </div>
    <div class="login-bottom">
      <span class="icon icon-redPack"></span>注册领取1088元红包
    </div>
    <div v-transfer-dom>
      <loading :show="loginHintShow" text="登录中"></loading>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Base64 } from 'js-base64'
  import { XHeader, Loading, TransferDom } from 'vux'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import SubBtn from '@/components/user/SubBtn'
  import InputSeeTrigger from '@/components/other/InputSeeTrigger'
  import postAjax from '@/plugins/PostAjax'

  const Util = require('@/assets/js/util')

  let formFalg = true // 防止多次提交

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      LumpListBox,
      InputSeeTrigger,
      SubBtn,
      Loading
    },
    data () {
      return {
        mobileNo: '',
        password: '',
        btnStatus: false,
        loginHintShow: false
      }
    },
    watch: {
      mobileNo: function () {
        this.mobileNo = this.mobileNo.substr(0, 11)
        this.triggeBtnActive()
      },
      password: function () {
        this.password = Util.trim(this.password)
        this.triggeBtnActive()
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'login/getUserInfo'
      })
    },
    methods: {
      setPwParentHandle: function (val) {
        this.password = val
      },
      loginHandle: function () {
        // 防止多次提交
        if (!formFalg) return false
        // 验证
        if (!this.verificationHandle()) return false
        formFalg = false  // 防止多次提交
        this.loginHintShow = true  // 显示登录中
        // 提交
        postAjax({
          url: '/api/login',
          data: {
            mobileNo: this.mobileNo,
            password: Base64.encode(this.password)
          }
        }).then((res) => {
          formFalg = true // 防止多次提交
          let data = res.data
          let id = this.$route.params.id
          let backPage = this.$route.params.backPage
          if (data.success) {
            this.loginHintShow = false  // 隐藏登录中
            this.$store.dispatch('login/setUserInfo', data.result)
            if (backPage) {
              if (id) {
                this.$router.push({ name: backPage, params: { id: id } })
                return false
              }
              this.$router.push({ name: backPage })
            } else {
              this.$router.push({ name: 'Home' }) // 默认登录后跳转到首页
            }
          } else {
            this.loginHintShow = false  // 隐藏登录中
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
        this.btnStatus = this.mobileNo && this.password
      },
      verificationHandle: function () {
        if (!this.btnStatus) return false
        if (!this.mobileNo) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入手机号码',
            position: 'middle'
          })
          return false
        }
        if (!Util.isPhoneNum(this.mobileNo)) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '手机格式不正确',
            position: 'middle'
          })
          return false
        }
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
        return true
      },
      backHandle () {
        let id = this.$route.params.id
        let backPage = this.$route.params.backPage
        if (backPage) {
          if (id) {
            this.$router.push({ name: backPage, params: { id: id } })
            return false
          }
          this.$router.push({ name: backPage })
        } else {
          this.$router.push({ name: 'Home' })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .weui-cells {
    &:before {
      border-top: none;
    }
    &:after {
      border-bottom: none;
    }
  }

  .login-form {
    margin-top: 0.53333333rem;
    .text-phone {
      font-size: @f30;
    }
    .input-see-box {
      position: absolute;
      left: 0;
      width: 100%;
      padding-left: 3.33333333rem;
      padding-right: 0.8rem;
      display: inline-block;
    }
    .buy-btn {
      padding: 0 0.8rem;
      margin: 2.57777777rem 0 1.06666666rem;
    }
  }

  button.btn {
    background-color: @noSelect-color;
    border-radius: 21px;
    &-active {
      background-color: @m-color;
    }
  }

  .link-box {
    width: 100%;
    padding: 0 0.8rem;
    overflow: hidden;
    .a-link {
      font-size: @f30;
      color: @m-t-color;
    }
  }

  .login-bottom {
    width: 100%;
    margin-top: 12.5rem;
    text-align: center;
    font-size: @f30;
    color: @m-color;
  }

</style>
