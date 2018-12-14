<template>
  <div class="popHint-wrap popHint-registerHint" v-if="status">
    <div class="popHint-mask"></div>
    <span class="popHint-close" @click="closeHandle"></span>
    <div class="popHint-content register-hint">
      <router-link class="a-link" :to="{ name: 'Register' }"></router-link>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['showStatus'],
    data () {
      return {
        status: this.showStatus
      }
    },
    methods: {
      closeHandle () {
        this.status = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .popHint-wrap {
    .popHint-mask {
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0,0,0,.6);
    }
    .popHint-content {
      position: fixed;
      top: 50%;
      left: 50%;
    }
    .popHint-close {
      display: inline-block;
      position: fixed;
      top: 1.95555555rem;
      right: 1.95555555rem;
      width: 1.02222222rem;
      height: 1.02222222rem;
      background: url("../../assets/images/home/home_popHint_close.png") no-repeat;
      background-size: 100% 100%;
      z-index: 1001;
    }
  }
  .popHint-registerHint {
    .register-hint {
      width: 16rem;
      height: 13.26666666rem;
      margin: -6.63333333rem 0 0 -8rem;
      background: url("../../assets/images/home/home_popHint_bg.png") no-repeat;
      background-size: 100% 100%;
      z-index: 1001;
      .a-link {
        position: absolute;
        left: 50%;
        bottom: 0.93333333rem;
        display: inline-block;
        width: 6.31111111rem;
        height: 1.66666666rem;
        margin: 0 0 0 -3.15555555rem;
        background: url("../../assets/images/home/home_popHint_btn.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }

</style>
