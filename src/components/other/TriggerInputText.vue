<template>
    <div class="trigger-inputText">
      <div class="write-box">
        <input type="number" v-model="money" :class="'form-control form-text' + (fontSizeType === 'big' ? ' form-text-big' : '') + (status ? ' hide' : '')" @blur="triggerHandle" :placeholder="msg" v-focus>
      </div>
      <p :class="'text' + (fontSizeType === 'big' ? ' text-big' : '') + (status ? '' : ' hide')" @click="textHandle"><span class="unit" v-if="unit === 'left'">￥</span>{{money | moneyFormat}}<span class="unit" v-if="unit === 'right'">元</span></p>
    </div>
</template>

<script>
  export default {
    props: ['msg', 'num', 'unit', 'fontSizeType'],
    data () {
      return {
        money: this.num || '',
        status: !!this.num
      }
    },
    methods: {
      triggerHandle: function () {
        this.$emit('getMoney', { money: this.money })
        this.status = !!this.money
      },
      textHandle: function () {
        this.status = false
      }
    },
    directives: {
      focus: {
        // 指令的定义
        componentUpdated: function (el) {
          el.focus()
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../../assets/css/util.less";

  .trigger-inputText {
    position: relative;
    width: 100%;
    .write-box {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      z-index: 2;
      .form-text {
        font-size: @f21;
        color: @t-one-color;
      }
      .form-text-big {
        font-size: @f36;
      }
    }
    .text {
      position: absolute;
      left: 0;
      top: 0;
      font-size: @f36;
      font-weight: bold;
      z-index: 3;
      .unit {
        margin-left: 0.26666666rem;
        font-size: @f30;
      }
    }
    .text-big {
      font-size: @f58;
      .unit {
        font-size: @f36;
      }
    }
  }
</style>
