<template>
  <div class="pay-tool">
    <div class="pay-tool-title border-bottom">
      <span class="icon icon-back" @click="backHandle"></span>
      <strong v-if="!errorStatus && !errorHintShow">{{title}}</strong>
      <span class="error-text" v-if="errorStatus">密码有误，你还可以输入{{errorIndex}}次</span>
      <span class="error-text" v-if="errorHintShow">账户已锁定，2小时后自动解锁</span>
    </div>
    <div class="pay-tool-content">
      <div class="pay-tool-inputs">
        <div class="item"><span class="icon_dot" v-if="password[0]"></span></div>
        <div class="item"><span class="icon_dot" v-if="password[1]"></span></div>
        <div class="item"><span class="icon_dot" v-if="password[2]"></span></div>
        <div class="item"><span class="icon_dot" v-if="password[3]"></span></div>
        <div class="item"><span class="icon_dot" v-if="password[4]"></span></div>
        <div class="item"><span class="icon_dot" v-if="password[5]"></span></div>
      </div>
      <div class="pay-tool-link"><router-link class="link" :to="{name: 'DealPwFind', params: { backPage: 'ProductDeal', id: this.$route.params.id }}">忘记密码？</router-link></div>
    </div>
    <div class="pay-tool-keyboard">
      <ul>
        <li @click="keyUpHandle" v-for="(val, index) in keys" :key="index">
          {{ val }}
        </li>
        <li class="del" @click="delHandle"><span class="icon icon-del"></span></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64'

  // let sendFlag = true // 防止重复发送密码

  export default {
    props: ['title', 'money', 'tradeNo'],
    data () {
      return {
        keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0],
        password: [],
        errorStatus: false,
        errorHintShow: false,
        errorIndex: ''
      }
    },
    methods: {
      backHandle () {
        this.clearPasswordHandle()  // 返回时清除password
        this.$emit('backFnc') // 返回上级
      },
      keyUpHandle (event) {
        let text = event.target.innerText
        let len = this.password.length
        if (!text || len >= 6) return false
        this.password.push(text)
        if (this.password.length === 6) {
          // 支付交易
          this.dealHandle()
        }
        return false
      },
      delHandle () {
        if (this.password.length <= 0) return false
        this.password.pop()
      },
      dealHandle () {
        let dealPw = Base64.encode(this.password.join(' ').replace(/\s/g, ''))
        // 交易密码验证
        this.$store.dispatch('productDeal/tradersPasswordVerify', { tradePassword: dealPw, productId: this.$route.params.id, amount: this.money, tradeNo: this.tradeNo }).then(() => {
          // 触发父组件的支付交易事件
          this.$emit('purchaseDeal', dealPw)
        }).catch((data) => {
          if (data.result && parseInt(data.result.status) === 1) {  // 交易密码错误限制
            this.errorStatus = false  // 隐藏错误次数提示
            this.errorHintShow = true // 显示限制提示
            return false
          }
          if (data.result && parseInt(data.result.status) === 0) {  //
            this.errorIndex = parseInt(data.result.surplusNum)
            this.errorStatus = true // 显示错误次数提示
            return false
          }
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: data.errorMsg,
            position: 'middle'
          })
          return false
        })
      },
      clearPasswordHandle: function () {
        this.password = []
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .pay-tool {
    position: relative;
    height: 18.93333333rem;
    background-color: #fff;
    overflow: hidden;
    &-title {
      width: 100%;
      height: 2.08888888rem;
      padding: 0 0.8rem;
      line-height: 2.08888888rem;
      text-align: center;
      overflow: hidden;
      .icon {
        float: left;
        margin-top: 0.72222222rem;
      }
      strong {
        font-size: @f36;
      }
      .error-text {
        font-size: @f30;
        color: @m-color;
      }
    }
    &-content {
      .pay-tool-inputs {
        width: 14.46666666rem;
        height: 2.31111111rem;
        margin: 1.28888888rem auto 0;
        border: 1px solid #b9b9b9;
        border-radius: 0.26666666rem;
        box-shadow: 0 0 1px #e6e6e6;
        display: flex;
        overflow: hidden;
        .item {
          width: 16.66666666%;
          height: 2.31111111rem;
          border-right: 1px solid #b9b9b9;
          line-height: 2.31111111rem;
          text-align: center;
          &:last-child {
            border-right: none;
          }
          .icon_dot {
            display: inline-block;
            width: 0.51111111rem;
            height: 0.51111111rem;
            background: url("../../assets/images/icon_dot.png") no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      .pay-tool-link {
        padding: 0.53333333rem 0.8rem 0;
        text-align: right;
        .link {
          font-size: 0.66666666rem;
          color: #3c8cfb;
        }
      }
    }
    .pay-tool-keyboard {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      ul {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        li {
          width: 33.3333%;
          height: 2.25442834rem;
          line-height: 2.25442834rem;
          text-align: center;
          border-right: 1px solid #aeaeae;
          border-bottom: 1px solid #aeaeae;
          font-size: 0.8rem;
          font-weight: bold;
          &:nth-child(1), &:nth-child(2), &:nth-child(3) {
            border-top: 1px solid #eee;
          }
          &:nth-child(3), &:nth-child(6), &:nth-child(9), &:nth-child(12) {
            border-right: none;
          }
          &:nth-child(10), &:nth-child(11), &:nth-child(12) {
            border-bottom: none;
          }
          &:nth-child(10), &:nth-child(12), &:active {
            background-color: #d1d4dd;
          }
          &:nth-child(12):active {
            background-color: #fff;
          }
        }
      }
    }
  }
</style>
