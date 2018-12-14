<template>
  <div class="cabinet-wrap">
    <div class="cabinet-title border-bottom" @click="triggerHandle">
      <label>{{tit}}</label>
      <span :class="'icon' + ' icon-arrow-' + (this.status[this.index] ? 'up' : 'down')"></span>
    </div>
    <div :class="'cabinet-content' + (this.status[this.index] ? ' animate border-bottom' : '')">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['title', 'status', 'index'],
    data () {
      return {
        tit: this.title
      }
    },
    methods: {
      triggerHandle () {
        this.$emit('parentTriggerCabinet', this.index)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .cabinet {
    &-wrap {
      background-color: #fff;
      .cabinet-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 2.08888888rem;
        padding: 0 0.8rem;
        line-height: 2.08888888rem;
        label {
          font-size: @f30;
        }
      }
      .cabinet-content {
        padding:0 0.8rem;
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
  }
</style>
