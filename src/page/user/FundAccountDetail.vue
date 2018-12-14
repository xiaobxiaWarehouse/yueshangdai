<template>
  <div class="fund-account-wrap header-occupy">
    <x-header :left-options="{backText: ''}">详情</x-header>
    <div class="fund-account-detail">
      <div class="money-box border-bottom">
        <div class="tit text-c">交易金额（元）</div>
        <div class="num text-c"><strong>{{data.tradeMoney | moneyFormat}}</strong></div>
      </div>
      <div class="list">
        <div class="item border-bottom">
          <label class="label">交易类型</label>
          <p>{{data.tradeType}}</p>
        </div>
        <div class="item border-bottom">
          <label class="label">订单号</label>
          <p>{{data.tradeOrder}}</p>
        </div>
        <div class="item border-bottom">
          <label class="label">订单时间</label>
          <p>{{data.tradeDate | dateFormat}}</p>
        </div>
        <div class="item border-bottom">
          <label class="label">本金</label>
          <p>{{data.tradeMoney | moneyFormat}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { XHeader } from 'vux'
  export default {
    components: {
      XHeader
    },
    created () {
      let id = this.$route.params.id
      this.$store.dispatch('moneyFlowDetail/getMoneyFlowDetail', { id: id }).then(() => {

      })
    },
    computed: {
      ...mapGetters({
        data: 'moneyFlowDetail/getMoneyFlowDetailData'
      })
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .fund-account-detail {
    .money-box {
      padding: 1.55555555rem 0;
      background-color: #fff;
      .tit {
        font-size: @f30;
        color: @t-two-color;
      }
      .num {
        margin-top: 0.53333333rem;
        strong {
          font-size: @f58;
        }
      }
    }
    .list {
      .item {
        padding: 0.53333333rem 0.8rem;
        background-color: #fff;
        display: flex;
        .label, p {
          font-size: @f30;
        }
        .label {
          display: inline-block;
          width: 4.4rem;
        }
      }
    }
  }
</style>
