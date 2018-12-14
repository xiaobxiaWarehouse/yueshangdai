<template>
  <button :class="status ? 'btn btn-active' : 'btn'">
    <slot>提交</slot>
  </button>
</template>

<script>
  export default {
    props: ['status']
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .btn {
    position: relative;
    display: block;
    width: 100%;
    height: 1.82222222rem;
    line-height: 1.82222222rem;
    margin-left: auto;
    margin-right: auto;
    background-color: #ccc;
    border: none;
    font-size: @f36;
    text-align: center;
    text-decoration: none;
    color: #FFFFFF;
    border-radius: 0.91111111rem !important;
    overflow: hidden;
    &-active {
      background-color: @m-color;
      &:hover {
        background-color: @active-color;
      }
    }
  }
</style>
