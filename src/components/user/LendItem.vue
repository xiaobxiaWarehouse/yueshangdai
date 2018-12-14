<template>
  <div :class="'lend-item' + (status ? '' : ' lend-item-gray') + ' mt24'">
    <router-link :to="{path: `/user/lendDetail/${data.investTradeNo}`, query: { investTradeNo: data.investTradeNo }}">
      <div class="title"><strong>{{data.investProductName}}</strong><span>{{data.investProductStatus}}</span></div>
      <div class="content">
        <ul class="lists">
          <li><label>出借时间</label><span>{{data.investDate | dateFormat}}</span></li>
          <li><label>出借金额</label><span>{{data.investProductMoney | moneyFormat}}元</span></li>
          <li><label>预期利息</label><span>{{data.investProductIncome | moneyFormat}}元</span></li>
          <li><label>年化利率</label><span>{{data.investApr}}%</span></li>
          <li><label>使用优惠</label><span>{{data.investProductUseDiscount || '无'}}</span></li>
        </ul>
        <div class="link-box"><span class="icon icon-arrow-right"></span></div>
      </div>
    </router-link>
  </div>
</template>

<script>
  export default {
    props: ['data'],
    data () {
      return {
        status: this.data.investProductStatus === '募集中'
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .lend-item {
    background-color: #fff;
    .title {
      height: 1.68888888rem;
      padding: 0 0.8rem;
      background-color: #fde8ed;
      line-height: 1.68888888rem;
      display: flex;
      justify-content: space-between;
      strong, span {
        font-size: @f30;
        font-weight: 100;
      }
      span {
        color: @m-color;
      }
    }
    .content {
      position: relative;
      width: 100%;
      padding: 0.53333333rem 0.8rem;
      margin-bottom: 0.53333333rem;
      .lists {
        li {
          width: 100%;
          margin-bottom: 0.53333333rem;
          label {
            margin-right: 0.64444444rem;
            font-size: @f30;
            color: @t-two-color;
          }
          span {
            font-size: @f30;
          }
        }
      }
      .link-box {
        position: absolute;
        top: 50%;
        right: 0.8rem;
        margin-top: -0.32222222rem;
      }
    }
    &-gray {
      .title {
        background-color: #eee;
        strong, span {
          color: @t-two-color;
        }
      }
      .content {
        .lists {
          li {
            span {
              color: @t-two-color;
            }
          }
        }
      }
    }
  }
</style>
