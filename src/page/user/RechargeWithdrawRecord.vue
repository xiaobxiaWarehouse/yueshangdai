<template>
  <div class="recharge-record-wrap header-occupy">
    <x-header class="tab-header" :left-options="{backText: ''}">
      <tab :line-width="2" :custom-bar-width="getBarWidth" active-color='#ED214B' v-model="recordIndex">
        <tab-item class="vux-center" :selected="activeItem === item" v-for="(item, index) in list" @click="activeItem = item" :key="index">{{item}}</tab-item>
      </tab>
    </x-header>
    <div class="look-detail">
      <swiper v-model="recordIndex" :height="getWinHeight" :show-dots="false">
        <swiper-item :key="0" style="overflow-y: auto;">
          <div class="record-list mt24">
            <scroller :on-refresh="refreshRechargeRecord" :on-infinite="infiniteRechargeRecord">
              <div class="item-box border-bottom" v-for="(item, index) in rechargeRecordData" :key="index">
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
        </swiper-item>
        <swiper-item :key="1" style="overflow-y: auto;">
          <scroller :on-refresh="refreshWithdrawRecord" :on-infinite="infiniteWithdrawRecord">
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
        </swiper-item>
      </swiper>
    </div>
    <div class="spinner-box-center" v-if="loadingStatus">
      <spinner type="bubbles" size="40px"></spinner>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Spinner, XHeader, Tab, TabItem, Swiper, SwiperItem } from 'vux'
  import LumpListBox from '@/components/other/LumpListBox.vue'

  const list = () => ['充值记录', '提现记录']

  export default {
    components: {
      Spinner,
      XHeader,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      LumpListBox
    },
    data () {
      return {
        loadingStatus: true,
        list: list(),
        activeItem: '充值记录',
        recordIndex: this.$route.params.tabIndex,
        rechargeRecordPageCount: 10,
        rechargeRecordPageNo: 1,
        withdrawRecordPageCount: 10,
        withdrawRecordPageNo: 1,
        getBarWidth: function (index) {
          return Math.ceil(parseFloat(document.getElementsByTagName('html')[0].style.fontSize) * 2) + 'px'
        }
      }
    },
    created () {
      if (this.$route.params.tabIndex === 0) {  // 充值记录
        this.$store.dispatch('rechargeWithdrawRecord/getRechargeRecord', { pageCount: this.rechargeRecordPageCount, pageNo: 1 }).then(() => {
          this.loadingStatus = false
        })
      }
      if (this.$route.params.tabIndex === 1) {  // 提现记录
        this.$store.dispatch('rechargeWithdrawRecord/getWithdrawRecord', { pageCount: this.withdrawRecordPageCount, pageNo: 1 }).then(() => {
          this.loadingStatus = false
        })
      }
    },
    computed: {
      ...mapGetters({
        rechargeRecordData: 'rechargeWithdrawRecord/getRechargeRecord',
        withdrawRecordData: 'rechargeWithdrawRecord/getWithdrawRecord'
      }),
      getWinHeight: function () {
        let html = document.getElementsByTagName('html')[0]
        return html.getBoundingClientRect().height - Math.ceil(3.81111111 * parseFloat(html.style.fontSize)) + 'px'
      }
    },
    methods: {
      refreshRechargeRecord (done) { // 充值记录下拉刷新
        setTimeout(() => {
          this.$store.dispatch('rechargeWithdrawRecord/getRechargeRecord', { pageCount: this.rechargeRecordPageCount, pageNo: 1 })
          done()
        }, 1500)
      },
      infiniteRechargeRecord (done) {  // 充值记录上拉加载
        if (this.rechargeRecordData.length < this.rechargeRecordPageCount) {
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.rechargeRecordPageNo + 1
          this.$store.dispatch('rechargeWithdrawRecord/getMoreRechargeRecord', { pageCount: this.rechargeRecordPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              done(true)
              return false
            }
            this.rechargeRecordPageNo = pageNo
            done()
          })
        }, 1500)
        return false
      },
      refreshWithdrawRecord (done) {  // 提现记录下拉刷新
        setTimeout(() => {
          this.$store.dispatch('rechargeWithdrawRecord/getWithdrawRecord', { pageCount: this.withdrawRecordPageCount, pageNo: 1 })
          done()
        }, 1500)
      },
      infiniteWithdrawRecord (done) {  // 充值记录上拉加载
        if (this.withdrawRecordData.length < this.withdrawRecordPageCount) {
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.withdrawRecordPageNo + 1
          this.$store.dispatch('rechargeWithdrawRecord/getMoreWithdrawRecord', { pageCount: this.withdrawRecordPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              done(true)
              return false
            }
            this.withdrawRecordPageNo = pageNo
            done(true)
          })
        }, 1500)
        return false
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .recharge-record-wrap {
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
