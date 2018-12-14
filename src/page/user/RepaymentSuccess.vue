<template>
  <div class="repayment-success header-occupy">
    <x-header :left-options="{backText: ''}">提现成功<router-link :to="{ name: 'WithdrawRecord' }" slot="right">提现记录</router-link></x-header>
    <div class="content">
      <div class="msg"><span class="icon icon-success"></span>提现成功</div>
      <div class="money"><span class="unit">￥</span><strong>{{(repaymentInfo.repaymentMoney || 0) | moneyFormat}}</strong></div>
      <div class="step">
        <div class="step-line">
          <span class="one active"></span>
          <span class="two"></span>
        </div>
        <div class="item">
          <span class="step-num active">1</span>
          <div class="right">
            <strong>提现申请已提交</strong>
            <span>提现至{{userInfo.data.bankName}}（{{userInfo.data.bankNo | bankCardFormat('尾号')}}）</span>
          </div>
        </div>
        <div class="item">
          <span class="step-num">2</span>
          <div class="right">
            <strong>实际到账{{repaymentInfo.money | moneyFormat}}元</strong>
            <span>预计1-2个工作日到账</span>
          </div>
        </div>
      </div>
      <div class="btns"><router-link to="/product">去投资</router-link></div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { XHeader } from 'vux'

  export default {
    components: {
      XHeader
    },
    created () {
      this.$store.dispatch('login/updateUserInfo')  // 更新用户信息
    },
    computed: {
      ...mapGetters({
        repaymentInfo: 'repayment/getRepaymentInfo',
        userInfo: 'login/getUserInfo'
      })
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .repayment-success {
    .content {
      padding: 0 0.8rem 1.28888888rem;
      background-color: #fff;
      .msg {
        padding-top: 1.82222222rem;
        text-align: center;
        font-size: @f36;
        .icon {
          margin-right: 0.26666666rem;
        }
      }
      .money {
        margin-top: 1.28888888rem;
        text-align: center;
        .unit {
          font-size: @f36;
          margin-right: 0.26666666rem;
        }
        strong {
          font-size: @f58;
        }
      }
      .step {
        position: relative;
        width: 7.6666rem;
        margin: 1.68888888rem auto 0;
        .item {
          display: flex;
          height: 1.51111111rem;
          margin-bottom: 0.8rem;
          .step-num {
            position: relative;
            display: block;
            width: 0.77777777rem;
            height: 0.77777777rem;
            background-color: #ccc;
            text-align: center;
            line-height: 0.77777777rem;
            border-radius: 0.77777777rem;
            color: #fff;
            font-size: @f21;
            z-index: 3;
            &.active {
              background-color: @m-t-color;
            }
          }
          .right {
            margin-left: 0.26666666rem;
            strong {
              display: block;
              font-size: @f30;
            }
            span {
              display: block;
              margin-top: 0.26666666rem;
              font-size: @f21;
              color: @t-two-color;
            }
          }
        }
        .step-line {
          position: absolute;
          top: 0.38888888rem;
          left: 0.38888888rem;
          width: 1px;
          height: 2.31111111rem;
          z-index: 2;
          .one, .two {
            display: block;
            width: 1px;
            height: 1.15555555rem;
            background-color: #ccc;
            &.active {
              background-color: @m-t-color;
            }
          }
        }
      }
      .btns {
        margin-top: 1.28888888rem;
        text-align: center;
        display: flex;
        justify-content: space-between;
        a {
          display: inline-block;
          width: 100%;
          height: 1.86666666rem;
          line-height: 1.86666666rem;
          background-color: @m-color;
          border: 1px solid @m-color;
          border-radius: 1.86666666rem;
          font-size: @f30;
          font-weight: bold;
          color: @t-white-color;
        }
      }
    }
  }

</style>
