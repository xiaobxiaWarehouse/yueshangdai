<template>
  <div class="recharge-success header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">充值成功<router-link :to="{ name: 'RechargeRecord' }" slot="right">充值记录</router-link></x-header>
    <div class="content">
      <div class="msg"><span class="icon icon-success"></span>充值成功</div>
      <div class="money"><span class="unit">￥</span><strong>{{(money || 0) | moneyFormat}}</strong></div>
      <div class="btns"><router-link :to="{name: 'Recharge', params: { id: paramsId, backPage: paramsBackPage }}">继续充值</router-link><router-link to="/product">去投资</router-link></div>
    </div>
  </div>
</template>

<script>
  import { XHeader } from 'vux'
  import { setTimeout } from 'timers'

  export default {
    components: {
      XHeader
    },
    created () {
      setTimeout(() => {
        this.$store.dispatch('login/updateUserInfo')  // 更新用户信息
      }, 1500)
    },
    data () {
      return {
        paramsId: this.$route.params.id,
        paramsBackPage: this.$route.params.backPage,
        money: this.$route.params.money
      }
    },
    methods: {
      backHandle () {
        let id = this.paramsId
        let backPage = this.paramsBackPage
        this.$router.push({ name: 'Recharge', params: { id: id, backPage: backPage } })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .recharge-success {
    .content {
      padding: 0 0.8rem 1.28888888rem;
      background-color: #fff;
      .msg {
        padding-top: 1.82222222rem;
        text-align: center;
        font-size: @f36;
        .icon {
          margin-right: 0.26666666rem;
        }
      }
      .money {
        margin-top: 1.28888888rem;
        text-align: center;
        .unit {
          font-size: @f36;
          margin-right: 0.26666666rem;
        }
        strong {
          font-size: @f58;
        }
      }
      .btns {
        margin-top: 2.08888888rem;
        text-align: center;
        display: flex;
        justify-content: space-between;
        a {
          display: inline-block;
          width: 6.88888888rem;
          height: 1.86666666rem;
          line-height: 1.86666666rem;
          border: 1px solid @m-color;
          border-radius: 1.86666666rem;
          font-size: @f30;
          font-weight: bold;
          &:first-child {
            color: @m-color;
          }
          &:last-child {
            background-color: @m-color;
            color: @t-white-color;
          }
        }
      }
    }
  }

</style>
