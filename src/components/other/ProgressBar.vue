<template>
    <div class="progress-bar"><span class="line" :style="{ width: lineW + '%' }"></span></div>
</template>

<script>
  export default {
    props: ['lineW']
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .progress-bar {
    width: 100%;
    height: 3px;
    background-color: @noSelect-color;
    .line {
      display: block;
      height: 3px;
      background-color: @m-color;
    }
  }
</style>
