<template>
  <div class="revise-pw-wrap header-occupy">
    <x-header :left-options="{backText: ''}">修改登录密码</x-header>
    <div class="revise-pw-form mt24">
      <form class="page-form">
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">原登录密码</label>
          <div class="form-box fl" slot="center">
            <div class="item">
              <div class="left">
                <input :type="seeStatus ? 'text' : 'password'" v-model="oldLoginPassword" class="form-control form-text" placeholder="请输入原登录密码">
              </div>
              <div class="right" v-if="oldLoginPassword"><span :class="'icon' + ' icon-see-' + (seeStatus ? 'show' : 'hide')" @click="triggerSeeStatusHandle"></span></div>
            </div>
          </div>
        </LumpListBox>
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">新登录密码</label>
          <div class="input-see-box fl" slot="center">
            <input :type="seeStatus ? 'text' : 'password'" v-model="newLoginPassword" class="form-control form-text" placeholder="请输入新登录密码">
          </div>
        </LumpListBox>
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">确认新密码</label>
          <div class="input-see-box fl" slot="center">
            <input :type="seeStatus ? 'text' : 'password'" v-model="reNewLoginPassword" class="form-control form-text" placeholder="请确认新登录密码">
          </div>
        </LumpListBox>
      </form>
      <div class="msg-hint">密码长度必须包含8-16位数字和字母</div>
      <div class="buy-btn">
        <SubBtn :status="btnStatus" @click.native="submitHandle">提交</SubBtn>
      </div>
    </div>
    <toast v-model="hintPopStatus" type="text" :text="hintPopText" width="12rem" :time="3000"></toast>
  </div>
</template>

<script>
  import { XHeader, Toast } from 'vux'
  import { Base64 } from 'js-base64'
  import postAjax from '@/plugins/PostAjax'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import SubBtn from '@/components/user/SubBtn'

  const Util = require('@/assets/js/util')

  let formFlag = true // 防止多次提交

  export default {
    components: {
      XHeader,
      LumpListBox,
      SubBtn,
      Toast
    },
    data () {
      return {
        seeStatus: false,
        btnStatus: false,
        oldLoginPassword: '',
        newLoginPassword: '',
        reNewLoginPassword: '',
        hintPopStatus: false,
        hintPopText: '设置成功，3s后跳转到账户设置页面',
        timer: null
      }
    },
    watch: {
      oldLoginPassword () {
        this.oldLoginPassword = Util.trim(this.oldLoginPassword)
        this.changeBtnStatus()
      },
      newLoginPassword () {
        this.newLoginPassword = Util.trim(this.newLoginPassword)
        this.changeBtnStatus()
      },
      reNewLoginPassword () {
        this.reNewLoginPassword = Util.trim(this.reNewLoginPassword)
        this.changeBtnStatus()
      }
    },
    destroyed: function () {
      // 清除定时器（注册成功提示）
      this.timer && clearInterval(this.timer)
    },
    methods: {
      submitHandle () {
        if (!formFlag) return false
        // 验证
        if (!this.verificationHandle()) return false
        formFlag = false
        // 提交
        postAjax({
          url: '/api/modifyLoginPassword',
          data: {
            oldLoginPassword: Base64.encode(this.oldLoginPassword),
            newLoginPassword: Base64.encode(this.newLoginPassword)
          }
        }).then((res) => {
          let data = res.data
          if (data.success) {
            this.hintPopStatus = true
            this.changeTime(() => {
              formFlag = true
              this.$router.push({ name: 'AccountSet' })
            })
          } else {
            formFlag = true
            if (data.errorCode === '300005') {
              this.$vux.toast.show({
                type: 'text',
                width: '15em',
                text: '原登录密码错误',
                position: 'middle'
              })
            } else {
              this.$vux.toast.show({
                type: 'text',
                width: '15em',
                text: data.errorMsg,
                position: 'middle'
              })
            }
            return false
          }
        })
      },
      triggerSeeStatusHandle () {
        this.seeStatus = !this.seeStatus
      },
      changeBtnStatus () {
        this.btnStatus = !!this.oldLoginPassword && !!this.newLoginPassword && !!this.reNewLoginPassword
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
            this.hintPopText = `设置成功，${time}s后跳转到账户设置页面`
          }
        }, 1000)
      },
      verificationHandle () {
        if (!this.btnStatus) return false
        if (!this.oldLoginPassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入原登录密码',
            position: 'middle'
          })
          return false
        }
        if (!this.newLoginPassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入新登录密码',
            position: 'middle'
          })
          return false
        }
        if (this.oldLoginPassword === this.newLoginPassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '16em',
            text: '新密码不能与原密码相同',
            position: 'middle'
          })
          return false
        }
        if (this.newLoginPassword !== this.reNewLoginPassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '新密码两次输入不一致',
            position: 'middle'
          })
          return false
        }
        if (!Util.isPw(this.newLoginPassword)) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '密码必须包含8-16位数字、字母',
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

  .revise-pw-form {
    .label {
      width: 4.26666666rem;
    }
    .form-text{
      width: 7.46666666rem;
      font-size: @f30;
    }
    .form-box {
      position: absolute;
      left: 0;
      width: 100%;
      padding-left: 5.06666666rem;
      padding-right: 0.8rem;
      display: inline-block;
      .item {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
    .msg-hint {
      padding: 0.4rem 0.8rem 0;
      color: @t-three-color;
      font-size: @f21;
    }
    .buy-btn {
      padding: 0 0.8rem;
      margin: 1.64444444rem 0 1.06666666rem;
    }
  }
</style>
