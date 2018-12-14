<template>
    <div class="check-one" @click="checkTriggerHandle"><span :class="'icon-check' + (checkStatus ? ' icon-checked' : '')"></span></div>
</template>

<script>
  export default {
    props: ['status'],
    data () {
      return {
        checkStatus: this.status
      }
    },
    methods: {
      checkTriggerHandle: function () {
        this.checkStatus = !this.checkStatus
        this.$emit('checkParentTrigger', this.checkStatus)
      }
    }
  }
</script>

<style lang="less" scoped>
  .check-one {
    display: inline-block;
    vertical-align: middle;
    .icon-check {
      display: inline-block;
      width: 0.51111111rem;
      height: 0.51111111rem;
      background: url("../../assets/images/user/icon-check.png") no-repeat center center;
      background-size: cover;
    }
    .icon-checked {
      background: url("../../assets/images/user/icon-checked.png") no-repeat center center;
      background-size: cover;
    }
  }
</style>
