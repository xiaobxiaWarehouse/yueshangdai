<template>
  <div class="account-pandect-wrap header-occupy">
    <x-header :left-options="{backText: ''}">账户总览</x-header>
    <div class="account-pandect-detail">
      <div class="money-box border-bottom">
        <div class="tit text-c">总资产（元）<span class="icon icon-plaint-gray" @click="titleHintHandle1"></span></div>
        <div class="num text-c"><strong>{{(data.totalAmount || 0) | moneyFormat}}</strong></div>
      </div>
      <div class="list">
        <div class="item border-bottom">
          <label class="label">可用余额（元）</label>
          <p>{{(data.availableAmount || 0) | moneyFormat}}</p>
        </div>
        <div class="item border-bottom">
          <label class="label">待收本金（元）</label>
          <p>{{(data.toBeReceivedPrincipal || 0) | moneyFormat}}</p>
        </div>
        <div class="item border-bottom">
          <label class="label">提现中金额（元）</label>
          <p>{{(data.withdrawAmount || 0) | moneyFormat}}</p>
        </div>
        <div class="item border-bottom">
          <label class="label">投资冻结金额（元）</label>
          <p>{{(data.freezeInvestment || 0) | moneyFormat}}</p>
        </div>
      </div>
      <div class="money-box mt24 border-bottom">
        <div class="tit text-c">预期收益（元）<span class="icon icon-plaint-gray" @click="titleHintHandle2"></span></div>
        <div class="num text-c"><strong>{{(data.toBeReceivedRevenue || 0) | moneyFormat}}</strong></div>
        <p class="msg">预期收益不等于实际收益，实际收益以最终收益为准</p>
      </div>
    </div>
    <div v-transfer-dom>
      <alert v-model="titleHintStatus1" button-text="我知道了">
        <p class="text-l">总资产=可用金额+待收本金+提现中金额+投资冻结金额</p>
      </alert>
    </div>
    <div v-transfer-dom>
      <alert v-model="titleHintStatus2" button-text="我知道了">
        <p class="text-l">预期收益=预期利息+红包收益</p>
      </alert>
    </div>
    <div class="spinner-box-center" v-if="loadingStatus">
      <spinner type="bubbles" size="40px"></spinner>
    </div>
  </div>
</template>

<script>
  import { Spinner, XHeader, Alert, TransferDom } from 'vux'
  import postAjax from '@/plugins/PostAjax'

  export default {
    directives: {
      TransferDom
    },
    components: {
      Spinner,
      XHeader,
      Alert
    },
    created () {
      // 获取数据
      this.getData()
    },
    data () {
      return {
        loadingStatus: true,
        data: {},
        titleHintStatus1: false,
        titleHintStatus2: false
      }
    },
    methods: {
      getData () {
        postAjax({
          url: '/api/totalFinance'
        }).then((res) => {
          let data = res.data
          if (data.success) {
            this.data = data.result
            this.loadingStatus = false
          } else {
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: data.errorMsg,
              position: 'middle'
            })
            return false
          }
        })
      },
      titleHintHandle1 () {
        this.titleHintStatus1 = true
      },
      titleHintHandle2 () {
        this.titleHintStatus2 = true
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .account-pandect-detail {
    .money-box {
      padding: 1.55555555rem 0;
      background-color: #fff;
      .tit {
        font-size: @f30;
        color: @t-two-color;
        .icon {
          margin-left: 0.26666666rem;
        }
      }
      .num {
        margin-top: 0.53333333rem;
        strong {
          font-size: @f58;
        }
      }
      .msg {
        margin-top: 0.53333333rem;
        text-align: center;
        font-size: @f21;
        color: @t-two-color;
      }
    }
    .list {
      .item {
        padding: 0.53333333rem 0.8rem;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .label, p {
          font-size: @f30;
        }
        .label {
          display: inline-block;
        }
      }
    }
  }
</style>
