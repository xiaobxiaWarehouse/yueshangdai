<template>
  <div class="recharge-lose header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">充值失败<router-link :to="{ name: 'RechargeRecord' }" slot="right">充值记录</router-link></x-header>
    <div class="content">
      <div class="msg"><span class="icon icon-lose"></span>充值失败</div>
      <div class="hint">订单异常，请重新充值</div>
      <div class="btns"><router-link :to="{name: 'Recharge', params: { id: paramsId, backPage: paramsBackPage }}">重新充值</router-link></div>
    </div>
    <div class="hint-msg"><p>联系客服：400-857-7600</p></div>
  </div>
</template>

<script>
  import { XHeader } from 'vux'

  export default {
    components: {
      XHeader
    },
    methods: {
      data () {
        return {
          paramsId: this.$route.params.id,
          paramsBackPage: this.$route.params.backPage
        }
      },
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
  .recharge-lose {
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
      .hint {
        margin-top: 1.28888888rem;
        text-align: center;
        font-size: @f30;
        color: @t-two-color;
      }
      .btns {
        margin-top: 2.08888888rem;
        text-align: center;
        display: flex;
        justify-content: space-between;
        a {
          display: inline-block;
          width: 100%;
          height: 1.86666666rem;
          line-height: 1.86666666rem;
          background-color: @m-color;
          border: 1px solid @m-color;
          border-radius: 1.86666666rem;
          font-size: @f30;
          font-weight: bold;
          color: @t-white-color;
        }
      }
    }
    .hint-msg {
      width: 100%;
      position: absolute;
      bottom: 1.37777777rem;
      p {
        width: 100%;
        text-align: center;
        font-size: @f30;
        color: @t-two-color;
      }
    }
  }
</style>
