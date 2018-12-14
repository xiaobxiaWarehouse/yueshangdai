<template>
  <div class="repayment-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">提现<router-link :to="{ name: 'WithdrawRecord' }" slot="right">提现记录</router-link></x-header>
    <div class="bank-box border-bottom mt24">
      <div class="top">到账银行卡<router-link class="link" to="/user/limitExplain">限额说明</router-link></div>
      <div class="item">
        <span :class="`icon icon-bank icon-bank-${parseInt(userInfo.data.bankCode)}`"></span>
        <div class="bank-name">{{userInfo.data.bankName}}<span class="tips">（{{userInfo.data.bankNo | bankCardFormat('尾号')}}储蓄卡）</span>
      </div>
      </div>
    </div>
    <div class="form-wrap">
      <form class="page-form">
        <div class="form-chunk border-bottom mt24">
          <h3>提现金额</h3>
          <div class="write-wrap">
            <input type="number" v-model="money" class="form-control form-num" placeholder="请输入提现金额">
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
      </form>
      <div class="text-hint clearfix"><span @click="hintPopHandle">温馨提示</span><router-link :to="{name: 'DealPwFind', params: { backPage: 'Repayment' }}" class="hint-alink fr">忘记交易密码？</router-link></div>
      <div class="buy-btn">
        <SubBtn :status="btnStatus" @click.native="submitHandle">确认提现</SubBtn>
      </div>
    </div>
    <div v-transfer-dom>
      <alert v-model="hintShow" title="温馨提示" button-text="我知道了">
        <p class="text-l">1.提现免手续费每笔0.1%（每月前三笔免费）</p>
        <p class="text-l">2.当前只支持绑定一张银行卡（借记卡），如果您在提现操作时还没有绑定银行卡，请先去完成绑卡操作</p>
        <p class="text-l">3.提现额度会受到持卡人的银行账户交易限额所约束，所以提现前请注意银行卡的提现额度。</p>
        <p class="text-l">4.平台禁止洗钱，信用卡套现，虚假交易等行为，一经发现并确认，将终止该账户的使用</p>
      </alert>
    </div>
    <div v-transfer-dom>
      <loading :show="repaymentHintShow" text="提现中"></loading>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { XHeader, Alert, Loading, TransferDom } from 'vux'
  import { Base64 } from 'js-base64'
  import TriggerInputText from '@/components/other/TriggerInputText.vue'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import SubBtn from '@/components/user/SubBtn'
  import postAjax from '@/plugins/PostAjax'

  const Util = require('@/assets/js/util')

  const apiUrl = '/api/repayment'

  let formFlag = true // 防止多次提交

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      TriggerInputText,
      LumpListBox,
      SubBtn,
      Alert,
      Loading
    },
    data () {
      return {
        money: '',
        tradePassword: '',
        btnStatus: false,
        hintShow: false,
        repaymentHintShow: false
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
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'login/getUserInfo'
      })
    },
    methods: {
      submitHandle () {
        if (!formFlag) return false
        // 验证
        if (!this.verificationHandle()) return false
        formFlag = false
        this.repaymentHintShow = true // 显示提现中
        postAjax({
          url: apiUrl,
          data: {
            bankCardNo: this.userInfo.data.bankNo,
            money: this.money,
            tradePassword: Base64.encode(this.tradePassword)
          }
        }).then((res) => {
          this.repaymentHintShow = false
          formFlag = true
          let data = res.data
          if (data.success) {
            this.$store.dispatch('repayment/setRepaymentInfo', Object.assign({ repaymentMoney: this.money }, data.result))
            this.$router.push({ name: 'RepaymentSuccess' })
          } else {
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
            // this.$router.push({ name: 'RepaymentLose' })
          }
        })
      },
      hintPopHandle () {
        this.hintShow = true
      },
      getMoneyHandle ({ money }) {
        this.money = money
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
            text: '请输入提现金额',
            position: 'middle'
          })
          return false
        }
        if (parseFloat(this.money) <= 0) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '提现金额必须大于0',
            position: 'middle'
          })
          return false
        }
        if (parseFloat(this.money) > parseFloat(this.userInfo.data.availableAmount)) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '超过可提现金额',
            position: 'middle'
          })
          return false
        }
        // if (parseFloat(this.money) > parseFloat(this.userInfo.data.perLimit)) {
        //   this.$vux.toast.show({
        //     type: 'text',
        //     width: '15em',
        //     text: '提现金额大于单笔限额',
        //     position: 'middle'
        //   })
        //   return false
        // }
        // if (parseFloat(this.money) > parseFloat(this.userInfo.data.dayLimit)) {
        //   this.$vux.toast.show({
        //     type: 'text',
        //     width: '15em',
        //     text: '提现金额大于单日限额',
        //     position: 'middle'
        //   })
        //   return false
        // }
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

  .repayment-wrap {
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
        margin: 1.68888888rem 0 1.06666666rem;
      }
    }
  }
</style>
