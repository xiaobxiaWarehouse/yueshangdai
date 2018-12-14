<template>
  <div class="apr-box">
    <div class="apr-tit">年化收益率</div>
    <div class="apr-num">{{apr}}<span class="unit">%</span></div>
    <div class="apr-hint"><slot name="hint"></slot></div>
  </div>
</template>

<script>
  export default {
    props: ['apr']
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .apr-box {
    text-align: center;
    .apr {
      &-tit {
        padding-top: 1.55555555rem;
        font-size: @f36;
      }
      &-num {
        margin-top: 0.55555555rem;
        font-size: 2.88888888rem;
        color: @m-color;
        .unit {
          margin-left: 0.26666666rem;
          font-size: 1.28888888rem;
        }
      }
      &-hint {
        margin: 1.28888888rem 0 0.93333333rem;
        font-size: @f21;
        color: @t-two-color;
      }
    }
  }
</style>
