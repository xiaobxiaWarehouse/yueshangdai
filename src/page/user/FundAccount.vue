<template>
  <div class="fund-account-wrap header-occupy">
    <x-header :left-options="{backText: ''}">资金流水</x-header>
    <div class="page-tab-title mt24">
      <tab :line-width="2" active-color='#ED214B' :custom-bar-width="getTabBarWidth" v-model="itemIndex">
        <tab-item class="vux-center" :selected="activeItem === item" v-for="(item, index) in list" @click="activeItem = item" :key="index">{{item}}</tab-item>
      </tab>
    </div>
    <div class="content">
      <swiper v-model="itemIndex" :height="getWinHeight" :threshold="80" :show-dots="false">
        <swiper-item :key="0" style="overflow-y: auto;">
          <scroller :on-refresh="refreshMoneyFlow" :on-infinite="infiniteMoneyFlow" :noDataText="moneyFlowNoDataText">
            <FundAccounItem v-for="(itemData, index) in moneyFlowData" :data="itemData" :key="index"></FundAccounItem>
          </scroller>
          <NoDataHint v-if="moneyFlowNoDataStatus"></NoDataHint>
        </swiper-item>
        <swiper-item :key="1" style="overflow-y: auto;">
          <scroller :on-refresh="refreshLoan" :on-infinite="infiniteLoan" :noDataText="loanTypeNoDataText">
            <FundAccounItem v-for="(itemData, index) in loanData" :data="itemData" :key="index"></FundAccounItem>
          </scroller>
          <NoDataHint v-if="loanNoDataStatus"></NoDataHint>
        </swiper-item>
        <swiper-item :key="2" style="overflow-y: auto;">
          <scroller :on-refresh="refreshWithdraw" :on-infinite="infiniteWithdraw" :noDataText="withdrawNoDataText">
            <FundAccounItem v-for="(itemData, index) in withdrawData" :data="itemData" :key="index"></FundAccounItem>
          </scroller>
          <NoDataHint v-if="withdrawNoDataStatus"></NoDataHint>
        </swiper-item>
        <swiper-item :key="3" style="overflow-y: auto;">
          <scroller :on-refresh="refreshCharge" :on-infinite="infiniteCharge" :noDataText="chargeNoDataText">
            <FundAccounItem v-for="(itemData, index) in chargeData" :data="itemData" :key="index"></FundAccounItem>
          </scroller>
          <NoDataHint v-if="chargeNoDataStatus"></NoDataHint>
        </swiper-item>
      </swiper>
    </div>
    <div class="spinner-box-center" v-if="loadingStatus">
      <spinner type="bubbles" size="40px"></spinner>
    </div>
  </div>
</template>

<script>
  import { Spinner, XHeader, Tab, TabItem, Swiper, SwiperItem } from 'vux'
  import { mapGetters } from 'vuex'
  import FundAccounItem from '@/components/user/FundAccounItem'
  import NoDataHint from '@/components/other/NoDataHint'

  const list = () => ['全部', '出借', '提现', '充值']
  export default {
    components: {
      Spinner,
      XHeader,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      FundAccounItem,
      NoDataHint
    },
    data () {
      return {
        loadingStatus: true,
        list: list(),
        activeItem: '全部',
        itemIndex: 0,
        moneyFlowNoDataText: '没有更多数据了',
        moneyFlowNoDataStatus: false,
        moneyFlowType: 0,
        moneyFlowPageCount: 20,
        moneyFlowPageNo: 1,
        loanTypeNoDataText: '没有更多数据了',
        loanNoDataStatus: false,
        loanType: 1,
        loanPageCount: 20,
        loanPageNo: 1,
        withdrawNoDataText: '没有更多数据了',
        withdrawNoDataStatus: false,
        withdrawType: 2,
        withdrawPageCount: 20,
        withdrawPageNo: 1,
        chargeNoDataText: '没有更多数据了',
        chargeNoDataStatus: false,
        chargeType: 3,
        chargePageCount: 20,
        chargePageNo: 1
      }
    },
    created () {
      this.$store.dispatch('moneyFlow/getMoneyFlow', { pageCount: this.moneyFlowPageCount, pageNo: 1 }).then((data) => {
        this.loadingStatus = false
        if (!data.length) {
          this.moneyFlowNoDataStatus = true
        }
      })
    },
    watch: {
      itemIndex () {
        // 出借
        if (this.itemIndex === 1 && !this.loanData.length) {
          this.loadingStatus = true
          this.$store.dispatch('moneyFlow/getLoan', { pageCount: this.loanPageCount, pageNo: 1 }).then((data) => {
            this.loadingStatus = false
            if (!data.length) {
              this.loanNoDataStatus = true
            }
          })
        }
        // 提现
        if (this.itemIndex === 2 && !this.withdrawData.length) {
          this.loadingStatus = true
          this.$store.dispatch('moneyFlow/getWithdraw', { pageCount: this.withdrawPageCount, pageNo: 1 }).then((data) => {
            this.loadingStatus = false
            if (!data.length) {
              this.withdrawNoDataStatus = true
            }
          })
        }
        // 充值
        if (this.itemIndex === 3 && !this.chargeData.length) {
          this.loadingStatus = true
          this.$store.dispatch('moneyFlow/getCharge', { pageCount: this.chargePageCount, pageNo: 1 }).then((data) => {
            this.loadingStatus = false
            if (!data.length) {
              this.chargeNoDataStatus = true
            }
          })
        }
      }
    },
    computed: {
      ...mapGetters({
        moneyFlowData: 'moneyFlow/getMoneyFlowData',  // 资金
        loanData: 'moneyFlow/getLoanData', // 出借
        withdrawData: 'moneyFlow/getWithdrawData', // 提现
        chargeData: 'moneyFlow/getChargeData' // 充值
      }),
      getTabBarWidth () {
        return Math.ceil(parseFloat(document.getElementsByTagName('html')[0].style.fontSize) * 1.2222) + 'px'
      },
      getWinHeight: function () {
        let html = document.getElementsByTagName('html')[0]
        return html.getBoundingClientRect().height - Math.ceil(4.65555555 * parseFloat(html.style.fontSize)) + 'px'
      }
    },
    methods: {
      refreshMoneyFlow (done) { // 资金下拉刷新
        setTimeout(() => {
          this.$store.dispatch('moneyFlow/getMoneyFlow', { pageCount: this.moneyFlowPageCount, pageNo: 1 })
          done()
        }, 1500)
      },
      infiniteMoneyFlow (done) {  // 资金上拉加载
        if (this.moneyFlowData.length < this.moneyFlowPageCount) {
          this.moneyFlowNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.moneyFlowPageNo + 1
          this.$store.dispatch('moneyFlow/getMoreData', { type: this.moneyFlowType, pageCount: this.moneyFlowPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.moneyFlowNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.moneyFlowPageNo = pageNo
            done(true)
          })
        }, 1500)
        return false
      },
      refreshLoan (done) { // 出借下拉刷新
        setTimeout(() => {
          this.$store.dispatch('moneyFlow/getLoan', { pageCount: this.loanPageCount, pageNo: 1 })
          done()
        }, 1500)
      },
      infiniteLoan (done) {  // 出借上拉加载
        if (this.loanData.length < this.loanPageCount) {
          this.loanTypeNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.loanPageNo + 1
          this.$store.dispatch('moneyFlow/getMoreData', { type: this.loanType, pageCount: this.loanPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.loanTypeNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.loanPageNo = pageNo
            done()
          })
        }, 1500)
        return false
      },
      refreshWithdraw (done) { // 提现下拉刷新
        setTimeout(() => {
          this.$store.dispatch('moneyFlow/getWithdraw', { pageCount: this.withdrawPageCount, pageNo: 1 })
          done()
        }, 1500)
      },
      infiniteWithdraw (done) {  // 提现上拉加载
        if (this.withdrawData.length < this.withdrawPageCount) {
          this.withdrawNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.withdrawPageNo + 1
          this.$store.dispatch('moneyFlow/getMoreData', { type: this.withdrawType, pageCount: this.withdrawCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.withdrawNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.withdrawPageNo = pageNo
            done()
          })
        }, 1500)
        return false
      },
      refreshCharge (done) { // 充值下拉刷新
        setTimeout(() => {
          this.$store.dispatch('moneyFlow/getCharge', { pageCount: this.chargePageCount, pageNo: 1 })
          done()
        }, 1500)
      },
      infiniteCharge (done) {  // 充值上拉加载
        if (this.chargeData.length < this.chargePageCount) {
          this.chargeNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.chargePageNo + 1
          this.$store.dispatch('moneyFlow/getMoreData', { type: this.chargeType, pageCount: this.chargeCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.chargeNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.chargePageNo = pageNo
            done()
          })
        }, 1500)
        return false
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
