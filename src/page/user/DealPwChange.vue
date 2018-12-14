<template>
  <div class="revise-pw-wrap header-occupy">
    <x-header :left-options="{backText: ''}">修改交易密码</x-header>
    <div class="revise-pw-form mt24">
      <form class="page-form">
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">原交易密码</label>
          <div class="form-box fl" slot="center">
            <div class="item">
              <div class="left">
                <input :type="seeStatus ? 'number' : 'password'" v-model="oldTradePassword" class="form-control form-text" placeholder="请输入原交易密码">
              </div>
              <div class="right" v-if="oldTradePassword"><span :class="'icon' + ' icon-see-' + (seeStatus ? 'show' : 'hide')" @click="triggerSeeStatusHandle"></span></div>
            </div>
          </div>
        </LumpListBox>
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">新交易密码</label>
          <div class="input-see-box fl" slot="center">
            <input :type="seeStatus ? 'number' : 'password'" v-model="newTradePassword" :maxlength="6" class="form-control form-text" placeholder="请输入6位新交易密码">
          </div>
        </LumpListBox>
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">确认新密码</label>
          <div class="input-see-box fl" slot="center">
            <input :type="seeStatus ? 'number' : 'password'" v-model="reNewTradePassword" :maxlength="6" class="form-control form-text" placeholder="请确认新交易密码">
          </div>
        </LumpListBox>
      </form>
      <div class="buy-btn">
        <SubBtn :status="btnStatus" @click.native="submitHandle">提交</SubBtn>
      </div>
      <div class="link-box"><router-link to="/user/dealPwFind" class="a-link fr">忘记交易密码？</router-link></div>
    </div>
    <toast v-model="hintPopStatus" type="text" :text="hintPopText" width="12rem" :time="3000"></toast>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64'
  import { XHeader, Toast } from 'vux'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import SubBtn from '@/components/user/SubBtn'

  import postAjax from '@/plugins/PostAjax'

  const Util = require('@/assets/js/util')

  const apiUrl = '/api/modifyTradePassword'

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
        oldTradePassword: '',
        newTradePassword: '',
        reNewTradePassword: '',
        seeStatus: false,
        btnStatus: false,
        hintPopStatus: false,
        hintPopText: '设置成功，3s后自动返回账户设置页面',
        hintTimer: null
      }
    },
    watch: {
      oldTradePassword () {
        this.oldTradePassword = this.oldTradePassword.substring(0, 6)
        this.changeBtnStatus()
      },
      newTradePassword () {
        this.newTradePassword = this.newTradePassword.substring(0, 6)
        this.changeBtnStatus()
      },
      reNewTradePassword () {
        this.reNewTradePassword = this.reNewTradePassword.substring(0, 6)
        this.changeBtnStatus()
      }
    },
    methods: {
      submitHandle () {
        if (!formFlag) return false
        // 验证
        if (!this.verificationHandle()) return false
        formFlag = false
        postAjax({
          url: apiUrl,
          data: {
            oldTradePassword: Base64.encode(this.oldTradePassword),
            newTradePassword: Base64.encode(this.newTradePassword)
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
            if (data.errorCode === '300006') {
              this.$vux.toast.show({
                type: 'text',
                width: '15em',
                text: '原交易密码错误',
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
      changeBtnStatus () {
        this.btnStatus = !!this.oldTradePassword && !!this.newTradePassword && !!this.reNewTradePassword
      },
      triggerSeeStatusHandle () {
        this.seeStatus = !this.seeStatus
      },
      changeTime: function (callBack) {
        this.hintTimer && clearInterval(this.hintTimer)
        let time = 3
        this.hintTimer = setInterval(() => {
          time--
          if (time <= 0 && callBack) {
            callBack.call()
            clearInterval(this.hintTimer)
          } else {
            this.hintPopText = `设置成功，${time}s后自动返回账户设置页面`
          }
        }, 1000)
      },
      verificationHandle () {
        if (!this.btnStatus) return false
        if (!this.oldTradePassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入原交易密码',
            position: 'middle'
          })
          return false
        }
        if (!this.newTradePassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入新交易密码',
            position: 'middle'
          })
          return false
        }
        if (this.newTradePassword === this.oldTradePassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '新密码不能与原密码相同',
            position: 'middle'
          })
          return false
        }
        if (!Util.isTradePassword(this.newTradePassword)) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '密码必须由6位数字组成',
            position: 'middle'
          })
          return false
        }
        if (this.newTradePassword !== this.reNewTradePassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '新密码两次输入不一致',
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
    .buy-btn {
      padding: 0 0.8rem;
      margin: 1.64444444rem 0 1.06666666rem;
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
  }
</style>
