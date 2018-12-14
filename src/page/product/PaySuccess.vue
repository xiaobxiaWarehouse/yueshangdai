<template>
  <div class="pay-success header-occupy border-bottom">
    <x-header :left-options="{backText: ''}">投资成功</x-header>
    <div class="title"><span class="icon icon-success"></span>投资成功</div>
    <div class="hint"><span class="unit">￥</span><strong>{{this.$route.params.money | moneyFormat}}</strong></div>
    <div class="btn-box">
      <OneBtn :url="buyUrl" :status="true">继续投资</OneBtn>
    </div>
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
        buyUrl: '/product'
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

  .pay-success {
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
      .unit {
        font-size: @f36;
      }
      strong {
        font-size: @f58;
      }
    }
    .btn-box {
      margin-top: 2.06666666rem;
      padding: 0 0.8rem;
    }
  }
</style>
