<template>
  <div class="red-pack-wrap header-occupy">
    <x-header :left-options="{backText: ''}">红包<router-link to="/user/couponsInstructions" slot="right">使用说明</router-link></x-header>
    <div class="page-tab-title red-pack-title">
      <tab :line-width="2" active-color='#ED214B' :custom-bar-width="getTabBarWidth" v-model="couponsIndex">
        <tab-item class="vux-center" :selected="activeItem === item" v-for="(item, index) in list" @click="activeItem = item" :key="index">{{item}}</tab-item>
      </tab>
    </div>
    <div class="red-pack-content">
      <swiper v-model="couponsIndex" :height="getWinHeight" :threshold="80" :show-dots="false">
        <swiper-item :key="0" style="overflow-y: auto;">
          <div class="list">
            <scroller :on-refresh="refreshUnusedCoupons" :on-infinite="infiniteUnusedCoupons" :noDataText="unusedCouponsNoDataText">
              <RedPackItem :status="true" :type="unusedCouponsStatus" v-for="item in unusedCouponsData" :data="item" :key="item.couponsId"></RedPackItem>
            </scroller>
          </div>
          <NoDataHint v-if="unusedCouponsNoDataStatus"></NoDataHint>
        </swiper-item>
        <swiper-item :key="1" style="overflow-y: auto;">
          <div class="list">
            <scroller :on-refresh="refreshUsedCoupons" :on-infinite="infiniteUsedCoupons" :noDataText="usedCouponsNoDataText">
              <RedPackItem :status="false" :type="usedCouponsStatus" v-for="item in usedCouponsData" :data="item" :key="item.couponsId"></RedPackItem>
            </scroller>
          </div>
          <NoDataHint v-if="usedCouponsNoDataStatus"></NoDataHint>
        </swiper-item>
        <swiper-item :key="2" style="overflow-y: auto;">
          <div class="list">
            <scroller :on-refresh="refreshDatedCoupons" :on-infinite="infiniteDatedCoupons" :noDataText="datedCouponsNoDataText">
              <RedPackItem :status="false" :type="datedCouponsStatus" v-for="item in datedCouponsData" :data="item" :key="item.couponsId"></RedPackItem>
            </scroller>
          </div>
          <NoDataHint v-if="datedCouponsNoDataStatus"></NoDataHint>
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
  import RedPackItem from '@/components/user/CouponsItem'
  import NoDataHint from '@/components/other/NoDataHint'

  const list = () => ['未使用', '已使用', '已过期']

  export default {
    components: {
      Spinner,
      XHeader,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      RedPackItem,
      NoDataHint
    },
    data () {
      return {
        loadingStatus: true,
        list: list(),
        activeItem: '未使用',
        couponsIndex: 0,
        unusedCouponsNoDataText: '没有更多数据了',
        unusedCouponsNoDataStatus: false,
        unusedCouponsStatus: 0,
        unusedCouponsPageCount: 20,
        unusedCouponsPageNo: 1,
        usedCouponsNoDataText: '没有更多数据了',
        usedCouponsNoDataStatus: false,
        usedCouponsStatus: 1,
        usedCouponsPageCount: 20,
        usedCouponsPageNo: 1,
        datedCouponsNoDataText: '没有更多数据了',
        datedCouponsNoDataStatus: false,
        datedCouponsStatus: 2,
        datedCouponsPageCount: 20,
        datedCouponsPageNo: 1
      }
    },
    watch: {
      couponsIndex () {
        if (this.couponsIndex === 1 && !this.usedCouponsData.length) {  // 已使用红包
          this.loadingStatus = true
          this.$store.dispatch('coupons/getCoupons', { couponsStatus: this.usedCouponsStatus, pageCount: this.usedCouponsPageCount, pageNo: 1 }).then((data) => {
            this.loadingStatus = false
            if (!data.length) {
              this.usedCouponsNoDataStatus = true
            }
          })
        }
        if (this.couponsIndex === 2 && !this.datedCouponsData.length) {  // 已过期红包
          this.loadingStatus = true
          this.$store.dispatch('coupons/getCoupons', { couponsStatus: this.datedCouponsStatus, pageCount: this.datedCouponsPageCount, pageNo: 1 }).then((data) => {
            this.loadingStatus = false
            if (!data.length) {
              this.datedCouponsNoDataStatus = true
            }
          })
        }
      }
    },
    created () {
      // 未使用红包
      this.$store.dispatch('coupons/getCoupons', { couponsStatus: this.unusedCouponsStatus, pageCount: this.unusedCouponsPageCount, pageNo: 1 }).then((data) => {
        this.loadingStatus = false
        if (!data.length) {
          this.unusedCouponsNoDataStatus = true
        }
      })
    },
    computed: {
      ...mapGetters({
        unusedCouponsData: 'coupons/getUnusedCouponsData',
        usedCouponsData: 'coupons/getUsedCouponsData',
        datedCouponsData: 'coupons/getDatedCouponsData'
      }),
      getTabBarWidth () {
        return Math.ceil(parseFloat(document.getElementsByTagName('html')[0].style.fontSize) * 1.15555555) + 'px'
      },
      getWinHeight () {
        let html = document.getElementsByTagName('html')[0]
        return html.getBoundingClientRect().height - Math.ceil(3.98888888 * parseFloat(html.style.fontSize)) + 'px'
      }
    },
    methods: {
      refreshUnusedCoupons (done) { // 未使用红包下拉刷新
        setTimeout(() => {
          this.$store.dispatch('coupons/getCoupons', { couponsStatus: this.unusedCouponsStatus, pageCount: this.unusedCouponsPageCount, pageNo: 1 })
          done()
        }, 1500)
      },
      infiniteUnusedCoupons (done) {  // 未使用红包上拉加载
        if (this.unusedCouponsData.length < this.unusedCouponsPageCount) {
          this.unusedCouponsNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.unusedCouponsPageNo + 1
          this.$store.dispatch('coupons/getMoreCoupons', { couponsStatus: this.unusedCouponsStatus, pageCount: this.unusedCouponsPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.unusedCouponsNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.unusedCouponsPageNo = pageNo
            done()
          })
        }, 1500)
        return false
      },
      refreshUsedCoupons (done) { // 已使用红包下拉刷新
        setTimeout(() => {
          this.$store.dispatch('coupons/getCoupons', { couponsStatus: this.usedCouponsStatus, pageCount: this.usedCouponsPageCount, pageNo: 1 })
          done()
        }, 1500)
      },
      infiniteUsedCoupons (done) {  // 已使用红包上拉加载
        if (this.usedCouponsData.length < this.usedCouponsPageCount) {
          this.usedCouponsNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.usedCouponsPageNo + 1
          this.$store.dispatch('coupons/getMoreCoupons', { couponsStatus: this.usedCouponsStatus, pageCount: this.usedCouponsPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.usedCouponsNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.usedCouponsPageNo = pageNo
            done(true)
          })
        }, 1500)
        return false
      },
      refreshDatedCoupons (done) { // 已过期红包下拉刷新
        setTimeout(() => {
          this.$store.dispatch('coupons/getCoupons', { couponsStatus: this.datedCouponsStatus, pageCount: this.datedCouponsPageCount, pageNo: 1 })
          done()
        }, 1500)
      },
      infiniteDatedCoupons (done) {  // 已过期红包上拉加载
        if (this.datedCouponsData.length < this.datedCouponsPageCount) {
          this.datedCouponsNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.datedCouponsPageNo + 1
          this.$store.dispatch('coupons/getMoreCoupons', { couponsStatus: this.datedCouponsStatus, pageCount: this.datedCouponsPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.datedCouponsNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.datedCouponsPageNo = pageNo
            done()
          })
        }, 1500)
        return false
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .red-pack-wrap {
    .red-pack-content {
      .vux-swiper-item {
        margin-top: 1.06666666rem;
      }
    }
  }

</style>
