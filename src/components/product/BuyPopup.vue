<template>
    <div class="product-buy-popUp">
      <div v-transfer-dom>
        <popup v-model="popStatus" :hide-on-blur="false">
          <div class="buy-popup">
            <swiper v-model="step" :height="getHeight" :show-dots="false" :min-moving-distance="9999">
              <swiper-item :key="0">
                <div class="buy-popup-title border-bottom">
                  <div class="buy-one-step">
                    <span class="icon icon-close" @click="closePopHandle"></span><strong>确认付款</strong>
                  </div>
                </div>
                <div class="buy-popup-content">
                  <div class="buy-one-step">
                    <div class="num-box"><span class="sign">￥</span><strong class="num">{{investMoney | moneyFormat}}</strong></div>
                    <div class="num-use-money border-bottom"><label class="lab">使用余额</label><div class="unit-box"><strong>{{((userData.data.availableAmount || 0) > investMoney - (this.useEnveLoposData.envelopesType === 2 ? 0 : (this.useEnveLoposData.envelopesMoney || 0)) ? investMoney - (this.useEnveLoposData.envelopesType === 2 ? 0 : (this.useEnveLoposData.envelopesMoney || 0)) : (userData.data.availableAmount || 0)) | moneyFormat}}</strong><span class="unit">元</span></div></div>
                    <div class="buy-style-list">
                      <div class="item border-bottom">
                        <div class="t"><label class="lab">需银行卡支付</label><div class="unit-box"><strong>{{((investMoney - (userData.data.availableAmount || 0) - (this.useEnveLoposData.envelopesType === 2 ? 0 : (this.useEnveLoposData.envelopesMoney || 0)) > 0) ? investMoney - userData.data.availableAmount - (this.useEnveLoposData.envelopesType === 2 ? 0 : (this.useEnveLoposData.envelopesMoney || 0)) : 0) | moneyFormat}}</strong><span class="unit">元</span></div></div>
                        <div class="b">
                          <p class="msg">{{userData.data.bankName}}<span class="card-no">({{userData.data.bankNo | bankCardFormat('尾号')}})</span></p>
                          <p :class="'msg' + (isMoneyLimitation ? '' : ' err-msg')">单笔限额{{(userData.data.perLimit || 0) | moneyFormat}}元，单日限额{{(userData.data.dayLimit || 0) | moneyFormat}}元</p>
                        </div>
                      </div>
                    </div>
                    <div class="buy-btn">
                      <OneBtn :url="buyUrl" :status="isMoneyLimitation" @click.native="buyHandle">立即付款</OneBtn>
                    </div>
                  </div>
                </div>
              </swiper-item>
              <swiper-item :key="1">
                <div class="buy-popup-content">
                  <div class="buy-two-step">
                    <PayTool @backFnc="backOneSetHandle" @purchaseDeal="parentPurchaseDealHandle" :title="payToolTitle" :money="investMoney" :tradeNo="investOrderData.tradeNo"></PayTool>
                  </div>
                </div>
              </swiper-item>
            </swiper>
          </div>
        </popup>
      </div>
      <div v-transfer-dom>
        <loading :show="rechargeHintShow" text="投资中"></loading>
      </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Popup, Swiper, SwiperItem, Loading, TransferDom } from 'vux'
  import OneBtn from '@/components/other/OneBtn'
  import PayTool from '@/components/other/PayTool'
  import postAjax from '@/plugins/PostAjax'

  const Util = require('@/assets/js/util')

  export default {
    directives: {
      TransferDom
    },
    components: {
      Popup,
      OneBtn,
      Swiper,
      SwiperItem,
      PayTool,
      Loading
    },
    props: ['popStatus', 'investMoney', 'awardId'],
    data () {
      return {
        buyUrl: '/product/deal/' + this.$route.params.id,
        step: 0,
        payToolTitle: '请输入交易密码',
        // rechargeTimer: null,
        rechargeHintShow: false
      }
    },
    computed: {
      ...mapGetters({
        investOrderData: 'productDeal/getInvestOrderData', // 订单信息
        useEnveLoposData: 'redEnvelopesList/getUseEnveLoposData',  // 选择的红包信息
        userData: 'login/getUserInfo'  // 用户信息
      }),
      isMoneyLimitation () {
        // 红包金额
        let envelopesMoney = this.useEnveLoposData.envelopesType === 2 ? 0 : (this.useEnveLoposData.envelopesMoney || 0)
        let investMoney = this.investMoney || 0
        // 充值金额 = 投资金额 - 帐号余额 - 红包金额
        let money = Util.floatSub(Util.floatSub(investMoney, this.userData.data.availableAmount), envelopesMoney) || 0
        return money <= parseFloat(this.userData.data.perLimit) && money <= parseFloat(this.userData.data.dayLimit)
      },
      getHeight () {
        return Math.floor(parseFloat(document.getElementsByTagName('html')[0].style.fontSize) * 18.93333333) + 'px'
      }
    },
    methods: {
      closePopHandle: function () {
        this.$emit('hidePop')
      },
      buyHandle () {
        if (!this.isMoneyLimitation) return false
        this.step = 1
      },
      backOneSetHandle () {
        this.step = 2
      },
      parentPurchaseDealHandle (dealPw) {
        let envelopesMoney = this.useEnveLoposData.envelopesType === 2 ? 0 : (this.useEnveLoposData.envelopesMoney || 0) // 红包金额
        let money = Util.floatSub(Util.floatSub(this.investMoney, this.userData.data.availableAmount), envelopesMoney) || 0 // 充值金额 = 投资金额 - 帐号余额 - 红包金额

        let productId = this.$route.params.id // 产品ID
        let amount = this.investMoney // 投资金额
        let balance = this.userData.data.availableAmount || 0 // 使用账户余额
        let awardId = this.awardId || '' // 红包id
        let tradePassword = dealPw // 交易密码
        let bankCardNo = this.userData.data.bankNo // 银行卡号
        let tradeNo = this.investOrderData.tradeNo // 订单号
        this.rechargeHintShow = true  // 提示投资中
        // 如果充值金额大于0，需充值支付
        if (money > 0) {
          postAjax({
            url: '/api/recharge', // 充值接口
            data: {
              money: money,
              bankCardNo: this.userData.data.bankNo,
              tradePassword: tradePassword
            }
          }).then((res) => {
            let data = res.data
            if (data.success) { // 充值提交成功
              // 充值状态查询, 1500毫秒查询一次
              setTimeout(() => {
                postAjax({
                  url: '/api/rechargeStatus',
                  data: {
                    tradeNo: data.result.tradeNo
                  }
                }).then((rs) => {
                  if (rs.data.success) {
                    if (parseInt(rs.data.result.status) === 1) {
                      // 确认支付
                      this.dealHandle({
                        productId: productId,
                        amount: amount,
                        balance: balance,
                        awardId: awardId,
                        tradePassword: tradePassword,
                        bankCardNo: bankCardNo,
                        money: money,
                        tradeNo: tradeNo
                      })
                      return false
                    }
                    if (parseInt(rs.data.result.status) === 0 || parseInt(rs.data.result.status) === 2) {  // 充值失败，判定为投资失败
                      this.rechargeHintShow = false
                      this.$router.push({ name: 'PayFailure', params: { productId: this.$route.params.id } })
                    }
                  }
                })
              }, 1500)
            } else {  // 充值提交失败时，判定为投资失败
              this.rechargeHintShow = false
              let failNum = data.result.failNum // 错误次数
              let surplusNum = data.result.surplusNum // 剩下次数

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
              // this.$router.push({ name: 'PayFailure', params: { productId: this.$route.params.id } })
            }
          })
        } else {  // 使用余额支付
          // 确认支付
          this.dealHandle({
            productId: productId,
            amount: amount,
            balance: balance,
            awardId: awardId,
            tradePassword: tradePassword,
            bankCardNo: bankCardNo,
            money: money,
            tradeNo: tradeNo
          })
        }
      },
      dealHandle ({ productId, amount, balance, awardId, tradePassword, bankCardNo, money, tradeNo }) {
        // 确认支付
        this.$store.dispatch('productDeal/buyPurchase', {
          productId: productId, // 产品ID
          amount: amount, // 购买金额
          balance: balance, // 使用账户余额
          awardId: awardId, // 红包id
          tradePassword: tradePassword, // 交易密码
          bankCardNo: bankCardNo, // 银行卡号
          money: money, // 充值金额
          tradeNo: tradeNo // 订单号
        }).then((data) => { // 支付成功
          setTimeout(() => {
            this.rechargeHintShow = false
            // 跳转到支付成功页面
            this.$router.push({ name: 'PaySuccess', params: { money: this.investMoney } })
          }, 2000)
        }).catch((data) => {  // 支付失败
          setTimeout(() => {
            this.rechargeHintShow = false
            this.$router.push({ name: 'PayFailure', params: { productId: this.$route.params.id } })
          }, 2000)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .buy-popup {
    height: 18.93333333rem;
    background-color: #fff;
    overflow: hidden;
    &-title {
      width: 100%;
      height: 2.08888888rem;
      padding: 0 0.8rem;
      line-height: 2.08888888rem;
      text-align: center;
      overflow: hidden;
      .icon {
        float: left;
        margin-top: 0.72222222rem;
      }
      strong {
        font-size: @f36;
      }
    }
    &-content {
      .buy-one-step {
        .num-box {
          padding-top: 1.55555555rem;
          text-align: center;
          .sign {
            margin-right: 0.26666666rem;
            font-size: @f58;
            color: @m-color;
          }
          .num {
            font-size: @f88;
            color: @m-color;
          }
        }
        .num-use-money .lab, .buy-style-list .lab {
          font-size: @f30;
        }
        .num-use-money .unit-box, .buy-style-list .unit-box {
          font-size: @f36;
          .unit {
            margin-left: 0.26666666rem;
          }
        }
        .num-use-money {
          margin-top: 1.55555555rem;
          padding: 0 0.8rem 0.53333333rem;
          display: flex;
          justify-content: space-between;
        }
        .buy-style-list {
          .item {
            width: 100%;
            padding: 0.53333333rem 0.8rem;
            .t {
              display: flex;
              justify-content: space-between;
            }
            .b {
              .msg {
                margin-top: 0.26666666rem;
                color: @t-two-color;
                font-size: @f21;
              }
              .err-msg {
                color: @m-color;
              }
            }
          }
        }

        .buy-btn {
          margin-top: 2.55555555rem;
          padding: 0 0.8rem;
        }
      }
    }


  }
</style>
