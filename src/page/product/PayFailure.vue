<template>
    <div class="pay-failure header-occupy">
      <x-header :left-options="{backText: ''}">投资失败</x-header>
      <div class="content border-bottom">
        <div class="title"><span class="icon icon-lose"></span>投资失败</div>
        <div class="hint">订单异常，请重新投资</div>
        <div class="btn-box">
          <OneBtn :url="buyUrl" :status="true">重新投资</OneBtn>
        </div>
      </div>
      <div class="hint-msg"><p>联系客服：400-8577600</p></div>
    </div>
</template>

<script>
  import { XHeader } from 'vux'
  import OneBtn from '@/components/other/OneBtn'

  export default {
    components: {
      XHeader,
      OneBtn
    },
    data () {
      return {
        buyUrl: '/product/deal/' + this.$route.params.productId
      }
    },
    created () {
      // 更新用户信息
      this.$store.dispatch('login/updateUserInfo')
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .pay-failure {
    .content {
      padding-bottom: 1.33333333rem;
      background-color: #fff;
      .title {
        width: 100%;
        padding-top: 1.73333333rem;
        text-align: center;
        font-size: @f36;
        .icon {
          margin-right: 0.53333333rem;
        }
      }
      .hint {
        margin-top: 1.28888888rem;
        text-align: center;
        font-size: @f21;
        color: @t-two-color;
      }
      .btn-box {
        margin-top: 2.06666666rem;
        padding: 0 0.8rem;
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
