<template>
  <div :class="'lump-list-box' + borderClass + ' clearfix'">
    <slot name="left"></slot>
    <slot name="center"></slot>
    <slot name="right"></slot>
  </div>
</template>

<script>
  export default {
    props: ['borderType'],
    data () {
      return {
        borderClass: this.borderType ? ' ' + this.borderType : ''
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .lump-list-box {
    position: relative;
    width: 100%;
    height: 2.08888888rem;
    padding: 0 0.8rem;
    background-color: #fff;
    line-height: 2.08888888rem;
    overflow: hidden;
    .label {
      font-size: @f30;
    }
  }
</style>
