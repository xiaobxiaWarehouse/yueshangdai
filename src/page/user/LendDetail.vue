<template>
  <div class="lend-wrap header-occupy">
    <x-header :left-options="{backText: ''}">出借明细</x-header>
    <div class="lend-detail">
      <div class="money-box border-bottom">
        <div class="tit text-c">应回总额<span class="icon icon-plaint-gray" @click="totalMoneyHintHandle"></span></div>
        <div class="num text-c"><strong>{{(data.investProductMoney || 0) | moneyFormat}}</strong></div>
      </div>
      <div class="lend-detail-help">
        <LumpListBox borderType="border-bottom">
          <label class="label" slot="left">起息时间</label>
          <span class="time-box" slot="center" v-if="data.startTime">{{data.startTime | dateFormat}}</span>
          <span class="time-box" slot="center" v-if="!data.startTime">待起息</span>
        </LumpListBox>
        <LumpListBox borderType="border-bottom">
          <label class="label link-label" slot="left">协议</label>
          <span class="links" slot="center"><span @click="borrowProtocolHandle">《借款协议》</span><router-link to="/riskNoteProtocol">《风险保障协议》</router-link></span>
        </LumpListBox>
      </div>
      <div class="lend-list border-bottom mt24">
        <table class="table">
          <thead>
            <tr><th>期数</th><th>应回本金（元）</th><th>利息（元）</th><th>状态</th><th>回款时间</th></tr>
          </thead>
          <tbody>
            <tr :class="trData.status === '未回款' ? '' : 'tr-gray'" v-for="(trData, index) in data.repaymentPlanDtos" :key="index"><td>{{index + 1}}</td><td>{{trData.bid | moneyFormat}}</td><td>{{trData.estimatedEarnings | moneyFormat}}</td><td>{{trData.status}}</td><td>{{trData.paybackTime | dateFormat('yyyy-MM-dd')}}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="spinner-box-center" v-if="loadingStatus">
      <spinner type="bubbles" size="40px"></spinner>
    </div>
    <div v-transfer-dom>
      <alert v-model="totalMoneyHintStatus" button-text="我知道了">
        <p class="text-l">应回总额 = 应回本金 + 应回利息总和</p>
      </alert>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Spinner, XHeader, Alert, TransferDom } from 'vux'
  import LumpListBox from '@/components/other/LumpListBox'

  import postAjax from '@/plugins/PostAjax'

  export default {
    directives: {
      TransferDom
    },
    components: {
      Spinner,
      XHeader,
      LumpListBox,
      Alert
    },
    data () {
      return {
        loadingStatus: true,
        id: this.$route.params.id,
        totalMoneyHintStatus: false
      }
    },
    created () {
      this.$store.dispatch('lendDetail/getInvestDetail', { id: this.$route.params.id }).then(() => {
        this.loadingStatus = false
      })
    },
    computed: {
      ...mapGetters({
        data: 'lendDetail/getInvestDetailData'
      })
    },
    methods: {
      borrowProtocolHandle () {
        if (!this.data.startTime) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '项目暂未起息，请您耐心等待',
            position: 'middle'
          })
          return false
        }
        postAjax({
          url: '/api/contractInfo',
          data: {
            investTradeNo: this.$route.query.investTradeNo
          }
        }).then((res) => {
          if (res.data.success) {
            window.location.href = res.data.result
          } else {
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: res.data.errorMsg,
              position: 'middle'
            })
            return false
          }
        })

        // this.$router.push({ name: 'BorrowProtocol' }) // 跳转到借款协议
      },
      totalMoneyHintHandle () {  // 累计收益提示
        this.totalMoneyHintStatus = true
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .lend-detail {
    .money-box {
      padding: 1.55555555rem 0;
      background-color: #fff;
      .tit {
        font-size: @f30;
        color: @t-two-color;
        .icon {
          margin-top: -0.1rem;
          margin-left: 0.13333333rem;
          vertical-align: middle;
        }
      }
      .num {
        margin-top: 0.53333333rem;
        .unit {
          margin-right: 0.13333333rem;
          font-size: @f36;
        }
        strong {
          font-size: @f58;
        }
      }
    }
    &-help {
      .time-box {
        margin-left: 0.53333333rem;
        font-size: @f30;
      }
      .link-label {
        display: inline-block;
        width: 3.24444444rem;
      }
      .links {
        span, a {
          font-size: @f30;
          color: @m-t-color;
        }
      }
    }
    .lend-list {
      margin-bottom: 0.53333333rem;
      background-color: #fff;
      padding: 0 0.8rem;
      .table {
        width: 100%;
        thead tr, tbody tr {
          height: 1.68888888rem;
        }
        thead tr th {
          text-align: left;
          font-size: @f21;
        }
        tbody tr td {
          font-size: @f21;
        }
        tbody tr.tr-gray td {
          color: @t-two-color;
        }
      }
    }
  }
</style>
