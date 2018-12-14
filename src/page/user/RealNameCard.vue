<template>
  <div class="real-name-card-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">实名绑卡</x-header>
    <div class="real-name-card-form mt24">
      <form class="page-form">
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">姓名</label>
          <div class="form-box fl" slot="center">
            <input type="text" v-model="name" class="form-control form-text" placeholder="请输入真实姓名">
          </div>
        </LumpListBox>
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">身份证号</label>
          <div class="form-box fl" slot="center">
            <input type="text" v-model="identityNumber" class="form-control form-text form-text-auto" placeholder="请输入身份证号码">
          </div>
        </LumpListBox>
        <router-link class="form-link" :to="{ name: 'BankList', params: { id: paramsId, backPage: paramsBackPage } }">
          <LumpListBox borderType="border-bottom">
            <label class="label fl" slot="left">选择银行</label>
            <div class="form-box fl" slot="center">
              <span class="msg-box fl" slot="center" v-if="!bankInfo">请选择银行</span>
              <div class="icon-box fl" slot="center" v-if="!!bankInfo"><span :class="`icon icon-bank icon-bank-${parseInt(bankInfo.bankCode)}`"></span><span class="text">{{bankInfo.bankName}}</span></div>
              <div class="fr" slot="right"><span class="icon icon-arrow-right"></span></div>
            </div>
          </LumpListBox>
        </router-link>
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">银行卡号</label>
          <div class="form-box fl" slot="center">
            <input type="number" v-model="bankNumber" class="form-control form-text form-text-auto" placeholder="请输入银行卡号">
          </div>
        </LumpListBox>
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">预留手机号</label>
          <div class="form-box fl" slot="center">
            <div class="item">
              <div class="left">
                <input type="number" v-model="bankPhone" class="form-control form-text form-text-auto" placeholder="请输入银行预留手机号">
              </div>
              <div class="right">
                <div class="fr" slot="right"><span class="icon icon-ask" @click="hintHandle"></span></div>
              </div>
            </div>
          </div>
        </LumpListBox>
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">验证码</label>
          <div class="form-box fl" slot="center">
            <div class="item">
              <div class="left">
                <input type="number" v-model="code" :maxlength="6" class="form-control form-text" placeholder="请输入手机验证码">
              </div>
              <div class="right">
                <div class="code-btn"><span :class="codeStatus && codeActive ? 'acitve' : ''" @click="getCodeHandle">{{codeText}}</span></div>
              </div>
            </div>
          </div>
        </LumpListBox>
      </form>
      <div class="buy-btn">
        <SubBtn :status="btnStatus" @click.native="submitHandle">提交</SubBtn>
      </div>
      <div v-transfer-dom>
        <alert v-model="showAlert" button-text="我知道了">
          <p class="text-l">银行预留手机号是办理该银行卡时所填写的手机号码。</p>
          <p class="text-l">没有预留、手机号忘记或者已停用，请联系银行客服更新处理。</p>
        </alert>
      </div>
    </div>
    <toast v-model="hintPopStatus" type="text" :text="hintPopText" width="12rem" :time="3000"></toast>
    <div v-transfer-dom>
      <loading :show="realNameHintShow" text="认证中"></loading>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { XHeader, Alert, Loading, TransferDom, Toast } from 'vux'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import RealNameCodeBtn from '@/components/user/RealNameCodeBtn'
  import SubBtn from '@/components/user/SubBtn'
  import postAjax from '@/plugins/PostAjax'

  const Util = require('@/assets/js/util')
  const codeApi = '/api/realNameAuthSms'  // 获取手机验证码接口

  let formFlag = true // 防止多次提交按钮

  export default {
    directives: {
      TransferDom
    },
    components: {
      Loading,
      XHeader,
      LumpListBox,
      RealNameCodeBtn,
      SubBtn,
      Alert,
      Toast
    },
    data () {
      return {
        paramsId: this.$route.params.id,
        paramsBackPage: this.$route.params.backPage,
        realNameHintShow: false,
        identityType: '0',
        signId: null,
        codeActive: true,
        codeText: '获取验证码',
        codeTimer: null,
        showAlert: false,
        hintPopStatus: false,
        hintPopText: '恭喜您，认证成功，3s后返回上一页面',
        hintTimer: null
      }
    },
    created () {
      if (!(this.$route.params.page && this.$route.params.page === 'realNameCard')) {
        this.$store.dispatch('realNameCard/addRealName', {
          name: '',
          identityNumber: '',
          bankNumber: '',
          bankPhone: '',
          code: ''
        })  // 清除表单内容
        this.$store.dispatch('bankList/clearSelectBankInfo')  // 移除选择的银行
        this.$store.dispatch('realNameCard/changeCodeStatus', false)  // 清除验证码状态
        this.$store.dispatch('realNameCard/changeBtnStatus', false)  // 清除按钮状态
      }
    },
    watch: {
      bankPhone () {
        this.bankPhone = this.bankPhone.substr(0, 11)
        this.triggeCodeStatus()
      },
      code () {
        this.code = this.code.substr(0, 6)
        this.changeBtnStatus()
      },
      identityNumber () {
        let len = this.identityNumber.length
        if (len > 18) {
          this.identityNumber = this.identityNumber.substr(0, 18)
        }
      }
    },
    computed: {
      ...mapGetters({
        bankInfo: 'bankList/getSelectBankInfo',
        userInfo: 'login/getUserInfo'
      }),
      name: { // 姓名
        get () {
          return this.$store.state.realNameCard.realNameData.name
        },
        set (value) {
          this.$store.commit('realNameCard/addRealName', { name: value })
        }
      },
      identityNumber: { // 身份证号码
        get () {
          return this.$store.state.realNameCard.realNameData.identityNumber
        },
        set (value) {
          this.$store.commit('realNameCard/addRealName', { identityNumber: value })
        }
      },
      bankNumber: { // 银行卡号
        get () {
          return this.$store.state.realNameCard.realNameData.bankNumber
        },
        set (value) {
          this.$store.commit('realNameCard/addRealName', { bankNumber: value })
        }
      },
      bankPhone: { // 手机号码
        get () {
          return this.$store.state.realNameCard.realNameData.bankPhone
        },
        set (value) {
          this.$store.commit('realNameCard/addRealName', { bankPhone: value })
        }
      },
      code: { // 手机验证码
        get () {
          return this.$store.state.realNameCard.realNameData.code
        },
        set (value) {
          this.$store.commit('realNameCard/addRealName', { code: value })
        }
      },
      codeStatus: { // 获取手机验证码状态
        get () {
          return this.$store.state.realNameCard.codeStatus
        }
      },
      btnStatus: {
        get () {
          return this.$store.state.realNameCard.btnStatus
        }
      }
    },
    destroyed () {
      // 清除定时器（验证码提示）
      this.codeTimer && clearInterval(this.codeTimer)
      // 清除定时器（成功提示）
      this.hintTimer && clearInterval(this.hintTimer)
    },
    methods: {
      submitHandle () {
        if (!formFlag) {
          return false
        }
        // 验证
        if (!this.verificationHandle()) return false
        formFlag = false
        this.realNameHintShow = true  // 提示认证中
        // 实名认证
        postAjax({
          url: '/api/realNameAuth',
          data: {
            signId: this.signId,
            code: this.code
          }
        }).then((res) => {
          let id = this.paramsId
          let backPage = this.paramsBackPage
          if (res.data.success) { // 认证成功
            this.realNameHintShow = false // 隐藏认证中
            // 更新用户信息
            this.$store.dispatch('login/updateUserInfo')
            // 提示用户是否设置交易密码
            if (!this.userInfo.data.realNameAuth) {  // 没有设置交易密码，去设置
              let _this = this
              // 质询是否设置交易密码
              this.$vux.confirm.show({
                content: '您还未设置交易密码？',
                confirmText: '去设置',
                onConfirm () {
                  formFlag = true
                  _this.$router.push({ name: 'DealPwSet', params: { backPage: 'User' } })
                },
                onCancel () {
                  formFlag = true
                  if (backPage) {
                    if (id) {
                      _this.$router.push({ name: backPage, params: { id: id } })
                      return false
                    }
                    _this.$router.push({ name: backPage })
                  } else {
                    _this.$router.push({ name: 'AccountSet' })
                  }
                }
              })
              return false
            } else {
              this.hintPopStatus = true
              // 倒计时提示
              this.changeHintTime(() => {
                formFlag = true

                if (backPage) {
                  if (id) {
                    this.$router.push({ name: backPage, params: { id: id } })
                    return false
                  }
                  this.$router.push({ name: backPage })
                } else {
                  this.$router.push({ name: 'AccountSet' })
                }
              })
            }
          } else {  // 认证失败
            formFlag = true
            this.realNameHintShow = false // 隐藏认证中
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: res.data.errorMsg,
              position: 'middle'
            })
          }
        })
      },
      getCodeHandle: function () {  // 获取手机验证码（实名认证银行发送短信）
        // 验证表单是否填写
        if (!this.verificationCodeHandle()) return false
        if (!this.codeStatus) return false
        if (!this.codeActive) return false
        postAjax({
          url: codeApi,
          data: {
            name: this.name,
            identityType: this.identityType,
            identityNumber: this.identityNumber,
            bankCode: this.bankInfo.bankCode,
            bankNumber: this.bankNumber,
            bankPhone: this.bankPhone
          }
        }).then(rs => {
          let data = rs.data
          if (data.success) {
            this.signId = data.result.signId
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
        this.codeActive = false
        this.codetTimer && clearInterval(this.codeTimer)
        let time = 60
        this.codeText = `${time}s后重新获取`
        this.codeTimer = setInterval(() => {
          time--
          if (time <= 0) {
            clearInterval(this.codeTimer)
            this.codeText = '获取验证码'
            this.codeActive = true
          } else {
            this.codeText = `${time}s后重新获取`
          }
        }, 1000)
      },
      changeHintTime: function (callBack) {
        this.hintTimer && clearInterval(this.hintTimer)
        let time = 3
        this.hintTimer = setInterval(() => {
          time--
          if (time <= 0) {
            clearInterval(this.hintTimer)
            callBack && callBack.call()
          } else {
            this.hintPopText = `恭喜您，认证成功，${time}s后返回上一页`
          }
        }, 1000)
      },
      triggeCodeStatus () { // 设置手机验证码状态
        this.$store.commit('realNameCard/changeCodeStatus', Util.isPhoneNum(this.bankPhone))
      },
      changeBtnStatus: function () {  // 提交按钮的状态
        this.$store.commit('realNameCard/changeBtnStatus', (!!this.name && !!this.identityNumber && !!this.bankNumber && !!this.bankPhone && !!this.code))
      },
      hintHandle () { // 疑问提示
        this.showAlert = true
      },
      verificationHandle () {
        if (!this.btnStatus) return false
        // 验证表单是否填写
        if (!this.verificationCodeHandle()) return false
        if (!this.signId) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请获取手机验证码',
            position: 'middle'
          })
          return false
        }
        if (!this.code) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入手机验证码',
            position: 'middle'
          })
          return false
        }
        return true
      },
      verificationCodeHandle () {
        if (!this.name) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入真实姓名',
            position: 'middle'
          })
          return false
        }
        if (!this.identityNumber) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入身份证号码',
            position: 'middle'
          })
          return false
        }
        if (!this.bankNumber) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入银行卡号',
            position: 'middle'
          })
          return false
        }
        if (!this.bankInfo) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入选择银行',
            position: 'middle'
          })
          return false
        }
        if (!this.bankPhone) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入银行预存手机号',
            position: 'middle'
          })
          return false
        }
        if (!Util.isPhoneNum(this.bankPhone)) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '手机格式不正确',
            position: 'middle'
          })
          return false
        }
        return true
      },
      backHandle () {
        let id = this.paramsId
        let backPage = this.paramsBackPage
        if (backPage) {
          if (id) {
            this.$router.push({ name: backPage, params: { id: id } })
            return false
          }
          this.$router.push({ name: backPage })
          return false
        }
        this.$router.push({ name: 'AccountSet' })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .real-name-card-form {
    .form-link {
      display: block;
      width: 100%;
      height: 2.08888888rem;
      overflow: hidden;
    }
    .label {
      width: 4.32850241rem;
    }
    .text {
      font-size: @f30;
    }
    .msg-box {
      padding: 0 0.2rem;
      font-size: @f30;
      color: @t-three-color;
    }
    .icon-box {
      .icon {
        margin-right: 0.53333333rem;
      }
    }
    .form-text {
      width: 6.22222222rem;
      font-size: @f30;
      &-auto {
        width: auto;
      }
    }
    .form-text-auto {
      width: auto;
    }
    .form-box {
      position: absolute;
      left: 0;
      width: 100%;
      padding-left: 4.35555555rem;
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
    .code-btn {
      span {
        font-size: @f30;
        color: @t-three-color;
        &.acitve {
          color: @m-color;
        }
      }
    }
  }
</style>
