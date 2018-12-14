<template>
  <div class="notices-wrap header-occupy">
    <x-header :left-options="{backText: ''}">消息公告</x-header>
    <div class="page-tab-title notices-title">
      <tab :line-width="2" active-color='#ED214B' :custom-bar-width="getTabBarWidth" v-model="noticesIndex">
        <tab-item class="vux-center" :selected="activeItem === item" v-for="(item, index) in list" @click="activeItem = item" :key="index">{{item}}</tab-item>
      </tab>
    </div>
    <div class="notices-content">
      <swiper v-model="noticesIndex" :height="getWinHeight" :threshold="80" :show-dots="false">
        <swiper-item :key="0" style="overflow-y: auto;">
          <div class="notices-list">
            <scroller :on-refresh="refreshUserNotices" :on-infinite="infiniteUserNotices" :noDataText="userNoticesNoDataText">
              <NoticesItem v-for="itemData in userNoticesData" :data="itemData" :key="itemData.messageId"></NoticesItem>
            </scroller>
          </div>
          <NoDataHint v-if="userNoticesNoDataStatus"></NoDataHint>
        </swiper-item>
        <swiper-item :key="1" style="overflow-y: auto;">
          <div class="notices-list">
            <scroller :on-refresh="refreshSystemNotices" :on-infinite="infiniteSystemNotices" :noDataText="systemNoticesNoDataText">
              <NoticesItem v-for="itemData in systemNoticesData" :data="itemData" :key="itemData.messageId"></NoticesItem>
            </scroller>
          </div>
          <NoDataHint v-if="systemNoticesNoDataStatus"></NoDataHint>
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
  import NoticesItem from '@/components/user/NoticesItem'
  import NoDataHint from '@/components/other/NoDataHint'

  const list = () => ['我的消息', '系统公告']
  export default {
    components: {
      Spinner,
      XHeader,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      NoticesItem,
      NoDataHint
    },
    data () {
      return {
        loadingStatus: true,
        list: list(),
        activeItem: '我的消息',
        noticesIndex: 0,
        userNoticesNoDataText: '没有更多数据了',
        userNoticesNoDataStatus: false,
        userNoticesType: 1,
        userNoticesPageCount: 20,
        userNoticesPageNo: 1,
        systemNoticesNoDataText: '没有更多数据了',
        systemNoticesNoDataStatus: false,
        systemNoticesType: 0,
        systemNoticesPageCount: 20,
        systemNoticesPageNo: 1
      }
    },
    watch: {
      noticesIndex () {
        if (this.noticesIndex === 1 && !this.systemNoticesData.length) {
          this.loadingStatus = true
          this.$store.dispatch('notices/getNotices', { type: this.systemNoticesType, accountId: this.userData.userNo, pageCount: this.systemNoticesPageCount, pageNo: 1 }).then((data) => {
            this.loadingStatus = false
            if (!data.length) {
              this.systemNoticesNoDataStatus = true
            }
          })
        }
      }
    },
    created () {
      // 用户消息
      this.$store.dispatch('notices/getNotices', { type: this.userNoticesType, accountId: this.userData.userNo, pageCount: this.userNoticesPageCount, pageNo: 1 }).then((data) => {
        this.loadingStatus = false
        if (!data.length) {
          this.userNoticesNoDataStatus = true
        }
      })
    },
    computed: {
      ...mapGetters({
        userNoticesData: 'notices/getUserNoticesData',  // 用户消息
        systemNoticesData: 'notices/getSystemNoticesData',  // 系统消息
        userData: 'login/getUserInfo' // 用户信息
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
      refreshUserNotices (done) { // 用户消息下拉刷新
        setTimeout(() => {
          this.$store.dispatch('notices/getNotices', { type: this.userNoticesType, accountId: this.userData.userNo, pageCount: this.userNoticesPageCount, pageNo: 1 })
          done()
        }, 1500)
      },
      infiniteUserNotices (done) {  // 用户消息上拉加载
        if (this.userNoticesData.length < this.userNoticesPageCount) {
          this.userNoticesNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.userNoticesPageNo + 1
          this.$store.dispatch('notices/getMoreNotices', { type: this.userNoticesType, accountId: this.userData.userNo, pageCount: this.userNoticesPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.userNoticesNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.userNoticesPageNo = pageNo
            done()
          })
        }, 1500)
        return false
      },
      refreshSystemNotices (done) { // 系统消息下拉刷新
        setTimeout(() => {
          this.$store.dispatch('notices/getNotices', { type: this.systemNoticesType, accountId: this.userData.userNo, pageCount: this.systemNoticesPageCount, pageNo: 1 })
          done()
        }, 1500)
      },
      infiniteSystemNotices (done) {  // 系统消息上拉加载
        if (this.systemNoticesData.length < this.systemNoticesPageCount) {
          this.systemNoticesNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.systemNoticesPageNo + 1
          this.$store.dispatch('notices/getMoreNotices', { type: this.systemNoticesType, accountId: this.userData.userNo, pageCount: this.systemNoticesPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.systemNoticesNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.systemNoticesPageNo = pageNo
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

</style>
