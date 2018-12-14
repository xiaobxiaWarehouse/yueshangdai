<template>
  <div class="product-wrap">
    <tab :line-width="2" :custom-bar-width="getBarWidth" active-color='#ED214B' v-model="productIndex">
      <tab-item class="vux-center" :selected="activeItem === item" v-for="(item, index) in list" @click="activeItem = item" :key="index">{{item}}</tab-item>
    </tab>
    <swiper v-model="productIndex" :height="getWinHeight" :threshold="80" :show-dots="false">
      <swiper-item :key="0">
        <div class="tab-swiper vux-center">
          <scroller :on-refresh="refreshOptimizSign" :on-infinite="infiniteOptimizSign" :noDataText="optimizSignNoDataText">
            <ProductListItem :itemData="item" v-for="(item, index) in optimizSigndata" :key="index"></ProductListItem>
          </scroller>
        </div>
        <NoDataHint v-if="optimizSignNoDataStatus"></NoDataHint>
      </swiper-item>
      <swiper-item :key="1">
        <div class="tab-swiper vux-center">
          <scroller :on-refresh="refreshLooseSign" :on-infinite="infiniteLooseSign" :noDataText="looseSignNoDataText">
            <ProductListItem :itemData="item" v-for="(item, index) in looseSignData" :key="index"></ProductListItem>
          </scroller>
        </div>
        <NoDataHint v-if="looseSignNoDataStatus"></NoDataHint>
      </swiper-item>
    </swiper>
    <div class="foot">
      <FootNav :navIndex="1"></FootNav>
    </div>
    <div class="spinner-box-center" v-if="loadingStatus">
      <spinner type="bubbles" size="40px"></spinner>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Spinner, Tab, TabItem, Swiper, SwiperItem } from 'vux'
  import ProductListItem from '@/components/product/ProductListItem'
  import FootNav from '@/components/FootNav'
  import NoDataHint from '@/components/other/NoDataHint'

  const list = () => ['优选标', '散标计划']

  export default {
    components: {
      Spinner,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      ProductListItem,
      FootNav,
      NoDataHint
    },
    data () {
      return {
        loadingStatus: true,
        list: list(),
        activeItem: '优选标',
        productIndex: 0,
        optimizSignNoDataText: '没有更多数据了',
        optimizSignNoDataStatus: false,
        optimizSignProductType: 2,
        optimizSignPageCount: 20,
        optimizSignPageNo: 1,
        looseSignNoDataText: '没有更多数据了',
        looseSignNoDataStatus: false,
        looseSignProductType: 3,
        looseSignPageCount: 20,
        looseSignPageNo: 1
      }
    },
    watch: {
      productIndex () {
        if (this.productIndex === 1 && !this.looseSignData.length) { // 散标计划
          this.loadingStatus = true
          this.$store.dispatch('product/getProduct', { productType: this.looseSignProductType, pageCount: this.looseSignPageCount, pageNo: 1 }).then((data) => {
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
      // 优选标
      this.$store.dispatch('product/getProduct', { productType: this.optimizSignProductType, pageCount: this.optimizSignPageCount, pageNo: 1 }).then((data) => {
        this.loadingStatus = false
        if (!data.length) {
          this.optimizSignNoDataStatus = true
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
        optimizSigndata: 'product/getProductOptimizSignData',
        looseSignData: 'product/getProductLooseSignData',
        userInfo: 'login/getUserInfo'
      }),
      getBarWidth: function (index) {
        return Math.ceil(parseFloat(document.getElementsByTagName('html')[0].style.fontSize) * 1.15555555) + 'px'
      },
      getWinHeight: function () {
        let html = document.getElementsByTagName('html')[0]
        return html.getBoundingClientRect().height - Math.ceil(3.59999999 * parseFloat(html.style.fontSize)) + 'px'
      }
    },
    methods: {
      refreshOptimizSign (done) { // 优选标下拉刷新
        setTimeout(() => {
          this.$store.dispatch('product/getProduct', { productType: this.optimizSignProductType, pageCount: this.optimizSignPageCount, pageNo: 1 }).catch((errorMsg) => {
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
        if (this.optimizSigndata.length < this.optimizSignPageCount) {
          this.optimizSignNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.optimizSignPageNo + 1
          this.$store.dispatch('product/getMoreProduct', { productType: this.optimizSignProductType, pageCount: this.optimizSignPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.optimizSignNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.optimizSignPageNo = pageNo
            done()
          }).catch((errorMsg) => {
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: errorMsg,
              position: 'middle'
            })
            this.loadingStatus = false
          })
        }, 1500)
        return false
      },
      refreshLooseSign (done) { // 散标计划下拉刷新
        setTimeout(() => {
          this.$store.dispatch('product/getProduct', { productType: this.looseSignProductType, pageCount: this.looseSignPageCount, pageNo: 1 }).catch((errorMsg) => {
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
          this.looseSignNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.looseSignPageNo + 1
          this.$store.dispatch('product/getMoreProduct', { productType: this.looseSignProductType, pageCount: this.looseSignPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.looseSignNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.looseSignPageNo = pageNo
            done()
          }).catch((errorMsg) => {
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: errorMsg,
              position: 'middle'
            })
            this.loadingStatus = false
          })
        }, 1500)
        return false
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
