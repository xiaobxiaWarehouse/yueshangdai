<template>
    <div class="product-wrap header-occupy">
      <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">{{data.productName}}</x-header>
      <div class="product-deal">
        <div class="pro-cont">
          <Apr :apr="data.apr">
            <!-- <div class="pro-hint" slot="hint">{{data.buyDescription}}</div> -->
          </Apr>
          <ProgressBar :lineW="parseInt((1 - data.restAmount / data.totalAmount) * 100)"></ProgressBar>
          <div class="pro-other">
            <div class="items">
              <div class="item-line">
                <strong class="num">{{data.limit}}</strong><span class="unit">{{dateUnit[data.limitUnit]}}</span>
                <span class="t">投资期限</span>
              </div>
              <div class="item-line" v-if="data.restAmount >= 10000">
                <strong class="num">{{(data.restAmount || '0') / 10000 | moneyFormat}}</strong><span class="unit">万元</span>
                <span class="t">剩余金额</span>
              </div>
              <div class="item-line" v-if="!(data.restAmount >= 10000)">
                <strong class="num">{{(data.restAmount || '0') | moneyFormat}}</strong><span class="unit">元</span>
                <span class="t">剩余金额</span>
              </div>
              <div class="item-line">
                <strong class="num">{{(data.minInvestMoney || '0') | moneyFormat}}</strong><span class="unit">元</span>
                <span class="t">起购金额</span>
              </div>
            </div>
          </div>
        </div>
        <div class="user-money-box">
          <LumpListBox borderType="border-top border-bottom">
            <label class="label fl" slot="left">可用余额</label>
            <div class="money-box fl" slot="center"><strong>{{(userData.data.availableAmount || '0') | moneyFormat}}</strong><span class="unit">元</span></div>
            <div class="fr" slot="right"><router-link class="pay-btn" :to="buyUrl" @click.native="rechargeHandle">充值</router-link></div>
          </LumpListBox>
        </div>
        <div class="pro-form-box mt20">
          <form>
            <LumpListBox borderType="border-bottom">
              <label class="label fl" slot="left">输入金额</label>
              <div class="input-box fl" slot="center">
                <input type="number" v-model="investMoney" class="form-control form-num" @keyup="investMoneyHandle">
              </div>
            </LumpListBox>
            <LumpListBox borderType="border-bottom">
              <label class="label fl" slot="left">预期利息</label>
              <div class="num-box fl" slot="center"><strong class="num">{{(interest || '0') | limitTwoNumber}}</strong><span class="unit ml5">元</span></div>
            </LumpListBox>
            <LumpListBox borderType="border-bottom">
              <label class="label fl" slot="left">使用红包</label>
              <div class="red-pack-box fr" slot="right">
                <router-link class="link" :to="{ name: 'RedEnvelopesList', params: { id: this.$route.params.id, type: data.productType, investMoney: investMoney } }" v-if="redPackNum && !useEnveLoposData.envelopesName">有{{redPackNum}}个可用红包<span class="icon icon-arrow-right"></span></router-link>
                <div class="no-red" v-if="!redPackNum && !useEnveLoposData.envelopesName">无可用红包<span class="icon icon-arrow-right"></span></div>
                <div class="use-red-box" v-if="useEnveLoposData.envelopesName">
                  <router-link :to="{ name: 'RedEnvelopesList', params: { id: this.$route.params.id, type: data.productType, investMoney: investMoney } }">
                    <span>{{useEnveLoposData.envelopesName}}</span>
                    <span v-if="useEnveLoposData.envelopesType === 1">{{useEnveLoposData.envelopesMoney | parseIntNum}}<i>元</i></span>
                    <span v-if="useEnveLoposData.envelopesType === 2">{{useEnveLoposData.envelopesMoney | parseIntNum}}<i>%</i></span>
                  </router-link>
                </div>
              </div>
            </LumpListBox>
          </form>
        </div>
        <div class="protocol-other"><p class="text"><CheckOne @checkParentTrigger="checkParentTriggerHandle" :status="protocol"></CheckOne>已阅读并同意<router-link to="/borrowProtocol" class="a-link">《借款协议》</router-link><router-link to="/riskNoteProtocol" class="a-link">《风险保障协议》</router-link></p></div>
        <div class="buy-btn">
          <OneBtn :url="buyUrl" :status="btnStatus && (data.productStatus === '1') && !(data.productType === '0' && (userData.data && userData.data.invest))" @click.native="showBuyPopHandle">立即购买</OneBtn>
        </div>
      </div>
      <div v-transfer-dom>
        <alert v-model="noInvestHintStatus" button-text="我知道了">
          <p class="text-l">您已不是新手用户</p>
        </alert>
      </div>
      <BuyPopup :popStatus="buyPopStatus" @hidePop="hidebuyPopHandle" :investMoney="investMoney" :awardId="useEnveLoposData.envelopesId"></BuyPopup>
    </div>
</template>

<script>
  import { Base64 } from 'js-base64'
  import { mapGetters } from 'vuex'
  import { XHeader, Alert, TransferDom } from 'vux'
  import Apr from '@/components/product/Apr'
  import ProgressBar from '@/components/other/ProgressBar.vue'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import TriggerInputText from '@/components/other/TriggerInputText.vue'
  import CheckOne from '@/components/other/CheckOne'
  import OneBtn from '@/components/other/OneBtn'
  import BuyPopup from '@/components/product/BuyPopup'
  import { setTimeout, clearTimeout } from 'timers'

  const Util = require('@/assets/js/util')

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Apr,
      ProgressBar,
      LumpListBox,
      TriggerInputText,
      CheckOne,
      OneBtn,
      BuyPopup,
      Alert
    },
    data () {
      return {
        dateUnit: ['天', '个月', '年'],
        buyUrl: '/product/deal/' + this.$route.params.id,
        noInvestHintStatus: false,
        btnStatus: false,
        buyPopStatus: false,
        timer: null
      }
    },
    beforeCreate () {
      // 判断是否登录
      let userInfo = Util.getSessionStorage('userInfo') ? JSON.parse(Base64.decode(Util.getSessionStorage('userInfo'))) : {}
      if (!userInfo.userNo) {
        this.$router.push({ name: 'Login', params: { backPage: 'ProductDetail', id: this.$route.params.id } })
        return false
      }
    },
    created () {
      this.$store.dispatch('productDetail/getProductDetail', { id: this.$route.params.id }).then(() => {
        this.loadingStatus = false
        // 判断用户是否为新手，如果是可以投资新手标，反之提示，您已不是新手用户
        if ((this.data.productType === '0' && (this.userData.data && this.userData.data.invest))) {
          this.noInvestHintStatus = true
        }
      })
      if (!(this.$route.params.page && this.$route.params.page === 'redEnvelopesList')) {
        this.$store.dispatch('productDeal/clearInvestMoney')  // 清除投资金额
        this.$store.dispatch('productDeal/clearInterest') // 清除利息
        this.$store.dispatch('productDeal/clearRedPackNum') // 清除红包个数
        this.$store.dispatch('redEnvelopesList/clearUseEnveLopos')  // 清除已选择的红包
        this.$store.dispatch('productDeal/getProtocol', true) // 重置是否同意协议
      }
      this.changeBtnStatus()
    },
    watch: {
      protocol () {
        this.changeBtnStatus()
      }
    },
    computed: {
      ...mapGetters({
        data: 'productDetail/getProductDetailData', // 项目详情
        userData: 'login/getUserInfo',  // 用户信息
        interest: 'productDeal/getInterest', // 利息
        redPackNum: 'productDeal/getRedPackNum',  // 可使用的红包个数
        useEnveLoposData: 'redEnvelopesList/getUseEnveLoposData'  // 选择的红包信息
      }),
      investMoney: {
        get () {
          return Util.limitTwoNumber(this.$store.state.productDeal.investMoney.investMoney)
        },
        set (value) {
          this.$store.commit('productDeal/setInvestMoney', { investMoney: value })
        }
      },
      protocol: {
        get () {
          return this.$store.state.productDeal.protocol
        },
        set (value) {
          this.$store.commit('productDeal/setProtocol', value)
        }
      }
    },
    methods: {
      investMoneyHandle () {
        this.changeBtnStatus()  // 显示按钮状态
        if (!this.investMoney || this.investMoney <= 0) {
          return false
        }
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          // 设置利息
          this.$store.dispatch('productDeal/setInterest', { investMoney: this.investMoney, apr: this.data.apr, limit: this.data.limit, limitUnit: this.data.limitUnit })
          // 清除已选择的红包
          this.$store.dispatch('redEnvelopesList/clearUseEnveLopos')
          // 获取可使用红包个数
          this.$store.dispatch('productDeal/getRedPackNum', { id: this.$route.params.id, type: this.data.productType, investMoney: this.investMoney }).then((res) => {
          })
        }, 500)
      },
      showBuyPopHandle () {
        if (!this.btnStatus) return false
        let investMoney = parseFloat(this.investMoney)  // 投资金额
        let minInvestMoney = parseFloat(this.data.minInvestMoney) // 起投金额
        let maxInvestMoney = parseFloat(this.data.maxInvestMoney) // 投资限额
        let increaseAmount = parseFloat(this.data.increaseAmount) // 整数递增
        let restAmount = parseFloat(this.data.restAmount) // 剩余金额

        if (!investMoney) {
          this.$vux.toast.show({
            type: 'text',
            width: '10em',
            text: '请输入购买金额',
            time: 1000
          })
          return false
        }
        if (investMoney > restAmount) {  // 投资金额大于剩余金额
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: `购买金额必须小于等于剩余金额`,
            time: 1000
          })
          return false
        }
        if (investMoney < minInvestMoney) {  // 投资金额必须大于等于起投金额
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: `购买金额必须大于等于${minInvestMoney}`,
            time: 1000
          })
          return false
        }
        if (investMoney > maxInvestMoney) {  // 投资金额必须小于等于投资限额
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: `购买金额必须小于等于${maxInvestMoney}`,
            time: 1000
          })
          return false
        }
        if (investMoney % increaseAmount !== 0) {  // 投资金额必须是整数倍递增
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: `购买金额必须${increaseAmount}的整数倍`,
            time: 1000
          })
          return false
        }
        if (!this.protocol) {  // 判断是否同意协议
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: `请阅读协议，并是否同意协议`,
            time: 1000
          })
          return false
        }
        // 创建订单
        this.$store.dispatch('productDeal/setInvestOrder', {
          productId: this.$route.params.id,
          amount: investMoney,
          awardId: this.useEnveLoposData.envelopesId || ''
        }).then((data) => { // 订单创建成功
          // console.log(data)
        }).catch((errorMsg) => {  // 订单创建失败
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: errorMsg,
            position: 'middle'
          })
          return false
        })
        this.buyPopStatus = true
      },
      rechargeHandle () { // 点充值按钮
        // 用户是否实名绑卡
        if (!this.userData.data.realNameAuth) {  // 没实名绑卡，去实名绑卡
          let _this = this
          // 质询是否实名绑卡
          this.$vux.confirm.show({
            content: '您还未实名绑卡？',
            confirmText: '去设置',
            onConfirm () {
              _this.$router.push({ name: 'RealNameCard', params: { backPage: 'ProductDeal', id: this.$route.params.id } })
            }
          })
          return false
        }
        // 用户是否设置交易密码
        if (!this.userData.data.setTradePassword) {  // 没有设置交易密码，去设置
          let _this = this
          // 质询是否设置交易密码
          this.$vux.confirm.show({
            content: '您还未设置交易密码？',
            confirmText: '去设置',
            onConfirm () {
              _this.$router.push({ name: 'DealPwSet', params: { backPage: 'ProductDeal', id: this.$route.params.id } })
            }
          })
          return false
        }
        // 跳转到充值页面
        this.$router.push({ name: 'Recharge', params: { backPage: 'ProductDeal', id: this.$route.params.id } })
      },
      checkParentTriggerHandle (val) {
        this.protocol = val
      },
      hidebuyPopHandle () {
        this.buyPopStatus = false
      },
      changeBtnStatus () {
        this.btnStatus = !!this.investMoney && !!this.protocol
      },
      backHandle () {
        this.$router.push({ name: 'ProductDetail', id: this.$route.params.id })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .product-deal {
    .pro-cont {
      width: 100%;
      padding: 0 0.8rem 0.55555555rem;
      background-color: #fff;
      .pro-other {
        margin-top: 0.8rem;
        .items {
          width: 100%;
          display: flex;
          justify-content: space-between;
          .num {
            font-size: @f36;
          }
          .unit {
            margin-left: 0.13333333rem;
            font-size: @f21;
          }
          .t {
            display: block;
            margin-top: 0.26666666rem;
            font-size: @f21;
            color: @t-two-color;
          }
        }
      }
    }
    .user-money-box {
      background-color: #fff;
      .money-box {
        display: inline-block;
        strong {
          margin-left: 0.53333333rem;
          font-size: @f36;
        }
        .unit {
          margin-left: 0.26666666rem;
          font-size: @f30;
        }
      }
      .pay-btn {
        font-size: @f36;
        font-weight: bold;
        color: @m-color;
      }
    }
    .pro-form-box {
      background-color: #fff;
      .form-input {
        width: auto;
      }
      .input-box, .num-box {
        margin-left: 0.53333333rem;
      }
      .input-box {
        width: 8rem;
        .form-num {
          font-size: @f36;
        }
      }
      .unit {
        font-size: @f30;
      }
      .num-box {
        .num  {
          font-size: @f36;
        }
      }
      .red-pack-box {
        .link, .no-red, .use-red-box {
          font-size: @f30;
        }
        .link {
          color: @m-color;
        }
        .no-red {
          color: @t-two-color;
        }
        .icon {
          margin-top: -0.06666666rem;
          margin-left: 0.26666666rem;
        }
        .use-red-box {
          span {
            color: @m-color;
            &:first-child {
              margin-right: 0.53333333rem;
            }
            &:last-child {
              i {
                margin-left: 0.26666666rem;
                font-style: initial;
              }
            }
          }
        }
      }
    }
    .protocol-other {
      width: 100%;
      padding: 0.53333333rem 0.8rem 0;
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
    .buy-btn {
      margin: 1.24444444rem 0 1.28888888rem;
      padding: 0 0.8rem;
    }
  }
</style>
