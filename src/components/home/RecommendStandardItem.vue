<template>
  <div class="wrap-box recommend-standard-wrap mt10">
    <div class="content">
      <div class="load-more-box" v-if="loadMoreStatus">
        <load-more tip="正在加载"></load-more>
      </div>
      <div v-if="!loadMoreStatus">
        <div class="sign-title">
          <Sign :active="true" class="mr10">{{data.productTypeName}}</Sign><span class="sign-slogan">优质资产 身心投资</span>
        </div>
        <div class="sign-apr"><strong>{{data.apr}}<sub class="apr-tips">%</sub></strong></div>
        <div class="sign-hint"><span class="money">剩余金额<strong class="num-box">{{(data.leftAmount || 0) | moneyFormat}}</strong><strong class="unit-box">元</strong></span><span class="day">服务期限<strong class="num-box">{{data.limit}}</strong><strong class="unit-box">{{dateUnit[data.limitUnit]}}</strong></span></div>
        <div class="buy-btn">
          <router-link :to="{ name: 'ProductDetail', params: { id: data.productId, backPage: 'Home' } }">立即购买</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { LoadMore, XButton, Box } from 'vux'
  import Sign from '@/components/other/Sign'

  export default {
    components: {
      LoadMore,
      XButton,
      Box,
      Sign
    },
    data () {
      return {
        loadMoreStatus: true,
        dateUnit: ['天', '个月', '年']
      }
    },
    created () {
      this.$store.dispatch('home/getRecommendStandard').then((data) => {
        if (data.productId) {
          this.loadMoreStatus = false
        }
      })
    },
    computed: {
      ...mapGetters({
        data: 'home/getRecommendStandardData'
      })
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .recommend-standard-wrap {
    width: 100%;
    padding: 1.15555555rem 0;
    .content, .load-more-box {
      height: 11.77777777rem;
    }
    .load-more-box {
      display: flex;
      align-items: center;
    }
    .sign-title, .sign-apr, .sign-hint {
      width: 100%;
      text-align: center;
    }

    .sign-name {
      color: #0b97c4;
    }

    .sign-slogan {
      font-size: @f30;
      color: @t-two-color;
    }

    .sign-apr {
      margin-top: 1.42222222rem;
      text-align: center;
      strong {
        font-size: @f130;
        color: #ed214b;
        .apr-tips {
          margin-left: 5px;
          font-size: @f58;
        }
      }
    }

    .sign-hint {
      margin-top: 1.55555555rem;
      .money, .day {
        color: @t-two-color;
        font-size: @f21;
      }
      .day {
        margin-left: 1.15555555rem;
      }
      .num-box {
        margin-left: 10px;
        font-size: @f36;
        color: #ed214b;
      }
      .unit-box {
        margin-left: 5px;
        font-size: @f30;
        font-weight: 100;
        color: #ed214b;
      }
    }

    .buy-btn {
      width: 9.02222222rem;
      margin: 1.15555555rem auto 0;
      a {
        display: block;
        width: 100%;
        height: 1.82222222rem;
        background-color: @m-color;
        border-radius: 0.91111111rem;
        line-height: 1.82222222rem;
        text-align: center;
        font-size: @f36;
        color: #fff;
      &:hover {
        background-color: @active-color;
      }
      }
    }
  }
</style>
