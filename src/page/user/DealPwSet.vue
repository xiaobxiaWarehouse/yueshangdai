<template>
  <div class="deal-pw-set-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">设置交易密码</x-header>
    <div class="content">
      <div class="title">
        <span class="h">注册手机号</span>
        <strong>{{userInfo.data.mobileNo | phoneFormat}}</strong>
      </div>
      <div class="deal-pw-set-wrap-form">
        <form class="page-form">
          <LumpListBox borderType="border-bottom">
            <label class="label fl" slot="left">验证码</label>
            <div class="form-box fl" slot="center">
              <div class="item">
                <div class="left">
                  <input type="text" v-model="code" :maxlength="6" class="form-control form-text" placeholder="请输入手机验证码">
                </div>
                <div class="right">
                  <CodeBtn :status="codeStatus" :phone="userInfo.data.mobileNo" slot="right"></CodeBtn>
                </div>
              </div>
            </div>
          </LumpListBox>
          <LumpListBox borderType="border-bottom">
            <label class="label fl" slot="left">交易密码</label>
            <div class="form-box fl" slot="center">
              <div class="item">
                <div class="left">
                  <input :type="seeStatus ? 'number' : 'password'" v-model="tradePassword" :maxlength="6" class="form-control form-text form-text-auto" placeholder="请输入6位数交易密码">
                </div>
                <div class="right" v-if="tradePassword"><span :class="'icon' + ' icon-see-' + (seeStatus ? 'show' : 'hide')" @click="triggerSeeStatusHandle"></span></div>
              </div>
            </div>
          </LumpListBox>
          <LumpListBox borderType="border-bottom">
            <label class="label fl" slot="left">确认密码</label>
            <div class="form-box fl" slot="center">
              <input :type="seeStatus ? 'number' : 'password'" v-model="reTradePassword" :maxlength="6" class="form-control form-text form-text-auto" placeholder="请确认交易密码">
            </div>
          </LumpListBox>
        </form>
        <div class="buy-btn">
          <SubBtn :status="btnStatus" @click.native="submitHandle">提交</SubBtn>
        </div>
      </div>
    </div>
    <toast v-model="hintPopStatus" type="text" :text="hintPopText" width="12rem" :time="3000"></toast>
    <div v-transfer-dom>
      <loading :show="dealPwSetHintShow" text="设置中..."></loading>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Base64 } from 'js-base64'
  import { XHeader, Toast, Loading, TransferDom } from 'vux'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import CodeBtn from '@/components/other/CodeBtn'
  import SubBtn from '@/components/user/SubBtn'
  import postAjax from '@/plugins/PostAjax'

  const Util = require('@/assets/js/util')

  const apiUrl = '/api/setTradePassword'

  let formFlag = true // 防止多次提交

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      LumpListBox,
      CodeBtn,
      SubBtn,
      Toast,
      Loading
    },
    data () {
      return {
        paramsId: this.$route.params.id,
        paramsBackPage: this.$route.params.backPage,
        code: '',
        tradePassword: '',
        reTradePassword: '',
        type: '001',
        codeStatus: true,
        seeStatus: false,
        btnStatus: false,
        hintPopStatus: false,
        hintPopText: '恭喜您，设置成功，3s后跳转至上一页面',
        hintTimer: null,
        dealPwSetHintShow: false
      }
    },
    watch: {
      code () {
        this.code = this.code.substr(0, 6)
        this.changeBtnStatus()
      },
      tradePassword () {
        this.tradePassword = this.tradePassword.substr(0, 6)
        this.changeBtnStatus()
      },
      reTradePassword () {
        this.reTradePassword = this.reTradePassword.substr(0, 6)
        this.changeBtnStatus()
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'login/getUserInfo'
      })
    },
    destroyed () {
      // 清除定时器（成功提示）
      this.hintTimer && clearInterval(this.hintTimer)
    },
    methods: {
      changeBtnStatus () {
        this.btnStatus = !!this.code && !!this.tradePassword && !!this.reTradePassword
      },
      submitHandle () {
        if (!formFlag) {
          return false
        }
        // 验证
        if (!this.verificationHandle()) return false
         // 校验手机验证码
        this.$http.post('/api/checkCode', {
          mobileNo: this.userInfo.data.mobileNo,
          code: this.code,
          type: '001'
        }).then((rs) => {
          if (rs.data.success) {
            formFlag = false
            this.dealPwSetHintShow = true
            // 设置交易密码
            postAjax({
              url: apiUrl,
              data: {
                mobileNo: this.userInfo.data.mobileNo,
                code: this.code,
                tradePassword: Base64.encode(this.tradePassword),
                type: this.type
              }
            }).then((res) => {
              let data = res.data
              let id = this.paramsId
              let backPage = this.paramsBackPage
              if (data.success) {
                this.hintPopStatus = true
                this.dealPwSetHintShow = false
                this.$store.dispatch('login/updateUserInfo')  // 更新用户信息
                this.changeHintTime(() => {
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
              } else {
                formFlag = true
                this.dealPwSetHintShow = false
                this.$vux.toast.show({
                  type: 'text',
                  width: '15em',
                  text: data.errorMsg,
                  position: 'middle'
                })
                return false
              }
            })
          } else {
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: rs.data.errorMsg,
              position: 'middle'
            })
          }
        })
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
            this.hintPopText = `恭喜您，设置成功，${time}s后跳转至上一页`
          }
        }, 1000)
      },
      triggerSeeStatusHandle () {
        this.seeStatus = !this.seeStatus
      },
      verificationHandle () {
        if (!this.btnStatus) return false
        if (!this.code) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入手机验证码',
            position: 'middle'
          })
          return false
        }
        if (this.code.length !== 6) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入6位数字的验证码',
            position: 'middle'
          })
          return false
        }
        if (!this.tradePassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入交易密码',
            position: 'middle'
          })
          return false
        }
        if (!Util.isTradePassword(this.tradePassword)) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '交易密码为6位数字',
            position: 'middle'
          })
          return false
        }
        if (this.tradePassword !== this.reTradePassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '两次输入的交易密码不一致',
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
  .deal-pw-set-wrap {
    .content {
      .title {
        width: 100%;
        padding: 0.8rem;
        text-align: center;
        .h {
          font-size: @f21;
          color: @t-two-color;
        }
        strong {
          display: block;
          margin-top: 0.35555555rem;
          font-size: @f36;
        }
      }
    }
    &-form {
      .label {
        width: 4.26666666rem;
      }
      .form-text{
        width: 6.22222222rem;
        font-size: @f30;
        &-auto {
          width: auto;
        }
      }
      .form-box {
        position: absolute;
        left: 0;
        width: 100%;
        padding-left: 4.11111111rem;
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
  }
</style>
