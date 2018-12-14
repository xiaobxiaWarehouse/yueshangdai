<template>
  <div class="bank-list-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">银行列表</x-header>
    <div class="content">
      <div class="list-title">
        <span>仅支持借记卡</span>
      </div>
      <div class="list">
        <div class="item border-bottom" v-for="(item) in data" :key="parseInt(item.bankCode)" @click="selectBankHandle(item)">
          <div class="icon-box">
            <span :class="`icon icon-bank icon-bank-${parseInt(item.bankCode)}`"></span>
          </div>
          <div class="text">
            <strong>{{item.bankName}}</strong>
            <span>单笔{{item.perLimit}}元</span><span>单日{{item.dayLimit}}元</span>
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
        paramsId: this.$route.params.id,
        paramsBackPage: this.$route.params.backPage,
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
    },
    methods: {
      selectBankHandle (item, index) {
        this.$store.dispatch('bankList/setSelectBankInfo', {
          bankCode: item.bankCode,
          bankName: item.bankName,
          dayLimit: item.dayLimit,
          perLimit: item.perLimit
        })
        this.$router.push({ name: 'RealNameCard', params: { page: 'realNameCard', id: this.paramsId, backPage: this.paramsBackPage } })
      },
      backHandle () {
        this.$router.push({ name: 'RealNameCard', params: { page: 'realNameCard', id: this.paramsId, backPage: this.paramsBackPage } })
      }
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
