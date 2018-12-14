<template>
  <div class="help-wrap header-occupy">
    <x-header :left-options="{backText: ''}">常见问题</x-header>
    <div class="page-tab-title">
      <tab :line-width="2" :custom-bar-width="getTabBarWidth" active-color='#ED214B' v-model="swiperIndex">
        <tab-item class="vux-center" :selected="activeItem === item" v-for="(item, index) in list" @click="activeItem = item" :key="index">{{item}}</tab-item>
      </tab>
    </div>
    <div class="content">
      <swiper v-model="swiperIndex" :height="getWinHeight" :threshold="80" :show-dots="false">
        <swiper-item :key="0">
          <div class="tab-swiper vux-center">
            <scroller :on-refresh="refreshProAsk" :on-infinite="infiniteProAsk" :noDataText="porAskNoDataText">
              <ChunkBoxDownUp :class="`${(index === 0 && 'mt24')}`" :title="itemData.title" v-for="(itemData, index) in proAskData" :key="index">
                <div class="item border-bottom">
                  <p>{{itemData.content}}</p>
                </div>
              </ChunkBoxDownUp>
            </scroller>
            <NoDataHint v-if="porAskNoDataStatus"></NoDataHint>
          </div>
        </swiper-item>
        <swiper-item :key="1">
          <div class="tab-swiper vux-center">
            <scroller :on-refresh="refreshAccountAsk" :on-infinite="infiniteAccountAsk" :noDataText="accountAskNoDataText">
              <ChunkBoxDownUp :class="`${(index === 0 && 'mt24')}`" :title="itemData.title" v-for="(itemData, index) in accountAskData" :key="index">
                <div class="item border-bottom">
                  <p>{{itemData.content}}</p>
                </div>
              </ChunkBoxDownUp>
            </scroller>
            <NoDataHint v-if="accountAskNoDataStatus"></NoDataHint>
          </div>
        </swiper-item>
        <swiper-item :key="2">
          <div class="tab-swiper vux-center">
            <scroller :on-refresh="refreshActivityAsk" :on-infinite="infiniteActivityAsk" :noDataText="activityAskNoDataText">
              <ChunkBoxDownUp :class="`${(index === 0 && 'mt24')}`" :title="itemData.title" v-for="(itemData, index) in activityAskData" :key="index">
                <div class="item border-bottom">
                  <p>{{itemData.content}}</p>
                </div>
              </ChunkBoxDownUp>
            </scroller>
            <NoDataHint v-if="activityAskNoDataStatus"></NoDataHint>
          </div>
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
  import ChunkBoxDownUp from '@/components/other/ChunkBoxDownUp'
  import NoDataHint from '@/components/other/NoDataHint'

  const list = () => ['产品相关', '账户相关', '活动相关']

  export default {
    components: {
      Spinner,
      XHeader,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      ChunkBoxDownUp,
      NoDataHint
    },
    data () {
      return {
        loadingStatus: true,
        list: list(),
        activeItem: list()[this.$route.params.tabIndex],
        swiperIndex: 0,
        porAskNoDataText: '没有更多数据了',
        porAskNoDataStatus: false,
        proAskPageCount: 20,
        proAskPageNo: 1,
        accountAskNoDataText: '没有更多数据了',
        accountAskNoDataStatus: false,
        accountAskPageCount: 20,
        accountAskPageNo: 1,
        activityAskNoDataText: '没有更多数据了',
        activityAskNoDataStatus: false,
        activityAskPageCount: 20,
        activityAskPageNo: 1
      }
    },
    watch: {
      swiperIndex () {
        if (this.swiperIndex === 1 && !this.accountAskData.length) { // 账户相关问题
          this.$store.dispatch('familiarAsk/getAsk', { type: 2, pageCount: this.accountAskPageCount, pageNo: this.accountAskPageNo }).then((data) => {
            this.loadingStatus = false
            if (!data.length) {
              this.accountAskNoDataStatus = true
            }
          })
        }
        if (this.swiperIndex === 2 && !this.activityAskData.length) { // 活动相关问题
          this.$store.dispatch('familiarAsk/getAsk', { type: 3, pageCount: this.activityAskPageCount, pageNo: this.activityAskPageNo }).then((data) => {
            this.loadingStatus = false
            if (!data.length) {
              this.activityAskNoDataStatus = true
            }
          })
        }
      }
    },
    created () {
      this.$store.dispatch('familiarAsk/getAsk', { type: 1, pageCount: this.proAskPageCount, pageNo: this.proAskPageNo }).then((data) => {
        this.loadingStatus = false
        if (!data.length) {
          this.porAskNoDataStatus = true
        }
      })
    },
    computed: {
      ...mapGetters({
        proAskData: 'familiarAsk/getProAskData',  // 产品相关问题
        accountAskData: 'familiarAsk/getAccountAskData',  // 账户相关问题
        activityAskData: 'familiarAsk/getActivityAskData' // 活动相关问题
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
      refreshProAsk (done) { // 产品相关下拉刷新
        setTimeout(() => {
          this.$store.dispatch('familiarAsk/getAsk', { type: 1, pageCount: this.proAskPageCount, pageNo: 1 }).catch((errorMsg) => {
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
      infiniteProAsk (done) {  // 产品相关上拉加载
        if (this.proAskData.length < this.proAskPageCount) {
          this.porAskNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.proAskPageNo + 1
          this.$store.dispatch('familiarAsk/getMoreAsk', { type: 1, pageCount: this.proAskPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.porAskNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.proAskPageNo = pageNo
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
      refreshAccountAsk (done) { // 账户相关下拉刷新
        setTimeout(() => {
          this.$store.dispatch('familiarAsk/getAsk', { type: 2, pageCount: this.accountAskPageCount, pageNo: 1 }).catch((errorMsg) => {
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
      infiniteAccountAsk (done) {  // 账户相关上拉加载
        if (this.accountAskData.length < this.accountAskPageCount) {
          this.accountAskNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.accountAskPageNo + 1
          this.$store.dispatch('familiarAsk/getMoreAsk', { type: 2, pageCount: this.accountAskPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.accountAskNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.accountAskPageNo = pageNo
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
      refreshActivityAsk (done) { // 活动相关下拉刷新
        setTimeout(() => {
          this.$store.dispatch('familiarAsk/getAsk', { type: 3, pageCount: this.activityAskPageCount, pageNo: 1 }).catch((errorMsg) => {
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
      infiniteActivityAsk (done) {  // 活动相关上拉加载
        if (this.activityAskData.length < this.activityAskPageCount) {
          this.activityAskNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.activityAskPageNo + 1
          this.$store.dispatch('familiarAsk/getMoreAsk', { type: 3, pageCount: this.activityAskPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.activityAskNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.activityAskPageNo = pageNo
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
  @import "../../assets/css/util.less";
  .help-wrap {
    .content {
      .scroller-box {
        position: relative;
      }
      .item {
        padding: 0.53333333rem 0.8rem;
        background-color: #fff;
        p {
          margin-bottom: 0.66666666rem;
          font-size: @f21;
          color: @t-two-color;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>
