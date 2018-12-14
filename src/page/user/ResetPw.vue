<template>
  <div class="resetPw-wrap header-occupy">
    <x-header :left-options="{backText: ''}">重置登录密码</x-header>
    <div class="register-form">
      <form class="page-form">
        <LumpListBox borderType="border-bottom">
          <label class="label fl mr72" slot="left"><span class="icon icon-phone"></span></label>
          <div class="form-box fl" slot="center">
            <input type="number" v-model="mobileNo" class="form-control form-text" :maxlength="11" placeholder="请输入手机号码">
          </div>
        </LumpListBox>
        <LumpListBox class="code-wrap" borderType="border-bottom">
          <label class="label fl mr72" slot="left"><span class="icon icon-pw"></span></label>
          <div class="form-box fl" slot="center">
            <div class="item">
              <div class="left">
                <input type="text" v-model="code" :maxlength="6" class="form-control form-text" placeholder="请输入手机验证码">
              </div>
              <div class="right">
                <CodeBtn :status="codeStatus" :phone="mobileNo" :noteType="noteType" slot="right"></CodeBtn>
              </div>
            </div>
          </div>
        </LumpListBox>
      </form>
      <div class="buy-btn">
        <SubBtn :status="btnStatus" @click.native="nextHandle">下一步</SubBtn>
      </div>
    </div>
  </div>
</template>

<script>
  import { XHeader } from 'vux'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import CodeBtn from '@/components/other/CodeBtn'
  import SubBtn from '@/components/user/SubBtn'

  const Util = require('@/assets/js/util')

  export default {
    components: {
      XHeader,
      LumpListBox,
      CodeBtn,
      SubBtn
    },
    data () {
      return {
        mobileNo: '',
        code: '',
        noteType: '001',
        codeStatus: false,
        btnStatus: false
      }
    },
    watch: {
      mobileNo: function () {
        this.mobileNo = this.mobileNo.substr(0, 11)
        this.triggeCodeStatus()
        this.triggeBtnStatus()
      },
      code: function () {
        this.triggeBtnStatus()
      }
    },
    methods: {
      checkParentTriggerHandle: function (val) {
        this.protocol = val
      },
      nextHandle: function () {
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
        if (!this.code) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入验证码',
            position: 'middle'
          })
          return false
        }
        // 校验手机验证码
        this.$http.post('/api/checkCode', {
          mobileNo: this.mobileNo,
          code: this.code,
          type: '001'
        }).then((rs) => {
          if (rs.data.success) {
            // 点下一步，跳转完成注册
            let params = {
              mobileNo: this.mobileNo,
              code: this.code
            }
            this.$router.push({ name: 'ResetPwSet', params: params })
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
        this.btnStatus = !!this.mobileNo && !!this.code
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .register-form {
    margin-top: 0.53333333rem;
    .code-wrap {
      display: flex;
    }
    .form-text {
      width: 6.66666666rem;
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
      margin: 2.57777777rem 0 1.06666666rem;
    }
  }
</style>
