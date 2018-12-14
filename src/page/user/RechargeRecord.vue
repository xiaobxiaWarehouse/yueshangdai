<template>
  <div class="recharge-record-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">充值记录</x-header>
    <div class="look-detail">
      <div class="scroller-box" :style="contentStyle()">
       <div class="record-list mt24">
          <scroller :on-refresh="refreshRechargeRecord" :on-infinite="infiniteRechargeRecord" :noDataText="noDataText">
            <div class="item-box border-bottom" v-for="(item, index) in rechargeRecordData" :key="index">
              <div>
                <strong>{{item.moneyFlowStatus}}</strong>
                <span class="time">{{item.moneyFlowDate | dateFormat}}</span>
              </div>
              <div>
                <span class="num">{{(item.moneyFlowMoney || 0) | moneyFormat}}</span>
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
        rechargeRecordPageCount: 10,
        rechargeRecordPageNo: 1,
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
      this.$store.dispatch('rechargeRecord/getRechargeRecord', { pageCount: this.rechargeRecordPageCount, pageNo: 1 }).then((data) => {
        this.loadingStatus = false
        if (!data.length) {
          this.noDataStatus = true
        }
      })
    },
    computed: {
      ...mapGetters({
        rechargeRecordData: 'rechargeRecord/getRechargeRecord'
      })
    },
    methods: {
      refreshRechargeRecord (done) { // 充值记录下拉刷新
        setTimeout(() => {
          this.$store.dispatch('rechargeRecord/getRechargeRecord', { pageCount: this.rechargeRecordPageCount, pageNo: 1 })
          done()
        }, 1500)
      },
      infiniteRechargeRecord (done) {  // 充值记录上拉加载
        if (this.rechargeRecordData.length < this.rechargeRecordPageCount) {
          this.noDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.rechargeRecordPageNo + 1
          this.$store.dispatch('rechargeRecord/getMoreRechargeRecord', { pageCount: this.rechargeRecordPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.noDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.rechargeRecordPageNo = pageNo
            done()
          })
        }, 1500)
        return false
      },
      backHandle () {
        this.$router.push({ name: 'Recharge' })
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
