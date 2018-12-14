<template>
  <div class="recharge-record-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">提现记录</x-header>
    <div class="look-detail">
      <div class="scroller-box" :style="contentStyle()">
       <div class="record-list mt24">
          <scroller :on-refresh="refreshWithdrawRecord" :on-infinite="infiniteWithdrawRecord" :noDataText="noDataText">
            <div class="item-box border-bottom" v-for="(item, index) in withdrawRecordData" :key="index">
              <div>
                <strong>{{item.moneyFlowStatus}}</strong>
                <span class="time">{{item.moneyFlowDate | dateFormat}}</span>
              </div>
              <div>
                <span class="num">{{item.moneyFlowMoney | moneyFormat}}</span>
              </div>
            </div>
          </scroller>
        </div>
        <NoDataHint v-if="noDataStatus"></NoDataHint>
      </div>
    </div>
    <div class="spinner-box-center" v-if="loadingStatus">
      <spinner type="bubbles" size="40px"></spinner>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Spinner, XHeader } from 'vux'
  import NoDataHint from '@/components/other/NoDataHint'

  export default {
    components: {
      Spinner,
      XHeader,
      NoDataHint
    },
    data () {
      return {
        loadingStatus: true,
        noDataText: '没有更多数据了',
        noDataStatus: false,
        withdrawRecordPageCount: 10,
        withdrawRecordPageNo: 1,
        contentStyle: function () {
          let html = document.getElementsByTagName('html')[0]
          let h = html.getBoundingClientRect().height - Math.ceil(1.9 * parseFloat(html.style.fontSize))
          return `height: ${h}px`
        },
        getBarWidth: function (index) {
          return Math.ceil(parseFloat(document.getElementsByTagName('html')[0].style.fontSize) * 2) + 'px'
        }
      }
    },
    created () {
      this.$store.dispatch('withdrawRecord/getWithdrawRecord', { pageCount: this.withdrawRecordPageCount, pageNo: 1 }).then((data) => {
        this.loadingStatus = false
        if (!data.length) {
          this.noDataStatus = true
        }
      })
    },
    computed: {
      ...mapGetters({
        withdrawRecordData: 'withdrawRecord/getWithdrawRecord'
      })
    },
    methods: {
      refreshWithdrawRecord (done) {  // 提现记录下拉刷新
        setTimeout(() => {
          this.$store.dispatch('withdrawRecord/getWithdrawRecord', { pageCount: this.withdrawRecordPageCount, pageNo: 1 })
          done()
        }, 1500)
      },
      infiniteWithdrawRecord (done) {  // 充值记录上拉加载
        if (this.withdrawRecordData.length < this.withdrawRecordPageCount) {
          this.noDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.withdrawRecordPageNo + 1
          this.$store.dispatch('withdrawRecord/getMoreWithdrawRecord', { pageCount: this.withdrawRecordPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.noDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.withdrawRecordPageNo = pageNo
            done(true)
          })
        }, 1500)
        return false
      },
      backHandle () {
        this.$router.push({ name: 'Repayment' })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .recharge-record-wrap {
    .scroller-box {
      position: relative;
    }
    .record-list {
      .item-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 2.57777777rem;
        padding: 0 0.8rem;
        background-color: #fff;
        div:first-child {
          strong {
            font-size: @f30;
            font-weight: 100;
          }
          span {
            display: block;
            margin-top: 0.11111111rem;
            font-size: @f21;
            color: @t-two-color;
          }
        }
        div:last-child {
          .num {
            font-size: @f30;
          }
        }
      }
    }
  }
</style>
