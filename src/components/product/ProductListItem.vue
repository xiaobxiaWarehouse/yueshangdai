<template>
    <div :class="`product-list-item${itemData.productStatus === '1' ? '' : ' product-list-item-gray'}`">
      <router-link :to="{ name: 'ProductDetail', params: { id: itemData.productId } }">
        <div class="item-tit">
          <strong>{{itemData.productName}}</strong>
          <Sign class="ml12" :active="(itemData.productStatus === '1')" v-for="(tag, index) in itemData.productTags" :key="index">{{tag.productTag}}</Sign>
        </div>
        <div class="item-cont clearfix">
          <div class="rate-box fl"><strong>{{itemData.apr}}%</strong><span class="item-hint">年化收益率</span></div>
          <div class="day-box"><strong>{{itemData.limit}}</strong><span class="unit-box">天</span><span class="item-hint">项目期限</span></div>
        </div>
        <ProgressBar :lineW="itemData.productStatus === '1' ? parseInt((1 - itemData.restAmount / itemData.totalAmount) * 100) : 0"></ProgressBar>
        <div class="item-other clearfix"><div class="fl">{{itemData.repayment}}</div><div class="fr">剩余<strong>{{(itemData.restAmount || 0) | moneyFormat}}</strong><span class="unit-box">元</span></div></div>
        <div class="buy-end-pic" v-if="(itemData.productStatus !== '1')"><span class="icon icon-buyend"></span></div>
      </router-link>
    </div>
</template>

<script>
  import ProgressBar from '@/components/other/ProgressBar.vue'
  import Sign from '@/components/other/Sign.vue'
  export default {
    props: ['itemData'],
    components: {
      ProgressBar,
      Sign
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .product-list-item {
    position: relative;
    width: 100%;
    padding: 0 0.44444444rem;
    margin-bottom: 0.44444444rem;
    background-color: #fff;
    .item {
      &-tit {
        padding: 0.66666666rem 0 0.93333333rem;
        strong {
          font-size: @f36;
          font-weight: 400;
        }
      }
      &-cont {
        position: relative;
        margin-bottom: 0.555555555rem;
        .rate-box {
          strong {
            display: inline-block;
            height: 1rem;
            font-size: @f58;
            color: @m-color;
          }
        }
        .item-hint {
          display: block;
          margin-top: 0.26666666rem;
          font-size: @f21;
          color: @t-two-color
        }
        .day-box {
          position: absolute;
          left: 10.17777777rem;
          bottom: 0;
          strong {
            display: inline-block;
            font-size: @f36;
          }
          .unit-box {
            font-size: @f21;
          }
        }
      }
      &-other {
        padding: 0.4rem 0 0.53333333rem;
        div {
          font-size: @f21;
          color: @t-two-color;
          strong {
            font-size: @f30;
            margin: 0 0.11111111rem;
          }
        }
      }
    }
    .buy-end-pic {
      position: absolute;
      top: 0;
      right: 0;
    }
    &-gray {
      .item-tit strong, .item-cont .rate-box strong, .item-cont .item-hint, .item-cont .day-box strong, .item-cont .day-box .unit-box, .item-other div strong, .item-other div {
        color: @t-three-color;
      }
    }
  }
</style>
