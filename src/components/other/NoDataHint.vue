<template>
  <div class="noDataHint-wrap">
    <div class="pic"></div>
    <p class="text">当前页面没有内容哦~</p>
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .noDataHint-wrap {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 9.6rem;
    margin-top: -4.8rem;
    text-align: center;
    .pic {
      display: inline-block;
      width: 9.15555555rem;
      height: 7.02222222rem;
      background: url("../../assets/images/noDataHint_pic.png") no-repeat;
      background-size: 100% 100%;
    }
    .text {
      margin-top: 1.55555555rem;
      font-size: 0.62222222rem;
      color: #999;
    }
  }
</style>

