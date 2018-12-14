<template>
  <div class="wrap-box platform-data">
    <div class="title">平台数据</div>
    <div class="load-more-box" v-if="loadMoreStatus">
      <load-more tip="正在加载"></load-more>
    </div>
    <div class="content" v-if="!loadMoreStatus">
      <div class="ui-guide platform-data-num">
        <div class="ui-col-3">
          <strong class="num-box">{{(data.totalInvest || 0) / 10000 | moneyFormat}}</strong><strong class="unit-box">万元</strong>
          <span class="txt">累计成交额</span>
        </div>
        <div class="ui-col-3">
          <strong class="num-box">{{data.totalNumber || 0}}</strong><strong class="unit-box">人</strong>
          <span class="txt">理财用户</span>
        </div>
        <div class="ui-col-3">
          <strong class="num-box">{{(data.totalIncome || 0) / 10000 | moneyFormat}}</strong><strong class="unit-box">万元</strong>
          <span class="txt">为用户赚取收益</span>
        </div>
      </div>
      <div class="guide-pic">
        <div class="ui-guide">
          <div class="ui-col-3">
            <div class="pic"><img src="../../assets/images/home/pic_data_cx.png"/></div>
            <div class="text">诚信经营<br>品质服务</div>
          </div>
          <div class="ui-col-3">
            <div class="pic"><img src="../../assets/images/home/pic_data_ym.png"/></div>
            <div class="text">严密专业<br>风控体系</div>
          </div>
          <div class="ui-col-3">
            <div class="pic"><img src="../../assets/images/home/pic_data_pt.png"/></div>
            <div class="text">平台信息<br>定期披露</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { LoadMore, Grid, GridItem } from 'vux'

  export default {
    components: {
      LoadMore,
      Grid,
      GridItem
    },
    data () {
      return {
        loadMoreStatus: true
      }
    },
    created () {
      this.$store.dispatch('home/getPlatformData').then((data) => {
        if (data.totalNumber) {
          this.loadMoreStatus = false
        }
      })
    },
    computed: {
      ...mapGetters({
        data: 'home/getPlatformData'
      })
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .platform-data {
    padding: 1.15555555rem 0;
    margin-bottom: 0.53333333rem;
    .title {
      text-align: center;
      font-size: @f30;
      font-weight: bold;
    }
    .content, .load-more-box {
      height: 6.02222222rem;
    }
    .load-more-box {
      display: flex;
      align-items: center;
    }
    .content {
      .ui-guide {
        justify-content: space-around;
      }
      .platform-data-num {
        margin-top: 1.28888888rem;
      }
      .num-box {
        font-size: @f36;
      }
      .unit-box {
        margin-left: 5px;
        font-size: @f21;
        color: @t-two-color;
      }
      .txt {
        display: block;
        font-size: @f21;
        color: @t-two-color;
      }
    }
    .guide-pic {
      width: 100%;
      margin-top: 0.88888888rem;
      text-align: center;
      .pic {
        width: 2.06666666rem;
        height: 2.06666666rem;
        margin: 0 auto;
        img {
          display: inline-block;
          width: 100%;
          height: auto;
        }
      }
      .text {
        margin-top: 10px;
        font-size: @f21;
        color: @t-two-color;
      }
    }
  }
</style>
