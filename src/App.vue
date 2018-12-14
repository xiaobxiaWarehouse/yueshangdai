<template>
  <div id="app">
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  const Util = require('@/assets/js/util')

  export default {
    created () {
      // 初始化
      Util.init()
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import "assets/css/base.less";
</style>
