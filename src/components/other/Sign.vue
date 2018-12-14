<template>
    <span :class="classNames"><slot></slot></span>
</template>

<script>
    export default {
      props: ['active'],
      data () {
        return {
          classNames: 'sign-box' + (this.active ? ' sign-box-active' : '')
        }
      }
    }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .sign-box {
    display: inline-block;
    padding: 0.11111111rem 0.33333333rem;
    border: 1px solid @noSelect-color;
    border-radius: 0.5rem;
    font-size: @f21;
    color: @noSelect-color;
    &-active {
      border-color: @m-color;
      color: @m-color;
    }
  }
</style>
