<template>
    <div class="input-see-trigger">
      <div class="left"><input :type="status ? 'text' : 'password'" v-model="inputVal" @keyup="setValHandle" @blur="blurHandle" class="form-control form-text" :placeholder="msg" autocomplete="off"></div>
      <div class="right"><span :class="'icon' + (inputVal ? ' icon-see-' + (status ? 'show' : 'hide') : '')" @click="triggerStatusHandle"></span></div>
    </div>
</template>

<script>
  const Util = require('@/assets/js/util')
  export default {
    props: ['val', 'msg'],
    data () {
      return {
        status: false,
        inputVal: this.val || ''
      }
    },
    methods: {
      setValHandle: function () {
        let val = Util.trim(this.inputVal)
        this.inputVal = val
        this.$emit('setPwParent', val)
      },
      blurHandle: function () {
        this.$emit('blurParentBack')
      },
      triggerStatusHandle: function () {
        this.status = !this.status
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .input-see-trigger {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .form-text {
      font-size: @f30;
      vertical-align: middle;
    }
  }
</style>
