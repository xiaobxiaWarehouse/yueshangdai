<template>
  <div class="notices-item">
    <div class="time-box"><span class="time">{{data.messageCreateTime | dateFormat}}</span></div>
    <div class="text">
      <h3 class="text-c">{{data.messageTitle}}</h3>
      <p>{{data.messageContent}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['data']
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .notices-item {
    padding: 0 0.8rem;
    .time-box {
      width: 100%;
      margin: 0.66666666rem 0.53333333rem;
      text-align: center;
      .time {
        display: inline-block;
        padding: 0.26666666rem 1.15555555rem;
        background-color: #eee;
        border-radius: 3rem;
        font-size: @f30;
      }
    }
    .text {
      width: 100%;
      padding: 0.8rem 0.8rem 0.66666666rem;
      background-color: #fff;
      border-radius: 0.22222222rem;
      h3 {
        margin-bottom: 0.53333333rem;
        font-size: @f30;
      }
      p {
        font-size: @f21;
        color: @t-two-color;
        line-height: 0.66666666rem;
      }
    }
  }

</style>
