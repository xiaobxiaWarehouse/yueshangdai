<template>
  <div class="product-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">{{data.productName}}</x-header>
    <div class="product-detail">
      <div class="pro-cont border-bottom">
        <Apr :apr="data.apr">
          <div class="pro-hint" slot="hint" v-if="data.restAmount >= 10000">剩余<strong>{{(data.restAmount || 0) / 10000 | moneyFormat}}</strong><span class="unit">万元</span></div>
           <div class="pro-hint" slot="hint" v-if="!(data.restAmount >= 10000)">剩余<strong>{{(data.restAmount || 0) | moneyFormat}}</strong><span class="unit">元</span></div>
        </Apr>
        <ProgressBar :lineW="parseInt((1 - data.restAmount / data.totalAmount) * 100)"></ProgressBar>
        <div class="pro-other">
          <div class="items">
            <div class="item-line">
              <strong class="num">{{data.limit}}</strong><span class="unit">{{dateUnit[data.limitUnit]}}</span>
              <span class="t">投资期限</span>
            </div>
            <div class="item-line">
              <strong class="num">{{(data.minInvestMoney || 0) | moneyFormat}}</strong><span class="unit">元</span>
              <span class="t">起购金额</span>
            </div>
            <div class="item-line">
              <strong class="num">{{(data.totalAmount || 0) / 10000 | moneyFormat}}</strong><span class="unit">万元</span>
              <span class="t">募集金额</span>
            </div>
          </div>
        </div>
      </div>
      <div class="invested-num text-c border-bottom">
        <p><router-link :to="'/product/addRecord/' + id">已有{{addRecordsCount}}笔投资记录<span class="c-red">>></span></router-link></p>
      </div>
      <div class="pro-chunk mt20">
        <div class="title clearfix"><h2 class="fl">交易规则</h2></div>
        <ul class="list">
          <li>
            <label class="label"><span class="icon icon-mjsj"></span>募集时间</label>
            <span class="txt">{{data.raiseTime | dateFormat('yyyy-MM-dd')}}</span>
          </li>
          <li>
            <label class="label"><span class="icon icon-mjqx"></span>募集期限</label>
            <span class="txt">{{data.raisePeriod}}</span>
          </li>
          <li>
            <label class="label"><span class="icon icon-qxrq"></span>起息日期</label>
            <span class="txt">{{data.interestRateMethod}}</span>
          </li>
          <li>
            <label class="label"><span class="icon icon-jrtj"></span>加入条件</label>
            <span class="txt">{{data.buyDescription}}</span>
          </li>
          <li>
            <label class="label"><span class="icon icon-hkfs"></span>还款方式</label>
            <span class="txt">{{data.repayment}}</span>
          </li>
        </ul>
      </div>
      <div class="pro-chunk mt20">
        <div class="title clearfix"><h2 class="fl">产品概要</h2></div>
        <ul class="list">
          <li>
            <label class="label"><span class="icon icon-cpjs"></span>产品介绍</label>
            <span class="txt">{{data.productPresentation}}</span>
          </li>
          <li>
            <label class="label"><span class="icon icon-cptd"></span>产品特点</label>
            <span class="txt" v-for="(pro, index) in data.productTags" :key="index">
              {{pro.productTag}}
            </span>
          </li>
          <li>
            <label class="label"><span class="icon icon-fxdj"></span>风险等级</label>
            <span class="txt">{{data.productRiskLevel}}<span class="icon icon-plaint-gray" @click="riskRankHintHandle"></span></span>
          </li>
          <li>
            <label class="label"><span class="icon icon-syrq"></span>适宜人群</label>
            <span class="txt">{{data.suitblablePeople}}</span>
          </li>
          <li>
            <label class="label"><span class="icon icon-aqbz"></span>安全保障</label>
            <span class="txt">{{data.safeguards}}</span>
          </li>
        </ul>
      </div>
      <router-link :to="'/product/lookDetail/' + id">
        <LumpListBox class="mt24" borderType="border-bottom">
          <label class="label fl" slot="left">项目详情</label>
          <div class="fr" slot="right"><span class="icon icon-arrow-right"></span></div>
        </LumpListBox>
      </router-link>
      <!-- <router-link :to="'/product/addRecord/' + id">
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">加入记录</label>
          <div class="fr" slot="right"><span class="icon icon-arrow-right"></span></div>
        </LumpListBox>
      </router-link> -->
      <router-link to="/user/familiarAsk">
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">常见问题</label>
          <div class="fr" slot="right"><span class="icon icon-arrow-right"></span></div>
        </LumpListBox>
      </router-link>
      <router-link to="/riskNoteProtocol">
        <LumpListBox borderType="border-bottom">
          <label class="label fl" slot="left">风险提示</label>
          <div class="fr" slot="right"><span class="icon icon-arrow-right"></span></div>
        </LumpListBox>
      </router-link>
      <div class="pro-hintText">
        <p>本产品不承诺保本或最低收益，产品收益仅供参考，不构成乐商宝及其关联公司对收益的任何承诺和保证。本产品存续期间可能存在的投资风险将您自行承担</p>
      </div>
      <div class="buy-btn">
        <OneBtn class="btn-one-box-straight" :url="`/product/detail/${this.$route.params.id}`" :status="(data.productStatus === '1') && !(data.productType === '0' && (userData.data && userData.data.invest))" @click.native="buyHandle">立即购买</OneBtn>
      </div>
      <div class="buy-btn-occupy"></div>
    </div>
    <div class="spinner-box-center" v-if="loadingStatus">
      <spinner type="bubbles" size="40px"></spinner>
    </div>
    <div v-transfer-dom>
      <alert v-model="noInvestHintStatus" button-text="我知道了">
        <p class="text-l">您已不是新手用户</p>
      </alert>
    </div>
    <div v-transfer-dom>
      <alert v-model="riskRankHintStatus" title="风险等级适用人群" button-text="我知道了">
        <ul class="riskRankHint-list">
          <li><span class="t-l">低风险：</span><span class="t-r">保守型、谨慎型、稳健型、积极型</span></li>
          <li><span class="t-l">中低风险：</span><span class="t-r">谨慎型、稳健型、积极型</span></li>
          <li><span class="t-l">中等风险：</span><span class="t-r">稳健型、积极型</span></li>
          <li><span class="t-l">中高风险：</span><span class="t-r">积极型</span></li>
        </ul>
      </alert>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Spinner, XHeader, Alert, TransferDom } from 'vux'
  import Apr from '@/components/product/Apr'
  import ProgressBar from '@/components/other/ProgressBar.vue'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import OneBtn from '@/components/other/OneBtn'

  const Util = require('@/assets/js/util')

  export default {
    directives: {
      TransferDom
    },
    components: {
      Spinner,
      XHeader,
      Apr,
      ProgressBar,
      LumpListBox,
      OneBtn,
      Alert
    },
    data () {
      return {
        id: this.$route.params.id,
        dateUnit: ['天', '个月', '年'],
        loadingStatus: true,
        noInvestHintStatus: false,
        riskRankHintStatus: false
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
      // 单个标投资记录总数
      this.$store.dispatch('productDetail/getAddRecordsCount', { id: this.$route.params.id })
    },
    computed: {
      ...mapGetters({
        data: 'productDetail/getProductDetailData',
        addRecordsCount: 'productDetail/getAddRecordsCount',
        userData: 'login/getUserInfo' // 获取用户信息
      })
    },
    methods: {
      buyHandle () {
        if (this.data.productStatus !== '1') return false
        if ((this.data.productType === '0' && (this.userData.data && this.userData.data.invest))) return false
        // 用户是否登录
        if (!this.userData.userNo || !Util.getSessionStorage('toKen')) { // 没有登录，去登录
          if (this.userData.userNo) {
            this.$store.dispatch('login/removeUserInfo')
          }
          this.$router.push({ name: 'Login', params: { backPage: 'ProductDetail', id: this.$route.params.id } })
          return false
        }
        // 用户是否实名绑卡
        if (!this.userData.data.realNameAuth) {  // 没实名绑卡，去实名绑卡
          let _this = this
          // 质询是否实名绑卡
          this.$vux.confirm.show({
            content: '您还未实名绑卡？',
            confirmText: '去设置',
            onConfirm () {
              _this.$router.push({ name: 'RealNameCard', params: { backPage: 'ProductDetail', id: _this.$route.params.id } })
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
              _this.$router.push({ name: 'DealPwSet', params: { backPage: 'ProductDetail', id: _this.$route.params.id } })
            }
          })
          return false
        }
        // 用户是否风险评估
        if (!this.userData.data.setRiskLevel) {  // 没有风险评估，去设置
          let _this = this
          // 质询是否风险评估
          this.$vux.confirm.show({
            content: '请还未进行风险测评？',
            confirmText: '去设置',
            onConfirm () {
              _this.$router.push({ name: 'RiskSurvey', params: { backPage: 'ProductDetail', id: _this.$route.params.id } })
            }
          })
          return false
        }
        // 跳转到购买页面
        this.$router.push({ name: 'ProductDeal', params: { id: this.$route.params.id } })
      },
      backHandle () {
        let backPage = this.$route.params.backPage
        if (backPage) {
          this.$router.push({ name: backPage })
          return false
        }
        this.$router.push({ name: 'Product' })
      },
      riskRankHintHandle () {
        this.riskRankHintStatus = true
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .product-detail {
    .pro-cont {
      width: 100%;
      padding: 0 0.8rem 0.8rem;
      background-color: #fff;
      .pro-hint {
        strong {
          margin: 0 0.13333333rem;
          font-size: @f36;
          color: @t-one-color;
        }
        .unit {
          color: @t-one-color;
        }
      }
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
    .invested-num {
      height: 1.55555555rem;
      line-height: 1.55555555rem;
      background-color: #fff;
      p {
        font-size: @f24;
        .c-red {
          margin-left: 0.1333rem;
          color: @m-color;
        }
      }
    }
    .pro-chunk {
      width: 100%;
      background-color: #fff;
      .title {
        height: 1.91111111rem;
        padding: 0 0.8rem;
        line-height: 1.91111111rem;
        border-bottom: 1px solid @border-one-color;
        overflow: hidden;
        h2 {
          font-size: @f30;
          font-weight: 100;
        }
        a {
          font-size: @f30;
          color: @t-two-color;
          .icon {
            margin-left: 0.26666666rem;
          }
        }
      }
      .list {
        padding: 0.66666666rem 0.8rem;
        li {
          position: relative;
          margin-bottom: 0.53333333rem;
          min-height: 0.88888888rem;
          line-height: 0.88888888rem;
          .label {
            position: absolute;
            left: 0;
            width: 4.33333333rem;
            margin-right: 0.53333333rem;
            font-size: @f30;
            font-weight: bold;
            .icon {
              margin-right: 0.8rem;
            }
          }
          .txt {
            display: block;
            padding-left: 4.86666666rem;
            font-size: @f24;
            color: @t-two-color;
            .icon {
              margin-top: -0.06666666rem;
              margin-left: 0.53333333rem;
            }
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    .pro-hintText {
      padding: 1.06666666rem 0.8rem;
      p {
        font-size: @f24;
        color: @t-two-color;
      }
    }
    .buy-btn {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 999;
      &-occupy {
        width: 100%;
        height: 1.82222222rem;
      }
    }
  }
  .riskRankHint-list {
    padding: 0.26666666rem 0;
    li {
      position: relative;
      width: 100%;
      margin-bottom: 0.26666666rem;
      text-align: left;
      overflow: hidden;
      &:last-child {
        margin-bottom: 0;
      }
      .t-l {
        position: absolute;
        left: 0;
        width: 3.55555555rem;
        padding-right: 0.53333333rem;
        text-align: right;
      }
      .t-r {
        display: block;
        margin-left: 3.55555555rem;
      }
    }
  }
</style>
