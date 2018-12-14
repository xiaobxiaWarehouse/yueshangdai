<template>
  <div class="activityList-wrap header-occupy">
    <x-header :left-options="{backText: ''}">专享活动</x-header>
    <div class="content" :style="listStyle">
      <scroller :on-refresh="refresh" :on-infinite="infinite" :noDataText="noDataText">
        <div class="item mt24" v-for="(itemData, index) in data" :key="index">
          <div class="title">{{itemData.activityTitle}}</div>
          <div class="pic"><a href="javascript:;" @click="linkHandle(itemData.activityLink)"><img :src="itemData.activityImg" alt=""></a></div>
          <div class="item-shade" v-if="itemData.activityStatus === 0">
            <span class="hintSign">已结束</span>
          </div>
        </div>
      </scroller>
      <NoDataHint v-if="noDataStatus"></NoDataHint>
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
        pageCount: 10,
        pageNo: 1
      }
    },
    created () {
      this.$store.dispatch('activityList/getActivityList', { pageCount: this.pageCount, pageNo: this.pageNo }).then((data) => {
        this.loadingStatus = false
        if (!data.length) {
          this.noDataStatus = true
        }
      })
    },
    computed: {
      ...mapGetters({
        data: 'activityList/getActivityData',
        userData: 'login/getUserInfo'  // 用户信息
      }),
      getWinHeight: function () {
        let html = document.getElementsByTagName('html')[0]
        return html.getBoundingClientRect().height - Math.ceil(3.59999999 * parseFloat(html.style.fontSize)) + 'px'
      },
      listStyle () {
        let html = document.getElementsByTagName('html')[0]
        return 'height:' + (html.getBoundingClientRect().height - Math.ceil(1.91111111 * parseFloat(html.style.fontSize))) + 'px'
      }
    },
    methods: {
      linkHandle (url) {
        window.location.href = url + `?userId=${this.userData.userNo}&platform=web&token=${this.userData.accessToken}`
      },
      refresh (done) {  // 下拉刷新
        setTimeout(() => {
          this.$store.dispatch('activityList/getActivityList', { pageCount: this.pageCount, pageNo: 1 }).catch((errorMsg) => {
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
      infinite (done) { // 上拉加载
        if (this.data.length < this.pageCount) {
          this.noDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.pageNo + 1
          this.$store.dispatch('activityList/getMoreActivityList', { pageCount: this.pageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.noDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.pageNo = pageNo
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
  .activityList-wrap {
    .content {
      position: relative;
      .item {
        position: relative;
        .title {
          height: 1.55555555rem;
          padding: 0 0.8rem;
          background-color: #fff;
          line-height: 1.555555555rem;
          font-size: @f30;
        }
        .pic {
          width: 100%;
          height: 8.26666666rem;
          img {
            display: inline-block;
            width: 100%;
            height: 8.26666666rem;
          }
        }
        .item-shade {
          position: absolute;
          left: 0;
          top: 1.55555555rem;
          width: 100%;
          height: 8.26666666rem;
          background: rgba(0, 0, 0, 0.4);
          z-index: 2;
          .hintSign {
            float: right;
            width: 1.91111111rem;
            height: 0.77777777rem;
            margin: 0.8rem;
            line-height: 0.77777777rem;
            text-align: center;
            background-color: @m-color;
            border-radius: 0.13333333rem;
            font-size: @f21;
            color: #fff;
          }
        }
      }
    }
  }
</style>
