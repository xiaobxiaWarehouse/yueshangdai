<template>
  <router-link :to="`/user/fundAccountDetail/${data.moneyFlowId}`">
    <div class="fund-account-item border-bottom">
      <div class="text" slot="left">
        <strong>{{data.moneyFlowStatus}}</strong>
        <span>{{data.moneyFlowDate | dateFormat}}</span>
      </div>
      <span class="num" slot="right">{{data.moneyFlowMoney | moneyFormat}}</span>
    </div>
  </router-link>
</template>

<script>
  import LumpListBox from '@/components/other/LumpListBox'

  export default {
    props: ['data'],
    components: {
      LumpListBox
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .fund-account-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 2.08888888rem;
    padding: 0 0.8rem;
    background-color: #fff;
    .text {
      strong {
        font-size: @f30;
      }
      span {
        display: block;
        margin-top: 0.11111111rem;
        font-size: @f21;
        color: @t-two-color;
      }
    }
    .num {
      font-size: @f30;
    }
  }
</style>
