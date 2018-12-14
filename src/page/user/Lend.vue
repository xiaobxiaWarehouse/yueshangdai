<template>
  <div class="lend-wrap header-occupy">
    <x-header :left-options="{backText: ''}">出借明细</x-header>
    <div class="page-tab-title lend-title">
      <tab :line-width="2" active-color='#ED214B' :custom-bar-width="getTabBarWidth" v-model="lendIndex">
        <tab-item class="vux-center" :selected="activeItem === item" v-for="(item, index) in list" @click="activeItem = item" :key="index">{{item}}</tab-item>
      </tab>
    </div>
    <div class="lend-content">
      <swiper v-model="lendIndex" :height="getWinHeight" :threshold="80" :show-dots="false">
        <swiper-item :key="0" style="overflow-y: auto;">
          <div class="lend-list">
            <scroller :on-refresh="refreshOptimizSign" :on-infinite="infiniteOptimizSign" :noDataText="lendOptimizSignNoDataText">
              <LendItem v-for="(itemData, index) in lendOptimizSignData" :data="itemData" :key="index"></LendItem>
            </scroller>
          </div>
          <NoDataHint v-if="lendOptimizSignNoDataStatus"></NoDataHint>
        </swiper-item>
        <swiper-item :key="1" style="overflow-y: auto;">
          <div class="lend-list">
            <scroller :on-refresh="refreshLooseSign" :on-infinite="infiniteLooseSign" :noDataText="looseOptimizSignNoDataText">
              <LendItem v-for="(itemData, index) in looseSignData" :data="itemData" :key="index"></LendItem>
            </scroller>
          </div>
          <NoDataHint v-if="looseSignNoDataStatus"></NoDataHint>
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
  import LendItem from '@/components/user/LendItem'
  import NoDataHint from '@/components/other/NoDataHint'

  const list = () => ['优选标', '散标计划']
  export default {
    components: {
      Spinner,
      XHeader,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      LendItem,
      NoDataHint
    },
    data () {
      return {
        loadingStatus: true,
        list: list(),
        activeItem: '优选标',
        lendIndex: 0,
        lendOptimizSignNoDataText: '没有更多数据了',
        lendOptimizSignNoDataStatus: false,
        optimizSignInvestType: 2,
        optimizSignPageCount: 10,
        optimizSignPageNo: 1,
        looseOptimizSignNoDataText: '没有更多数据了',
        looseSignNoDataStatus: false,
        looseSignInvestType: 3,
        looseSignPageCount: 10,
        looseSignPageNo: 1
      }
    },
    watch: {
      lendIndex () {
        if (this.lendIndex === 1 && !this.looseSignData.length) { // 散标计划
          this.loadingStatus = true
          this.$store.dispatch('lend/getLend', { investType: this.looseSignInvestType, pageCount: this.looseSignPageCount, pageNo: 1 }).then((data) => {
            this.loadingStatus = false
            if (!data.length) {
              this.looseSignNoDataStatus = true
            }
          }).catch((errorMsg) => {
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: errorMsg,
              position: 'middle'
            })
            this.loadingStatus = false
          })
        }
      }
    },
    created () {
      this.$store.dispatch('lend/getLend', { investType: this.optimizSignInvestType, pageCount: this.optimizSignPageCount, pageNo: 1 }).then((data) => {
        this.loadingStatus = false
        if (!data.length) {
          this.lendOptimizSignNoDataStatus = true
        }
      }).catch((errorMsg) => {
        this.$vux.toast.show({
          type: 'text',
          width: '15em',
          text: errorMsg,
          position: 'middle'
        })
        this.loadingStatus = false
      })
    },
    computed: {
      ...mapGetters({
        lendOptimizSignData: 'lend/getLendOptimizSignData', // 优选标
        looseSignData: 'lend/getLendLooseSignData'  // 散标计划
      }),
      getTabBarWidth () {
        return Math.ceil(parseFloat(document.getElementsByTagName('html')[0].style.fontSize) * 1.15555555) + 'px'
      },
      getWinHeight: function () {
        let html = document.getElementsByTagName('html')[0]
        return html.getBoundingClientRect().height - Math.ceil(3.98888888 * parseFloat(html.style.fontSize)) + 'px'
      }
    },
    methods: {
      refreshOptimizSign (done) { // 优选标下拉刷新
        setTimeout(() => {
          this.$store.dispatch('lend/getLend', { investType: this.optimizSignInvestType, pageCount: this.optimizSignPageCount, pageNo: 1 }).catch((errorMsg) => {
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: errorMsg,
              position: 'middle'
            })
            this.loadingStatus = false
          })
          done()
        }, 1500)
      },
      infiniteOptimizSign (done) {  // 优选标上拉加载
        if (this.lendOptimizSignData.length < this.optimizSignPageCount) {
          this.lendOptimizSignNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.optimizSignPageNo + 1
          this.$store.dispatch('lend/getMoreLend', { investType: this.optimizSignInvestType, pageCount: this.optimizSignPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.lendOptimizSignNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.optimizSignPageNo = pageNo
            done(true)
          })
        }, 1500)
        return false
      },
      refreshLooseSign (done) { // 散标计划下拉刷新
        setTimeout(() => {
          this.$store.dispatch('lend/getLend', { investType: this.looseSignInvestType, pageCount: this.looseSignPageCount, pageNo: 1 }).catch((errorMsg) => {
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: errorMsg,
              position: 'middle'
            })
            this.loadingStatus = false
          })
          done()
        }, 1500)
      },
      infiniteLooseSign (done) {  // 散标计划上拉加载
        if (this.looseSignData.length < this.looseSignPageCount) {
          this.looseOptimizSignNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.looseSignPageNo + 1
          this.$store.dispatch('lend/getMoreLend', { investType: this.looseSignInvestType, pageCount: this.looseSignPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.looseOptimizSignNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.looseSignPageNo = pageNo
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

</style>
