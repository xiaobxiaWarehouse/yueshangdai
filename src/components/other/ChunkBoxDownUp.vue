<template>
  <div class="chunkBox-downUp-wrap">
    <div class="title border-bottom" @click="triggerHandle">
      <strong>{{title}}</strong>
      <span :class="`icon icon-arrow-${status ? 'up' : 'down'}`"></span>
    </div>
    <div :class="`chunkBox-downUp-content ${ !status || 'animate'}`">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['title', 'chunkStatus'],
    data () {
      return {
        status: this.chunkStatus || false
      }
    },
    methods: {
      triggerHandle () {
        this.status = !this.status
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .chunkBox-downUp-wrap {
    .title {
      height: 1.73333333rem;
      padding: 0 0.8rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      strong {
        font-size: @f21;
      }
    }
    .chunkBox-downUp-content {
        overflow: hidden;
        max-height: 0;
        transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
    }
    .animate {
      max-height: 9999px;
      transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
      transition-delay: 0s;
    }
  }
</style>

