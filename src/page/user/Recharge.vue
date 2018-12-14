<template>
  <div class="recharge-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">充值<router-link :to="{ name: 'RechargeRecord' }" slot="right">充值记录</router-link></x-header>
    <div class="bank-box border-bottom mt24">
      <div class="top">充值银行卡<router-link class="link" to="/user/limitExplain">限额说明</router-link></div>
      <div class="item">
        <span :class="`icon icon-bank icon-bank-${parseInt(userInfo.data.bankCode)}`"></span>
        <div class="bank-name">{{userInfo.data.bankName}}<span class="tips">（{{userInfo.data.bankNo | bankCardFormat('尾号')}}储蓄卡）</span>
      </div>
      </div>
    </div>
    <div class="form-wrap">
      <form class="page-form">
        <div class="form-chunk border-bottom mt24">
          <h3>充值金额</h3>
          <div class="write-wrap">
            <input type="number" v-model="money" class="form-control form-num" placeholder="请输入充值金额">
          </div>
          <div class="use-money">
            <span class="t">账户余额</span><strong class="num">{{(userInfo.data.availableAmount|| 0) | moneyFormat}}</strong><span class="unit">元</span>
          </div>
        </div>
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">交易密码</label>
          <div class="form-box fl" slot="center">
            <div class="item">
              <div class="left">
                <input type="password" v-model="tradePassword" class="form-control form-text" :maxlength="6" placeholder="请输入交易密码">
              </div>
            </div>
          </div>
        </LumpListBox>
        <div class="text-hint clearfix"><router-link :to="{name: 'DealPwFind', params: { backPage: 'Recharge' }}" class="hint-alink fr">忘记交易密码？</router-link></div>
        <!-- <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">手机号</label>
          <p class="msg-text fl" slot="center">{{userInfo.data.mobileNo | phoneFormat}}</p>
        </LumpListBox>
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">验证码</label>
          <div class="form-box fl" slot="center">
            <div class="item">
              <div class="left">
                <input type="number" v-model="code" class="form-control form-text" :maxlength="6" placeholder="请输入手机验证码">
              </div>
              <div class="right">
                <CodeBtn :status="codeStatus" :noteType="noteType" :phone="userInfo.data.mobileNo" slot="right"></CodeBtn>
              </div>
            </div>
          </div>
        </LumpListBox> -->
      </form>
      <div class="buy-btn">
        <SubBtn :status="btnStatus" @click.native="rechargeHandle">确认充值</SubBtn>
      </div>
    </div>
    <div v-transfer-dom>
      <loading :show="rechargeHintShow" text="充值中"></loading>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { XHeader, Loading, TransferDom } from 'vux'
  import { Base64 } from 'js-base64'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import TriggerInputText from '@/components/other/TriggerInputText.vue'
  import CodeBtn from '@/components/other/CodeBtn'
  import SubBtn from '@/components/user/SubBtn'
  import postAjax from '@/plugins/PostAjax'
  import { setTimeout } from 'timers'

  const Util = require('@/assets/js/util')

  const apiUrl = '/api/recharge'
  const rechargeStatusApi = '/api/rechargeStatus' // 充值状态查询

  let formFlag = true // 防止多次提交

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      LumpListBox,
      TriggerInputText,
      CodeBtn,
      SubBtn,
      Loading
    },
    data () {
      return {
        paramsId: this.$route.params.id,
        paramsBackPage: this.$route.params.backPage,
        bankCardNo: '',
        money: '',
        type: '001',
        tradePassword: '',
        code: '',
        noteType: '001',
        codeStatus: true,
        btnStatus: false,
        rechargeHintShow: false
      }
    },
    watch: {
      money () {
        this.money = Util.limitTwoNumber(this.money)
        this.changeBtnStatus()
      },
      tradePassword () {
        this.tradePassword = this.tradePassword.substr(0, 6)
        this.changeBtnStatus()
      },
      code () {
        this.code = this.code.substr(0, 6)
        this.changeBtnStatus()
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'login/getUserInfo'
      })
    },
    methods: {
      rechargeHandle () {
        if (!formFlag) return false
        // 验证
        if (!this.verificationHandle()) return false
        formFlag = false
        this.rechargeHintShow = true // 提示充值中
        let id = this.paramsId
        let backPage = this.paramsBackPage
        postAjax({
          url: apiUrl,
          data: {
            bankCardNo: this.userInfo.data.bankNo,
            money: this.money,
            tradePassword: Base64.encode(this.tradePassword)
          }
        }).then((res) => {
          let data = res.data
          if (data.success) {
            setTimeout(() => {
              postAjax({
                url: rechargeStatusApi,
                data: {
                  tradeNo: data.result.tradeNo
                }
              }).then((obj) => {
                if (obj.data.success) {
                  this.rechargeHintShow = false
                  formFlag = true
                  if (parseInt(obj.data.result.status) === 1) {
                    this.$router.push({ name: 'RechargeSuccess', params: { money: this.money, id: id, backPage: backPage } })
                    return false
                  }
                  if (parseInt(obj.data.result.status) === 0 || parseInt(obj.data.result.status) === 2) {
                    this.$router.push({ name: 'RechargeLose', params: { money: this.money, id: id, backPage: backPage } })
                  }
                } else {
                  this.rechargeHintShow = false
                  formFlag = true
                  this.$router.push({ name: 'RechargeLose', params: { money: this.money, id: id, backPage: backPage } })
                }
              })
            }, 2000)
          } else {
            this.rechargeHintShow = false
            formFlag = true
            let failNum = data.result.failNum // 错误次数
            let surplusNum = data.result.surplusNum // 剩下次数
            this.tradePassword = '' // 清空交易密码输入框

            if (surplusNum > 0) {
              this.$vux.toast.show({
                type: 'text',
                width: '15em',
                text: '密码错误，你还可以输入' + data.result.surplusNum + '次',
                position: 'middle'
              })
              return false
            }

            if (parseInt(failNum) === 3) {
              this.$vux.toast.show({
                type: 'text',
                width: '15em',
                text: '账户已锁定，2小时后自动解锁',
                position: 'middle'
              })
              return false
            }

            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: '密码错误，你还可以输入' + data.errorMsg + '次',
              position: 'middle'
            })
            // this.$router.push({ name: 'RechargeLose', params: { money: this.money, id: id, backPage: backPage } })
          }
        })
      },
      changeBtnStatus () {
        this.btnStatus = !!this.money && !!this.tradePassword
      },
      verificationHandle () {
        if (!this.btnStatus) return false
        if (!this.money) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入充值金额',
            position: 'middle'
          })
          return false
        }
        if (parseFloat(this.money) <= 0) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '充值金额必须大于0',
            position: 'middle'
          })
          return false
        }
        if (parseFloat(this.money) > parseFloat(this.userInfo.data.perLimit)) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '充值金额大于单笔限额',
            position: 'middle'
          })
          return false
        }
        if (parseFloat(this.money) > parseFloat(this.userInfo.data.dayLimit)) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '充值金额大于单日限额',
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
            text: '请输入6位交易密码',
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
        this.$router.push({ name: 'User' })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .recharge-wrap {
    .bank-box {
      width: 100%;
      height: 3.46666666rem;
      padding: 0 0.8rem;
      background-color: #fff;
      .top {
        padding: 0.53333333rem 0;
        font-size: @f30;
        .link {
          margin-left: 0.53333333rem;
          font-size: @f21;
          color: @m-t-color;
        }
      }
      .item {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 0.53333333rem;
        }
        .bank-name {
          font-size: @f30;
          .tips {
            margin-left: 0.26666666rem;
            font-size: @f21;
            color: @t-two-color;
          }
        }
      }
    }
    .form-wrap {
      .form-chunk {
        width: 100%;
        padding: 0 0.8rem 0.66666666rem;
        background-color: #fff;
        h3 {
          padding-top: 0.53333333rem;
          font-size: @f30;
          font-weight: 100;
        }
        .write-wrap {
          margin-top: 0.26666666rem;
          height: 1.8rem;
          line-height: 1.8rem;
          .form-num {
            padding: 0;
            font-size: @f36;
          }
        }
        .use-money {
          .t {
            font-size: @f21;
            color: @t-two-color;
          }
          .num {
            margin-left: 0.26666666rem;
            font-size: @f36;
          }
          .unit {
            margin-left: 0.26666666rem;
          }
        }
      }
      .label {
        width: 3.11111111rem;
      }
      .form-text {
        width: 6.66666666rem;
        font-size: @f30;
      }
      .msg-text {
        padding: 0 0.2rem;
        font-size: @f30;
      }
      .form-box {
        position: absolute;
        left: 0;
        width: 100%;
        padding-left: 3.91111111rem;
        padding-right: 0.8rem;
        display: inline-block;
        .item {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
      }
      .text-hint {
        margin-top: 0.53333333rem;
        padding: 0 0.8rem;
        span, .hint-alink {
          font-size: @f21;
          color: @m-t-color;
        }
      }
      .buy-btn {
        padding: 0 0.8rem;
        margin: 2.57777777rem 0 1.06666666rem;
      }
    }
  }

</style>
