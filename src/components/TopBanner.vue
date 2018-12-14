<template>
  <div class="top-banner"><img :src="picUrl" alt=""></div>
</template>

<script>
  export default {
    data () {
      return {
        picUrl: 'http://iph.href.lu/375x120?text=topBanner'
      }
    }
  }
</script>

<style lang="less" scoped>
  .top-banner {
    width: 100%;
    img {
      display: inline-block;
      width: 100%;
    }
  }
</style>
