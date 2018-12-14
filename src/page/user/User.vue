<template>
  <div class="user-wrap">
    <div class="user-head">
      <div class="user-top">
        <div class="user-name"><span class="icon icon-user-head"></span><strong>{{(userData.data && userData.data.mobileNo) | phoneFormat}}</strong></div>
        <div class="user-set"><router-link to="/user/accountSet"><span class="icon icon-set"></span></router-link></div>
      </div>
      <div class="user-data">
        <div class="user-data-major">
          <div class="num-box">
            <router-link :to="{ name: 'AccountPandect' }" v-if="seeStatus"><strong class="num">{{(data.totalAmount || '0') | moneyFormat}}</strong></router-link>
            <router-link :to="{ name: 'AccountPandect' }" v-if="!seeStatus"><strong class="num">{{star}}</strong></router-link>
            <span :class="'icon' + ' icon-see-' + (seeStatus ? 'show2' : 'hide2')" @click="triggerSeeHandle"></span>
            <div class="sub">资产总额 （元）</div>
          </div>
        </div>
        <div class="user-data-minor">
          <ul class="items">
            <li>
              <strong class="num" v-if="seeStatus">{{(data.toBePaidBack || '0') | moneyFormat}}</strong>
              <strong class="num" v-if="!seeStatus">{{star}}</strong>
              <div class="sub">待回款总额 （元）</div>
            </li>
            <li>
              <strong class="num" v-if="seeStatus">{{(data.totalIncome || '0') | moneyFormat}}</strong>
              <strong class="num" v-if="!seeStatus">{{star}}</strong>
              <div class="sub">累计收益 （元）<span class="icon icon-plaint" @click="totalIncomeHintHandle"></span></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="user-nav">
      <div class="item">
        <div><router-link to="/user/lend"><span class="icon icon-lend"></span></router-link></div>
        <div>
          <router-link to="/user/lend"><strong>出借明细</strong></router-link>
          <span>交易记录明细</span>
        </div>
      </div>
      <div class="item">
        <div><router-link to="/user/fundAccount"><span class="icon icon-money"></span></router-link></div>
        <div>
          <router-link to="/user/fundAccount"><strong>资金流水</strong></router-link>
          <span>资金明细 清晰明了</span>
        </div>
      </div>
    </div>
    <div class="user-use-money mt24">
      <LumpListBox borderType="border-bottom">
        <label class="label" slot="left">可用余额</label>
        <strong class="num" slot="center">{{(data.availableBalance || '0') | moneyFormat}}</strong>
        <div class="links fr" slot="right"><router-link to="/user" @click.native="rechargeHandle">充值</router-link><router-link to="/user" @click.native="repaymentHandle">提现</router-link></div>
      </LumpListBox>
    </div>
    <div class="user-help">
      <router-link to="/user/myInvited">
        <LumpListBox borderType="border-bottom">
          <label class="label" slot="left"><span class="icon icon-my-invite"></span>我的邀请</label>
          <div class="fr" slot="right"><span class="icon icon-arrow-right"></span></div>
        </LumpListBox>
      </router-link>
      <router-link to="/user/coupons">
        <LumpListBox borderType="border-bottom">
          <label class="label" slot="left"><span class="icon icon-red-pack"></span>我的红包</label>
          <div class="fr" slot="right"><span class="icon icon-arrow-right"></span></div>
        </LumpListBox>
      </router-link>
    </div>
    <div class="user-help mt24">
      <router-link to="/user/notices">
        <LumpListBox borderType="border-bottom">
          <label class="label" slot="left"><span class="icon icon-notices"></span>消息公告</label>
          <div class="fr" slot="right"><span class="icon icon-arrow-right"></span></div>
        </LumpListBox>
      </router-link>
      <router-link to="/user/help">
        <LumpListBox borderType="border-bottom">
          <label class="label" slot="left"><span class="icon icon-user-help"></span>帮助中心</label>
          <div class="fr" slot="right"><span class="icon icon-arrow-right"></span></div>
        </LumpListBox>
      </router-link>
      <router-link to="/user/about">
        <LumpListBox borderType="border-bottom">
          <label class="label" slot="left"><span class="icon icon-about-my"></span>关于我们</label>
          <div class="fr" slot="right"><span class="icon icon-arrow-right"></span></div>
        </LumpListBox>
      </router-link>
    </div>
    <div v-transfer-dom>
      <alert v-model="totalIncomeHintStatus" button-text="我知道了">
        <p class="text-l">累计收益为用户在乐商宝平台的历史累计利息收益、红包收益以及活动收益总和</p>
      </alert>
    </div>
    <div class="foot">
      <FootNav :navIndex="2"></FootNav>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import FootNav from '@/components/FootNav'
  import { Alert, TransferDom } from 'vux'
  import LumpListBox from '@/components/other/LumpListBox'
  // import postAjax from '@/plugins/PostAjax'

  const Util = require('@/assets/js/util')

  export default {
    directives: {
      TransferDom
    },
    components: {
      FootNav,
      Alert,
      LumpListBox
    },
    data () {
      return {
        star: '*****',
        totalIncomeHintStatus: false
      }
    },
    beforeCreate () {
      // 判断用户是否登录
      if (!Util.getSessionStorage('toKen')) {
        this.$router.push({ name: 'Login', params: { backPage: 'Home' } })
        return false
      }
      // 获取账户信息
      this.$store.dispatch('user/getMineAccount').then(() => {

      })
    },
    computed: {
      ...mapGetters({
        data: 'user/getMineAccountData', // 我的信息
        seeStatus: 'user/getSeeStatus', // 显示隐藏金额
        userData: 'login/getUserInfo' // 获取用户信息
      })
    },
    methods: {
      rechargeHandle () { // 点充值按钮
        // 用户是否实名绑卡
        if (!this.userData.data.realNameAuth) {  // 没实名绑卡，去实名绑卡
          let _this = this
          // 质询是否实名绑卡
          this.$vux.confirm.show({
            content: '您还未实名绑卡？',
            confirmText: '去设置',
            onConfirm () {
              _this.$router.push({ name: 'RealNameCard', params: { backPage: 'User' } })
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
              _this.$router.push({ name: 'DealPwSet', params: { backPage: 'User' } })
            }
          })
          return false
        }
        // 跳转到充值页面
        this.$router.push({ name: 'Recharge' })
      },
      repaymentHandle () {
        // 用户是否实名绑卡
        if (!this.userData.data.realNameAuth) {  // 没实名绑卡，去实名绑卡
          let _this = this
          // 质询是否实名绑卡
          this.$vux.confirm.show({
            content: '您还未实名绑卡？',
            confirmText: '去设置',
            onConfirm () {
              _this.$router.push({ name: 'RealNameCard', params: { backPage: 'User' } })
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
              _this.$router.push({ name: 'DealPwSet', params: { backPage: 'User' } })
            }
          })
          return false
        }
        // 跳转到提现页面
        this.$router.push({ name: 'Repayment' })
      },
      triggerSeeHandle () {
        this.$store.dispatch('user/getSeeStatus', { status: !this.seeStatus })
      },
      totalIncomeHintHandle () {  // 累计收益提示
        this.totalIncomeHintStatus = true
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .user-wrap {
    margin-bottom: 0.8rem;
    padding-bottom: 1.91111111rem;
    .user-head {
      width: 100%;
      padding: 0 0.8rem 1.28888888rem;
      background-color: @m-color;
      .user-top {
        display: flex;
        justify-content: space-between;
        padding: 0.8rem 0 2.17777777rem;
        .user-name {
          strong {
            margin-left: 0.53333333rem;
            font-size: @f30;
            color: #fff;
          }
        }
      }
      .user-data {
        &-major {
          margin-bottom: 1.28888888rem;
          .num-box {
            display: inline-block;
            vertical-align: top;
            .num {
              font-size: @f58;
              color: @t-white-color;
            }
            .sub {
              margin-top: 0.26666666rem;
              font-size: @f21;
              color: @t-white-color;
            }
          }
          .icon {
            margin-left: 0.53333333rem;
            margin-top: -1rem;
            &-see-show2 {
              margin-top: -0.7rem;
            }
          }
        }
        &-minor {
          .items {
            display: flex;
            justify-content: space-between;
            li {
              width: 50%;
            }
          }
          .num {
            font-size: @f36;
            color: @t-white-color;
          }
          .sub {
            margin-top: 0.26666666rem;
            color: @t-white-color;
            font-size: @f21;
            .icon {
              margin-left: 0.53333333rem;
            }
          }
        }
      }
    }
    .user-nav {
      display: flex;
      align-items: center;
      width: 100%;
      height: 3.6rem;
      background-color: #fff;
      box-shadow: 1px 0 3px rgba(0, 0, 0, 0.1);
      .item {
        display: flex;
        width: 50%;
        padding-left: 1.33333333rem;
        div:nth-child(2) {
          margin-left: 0.53333333rem;
          strong {
            font-size: @f30;
          }
          span {
            display: block;
            margin-top: 0.26666666rem;
            font-size: @f21;
            color: @t-two-color;
          }
        }
      }
    }
    .user-use-money {
      .label, .num {
        display: inline-block;
        vertical-align: middle;
      }
      .num {
        margin-left: 0.53333333rem;
        font-size: @f36;
      }
      .links {
        a {
          font-size: @f30;
          font-weight: bold;
        }
        a:nth-child(1) {
          color: @m-color;
        }
        a:nth-child(2) {
          margin-left: 0.8rem;
          color: @t-two-color;
        }
      }
    }
    .user-help {
      .icon {
        margin-right: 0.26666666rem;
      }
    }


  }
</style>
