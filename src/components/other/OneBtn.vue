<template>
  <div :class="'btn-one-box' + (status ? ' active' : '')">
    <router-link :to="url"><slot></slot></router-link>
  </div>
</template>

<script>
  export default {
    props: ['url', 'status']
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .btn-one-box {
    width: 100%;
    margin: 0 auto;
    overflow: hidden;
    a {
      display: block;
      width: 100%;
      height: 1.82222222rem;
      line-height: 1.82222222rem;
      text-align: center;
      background-color: @noSelect-color;
      border-radius: 0.91111111rem;
      font-size: @f36;
      color: #fff;
    }
    &.active {
      a {
        background-color: @m-color;
      }
    }
  }
  .btn-one-box-straight {
    a {
      border-radius: 0;
    }
  }
</style>
