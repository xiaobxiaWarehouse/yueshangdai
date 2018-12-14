<template>
  <div class="resetPw-wrap header-occupy">
    <x-header :left-options="{backText: ''}">重置登录密码</x-header>
    <div class="register-form">
      <form class="page-form">
        <LumpListBox borderType="border-bottom">
          <label class="label fl mr72" slot="left"><span class="icon icon-pw"></span></label>
          <div class="form-box fl" slot="center">
            <div class="item">
              <div class="left">
                <input :type="seeStatus ? 'text' : 'password'" v-model="newLoginPassword" class="form-control form-text" placeholder="请输入新登录密码">
              </div>
              <div class="right" v-if="newLoginPassword"><span :class="'icon' + ' icon-see-' + (seeStatus ? 'show' : 'hide')" @click="triggerSeeStatusHandle"></span></div>
            </div>
          </div>
        </LumpListBox>
        <LumpListBox borderType="border-bottom">
          <label class="label fl mr72" slot="left"><span class="icon icon-rePw"></span></label>
          <div class="form-box fl" slot="center">
            <input :type="seeStatus ? 'text' : 'password'" v-model="rePassword" class="form-control form-text" placeholder="请再次输入新密码">
          </div>
        </LumpListBox>
      </form>
      <div class="msg-hint">密码长度必须包含8-16位数字和字母</div>
      <div class="buy-btn">
        <SubBtn :status="btnActive" @click.native="registerHandle">完成</SubBtn>
      </div>
      <toast v-model="hintPopShow" type="text" :text="hintPopText" width="12rem" :time="3000"></toast>
    </div>
    <div v-transfer-dom>
      <loading :show="resetHintShow" text="重置中"></loading>
    </div>
  </div>
</template>

<script>
  import { XHeader, Toast, Loading, TransferDom } from 'vux'
  import { Base64 } from 'js-base64'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import InputSeeTrigger from '@/components/other/InputSeeTrigger'
  import SubBtn from '@/components/user/SubBtn'

  const Util = require('@/assets/js/util')

  let formFlag = true // 防止多次提交表单

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      LumpListBox,
      InputSeeTrigger,
      SubBtn,
      Toast,
      Loading
    },
    data () {
      return {
        newLoginPassword: '',
        rePassword: '',
        btnActive: false,
        seeStatus: false,
        hintPopText: '恭喜您，重置密码成功。3s后跳转至登录页面',
        hintPopShow: false,
        resetHintShow: false,
        timer: null
      }
    },
    watch: {
      newLoginPassword: function () {
        this.newLoginPassword = Util.trim(this.newLoginPassword)
        this.triggeBtnActive()
      },
      rePassword: function () {
        this.rePassword = Util.trim(this.rePassword)
        this.triggeBtnActive()
      }
    },
    beforeCreate: function () {
      if (!Util.getSessionStorage('mobileNo')) {
        Util.setSessionStorage('mobileNo', this.$route.params.mobileNo)
      }
      if (!Util.getSessionStorage('code')) {
        Util.setSessionStorage('code', this.$route.params.code)
      }
    },
    destroyed: function () {
      Util.removeSessionStorage('mobileNo').removeSessionStorage('code')
      // 清除定时器（注册成功提示）
      this.timer && clearInterval(this.timer)
    },
    methods: {
      triggerSeeStatusHandle () {
        this.seeStatus = !this.seeStatus
      },
      checkParentTriggerHandle: function (val) {
        this.protocol = val
      },
      registerHandle: function () {
        if (!formFlag) return false
        // 验证
        if (!this.verificationHandle()) return false
        formFlag = false
        this.resetHintShow = true
        // 提交
        this.$http.post('/api/resetLoginPsw', {
          mobileNo: Util.getSessionStorage('mobileNo'),
          code: Util.getSessionStorage('code'),
          type: '001',
          newLoginPassword: Base64.encode(this.newLoginPassword)
        }).then((rs) => {
          if (rs.data.success) {
            // 显示注册成功提示
            this.resetHintShow = false
            this.hintPopShow = true
            this.changeTime(() => {
              formFlag = true
              this.$router.push({ name: 'Login', params: { backPage: 'Home' } })
            })
          } else {
            this.resetHintShow = false
            formFlag = true
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: rs.data.errorMsg,
              position: 'middle'
            })
            return false
          }
        })
      },
      triggeBtnActive: function () {
        this.btnActive = !!this.newLoginPassword && !!this.rePassword
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
            this.hintPopText = `恭喜您，重置密码成功。${time}s后跳转至登录页面`
          }
        }, 1000)
      },
      verificationHandle: function () {
        if (!this.newLoginPassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入登录密码',
            position: 'middle'
          })
          return false
        }
        if (!Util.isPw(this.newLoginPassword)) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '登录密码格式不正确',
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
        if (this.newLoginPassword !== this.rePassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '两次输入密码不一致',
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
    .msg-hint {
      padding: 0.4rem 0.8rem 0;
      color: @t-three-color;
      font-size: @f21;
    }
  }
</style>
