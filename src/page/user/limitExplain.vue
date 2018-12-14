<template>
  <div class="bank-list-wrap header-occupy">
    <x-header :left-options="{backText: ''}">限额说明</x-header>
    <div class="content">
      <div class="list-title">
        <span>仅支持借记卡</span>
      </div>
      <div class="list">
        <div class="item border-bottom" v-for="(item) in data" :key="parseInt(item.bankCode)">
          <div class="icon-box">
            <span :class="`icon icon-bank icon-bank-${parseInt(item.bankCode)}`"></span>
          </div>
          <div class="text">
            <strong>{{item.bankName}}</strong>
            <span>单笔{{item.perLimit || 0}}元</span><span>单日{{(item.dayLimit || 0) / 10000}}万元</span>
          </div>
        </div>
      </div>
    </div>
    <div class="spinner-box-center" v-if="loadingStatus">
      <spinner type="bubbles" size="40px"></spinner>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Spinner, XHeader } from 'vux'

  export default {
    components: {
      Spinner,
      XHeader
    },
    data () {
      return {
        loadingStatus: true
      }
    },
    created () {
      this.$store.dispatch('bankList/getBankList').then(() => {
        this.loadingStatus = false
      })
    },
    computed: {
      ...mapGetters({
        data: 'bankList/getBankList'
      })
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .bank-list-wrap {
    .content {
      .list-title {
        height: 1.28888888rem;
        padding: 0 0.8rem;
        line-height: 1.28888888rem;
        span {
          font-size: @f21;
          color: @t-two-color;
        }
      }
      .list {
        padding-bottom: 0.8rem;
        .item {
          display: flex;
          align-items: center;
          height: 2.08888888rem;
          padding: 0 0.8rem;
          background-color: #fff;
          .text {
            margin-left: 0.53333333rem;
            strong {
              display: block;
              font-size: @f30;
              font-weight: 100;
            }
            span {
              display: inline-block;
              margin-top: 0.13333333rem;
              margin-right: 0.26666666rem;
              font-size: @f21;
              color: @t-two-color;
            }
          }
        }
      }
    }
  }
</style>
