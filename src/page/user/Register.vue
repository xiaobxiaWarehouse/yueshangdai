<template>
  <div class="register-wrap header-occupy">
    <x-header :left-options="{backText: ''}">注册<router-link :to="{ name: 'Login' }" slot="right">登录</router-link></x-header>
    <div class="register-form">
      <form class="page-form">
        <LumpListBox borderType="border-bottom">
          <label class="label fl mr72" slot="left"><span class="icon icon-phone"></span></label>
          <div class="input-box fl" slot="center">
            <input type="number" v-model="mobileNo" class="form-control form-text" :maxlength="11" placeholder="请输入手机号码" autocomplete="off">
          </div>
        </LumpListBox>
        <LumpListBox borderType="border-bottom">
          <label class="label fl mr72" slot="left"><span class="icon icon-pw"></span></label>
          <div class="form-box fl" slot="center">
            <div class="item">
              <div class="left">
                <input type="number" v-model="code" :maxlength="6" class="form-control form-text" placeholder="请输入手机验证码" autocomplete="off">
              </div>
              <div class="right">
                <CodeBtn :status="codeStatus" :phone="mobileNo" slot="right"></CodeBtn>
              </div>
            </div>
          </div>
        </LumpListBox>
      </form>
      <div class="buy-btn">
        <SubBtn :status="btnStatus" @click.native="nextHandle">下一步</SubBtn>
      </div>
      <div class="register-other"><p class="text"><CheckOne @checkParentTrigger="checkParentTriggerHandle" :status="protocol"></CheckOne>已阅读并同意<router-link  class="a-link" to="/registerProtocol">《注册协议》</router-link></p></div>
    </div>
  </div>
</template>

<script>
  import { XHeader } from 'vux'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import CodeBtn from '@/components/other/CodeBtn'
  import SubBtn from '@/components/user/SubBtn'
  import CheckOne from '@/components/other/CheckOne'

  const Util = require('@/assets/js/util')

  export default {
    components: {
      XHeader,
      LumpListBox,
      CodeBtn,
      SubBtn,
      CheckOne
    },
    data () {
      return {
        mobileNo: '',
        code: '',
        codeStatus: false,
        btnStatus: false,
        protocol: true
      }
    },
    watch: {
      mobileNo: function () {
        this.mobileNo = this.mobileNo.substr(0, 11)
        this.triggeCodeStatus()
        this.triggeBtnStatus()
      },
      code: function () {
        this.code = this.code.substr(0, 6)
        this.triggeBtnStatus()
      },
      protocol: function () {
        this.triggeBtnStatus()
      }
    },
    methods: {
      checkParentTriggerHandle: function (val) {
        this.protocol = val
      },
      nextHandle: function () {
        if (!this.btnStatus) return false
        if (!Util.isPhoneNum(this.mobileNo)) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '手机格式不正确',
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
        let opts = {
          mobileNo: this.mobileNo,
          code: this.code,
          type: '001'
        }
        // 校验手机验证码
        this.$http.post('/api/checkCode', opts).then((rs) => {
          if (rs.data.success) {
            // 设置parems
            this.$store.dispatch('register/nextStep', opts)
            // 跳转到密码设置页面
            this.$router.push({ name: 'RegisterSetPw' })
          } else {
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: rs.data.errorMsg,
              position: 'middle'
            })
          }
        })
        return false
      },
      triggeCodeStatus: function () {
        this.codeStatus = Util.isPhoneNum(this.mobileNo)
      },
      triggeBtnStatus: function () {
        this.btnStatus = !!this.mobileNo && !!this.code && !!this.protocol
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .register-form {
    margin-top: 0.53333333rem;
    .form-text {
      width: 6.66666666rem;
      font-size: @f30;
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
