<template>
  <div class="banner-wrap">
    <div class="link-box" @click="bannerLinkHandle">
      <swiper loop auto :list="data" :index="index" :height="getHeight" dots-position="center" @on-index-change="onIndexChange"></swiper>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Swiper } from 'vux'

  export default {
    components: {
      Swiper
    },
    data () {
      return {
        index: 0
      }
    },
    created () {
      this.$store.dispatch('home/getBanner')
    },
    computed: {
      ...mapGetters({
        data: 'home/getBannerData',
        userData: 'login/getUserInfo',  // 用户信息
        lendOptimizSignData: 'lend/getLendOptimizSignData',  // 优选标
        lendLooseSignData: 'lend/getLendLooseSignData'  // 散标计划
      }),
      getHeight: function () {
        return Math.ceil(parseFloat(document.getElementsByTagName('html')[0].style.fontSize) * 8.26666666) + 'px'
      }
    },
    methods: {
      onIndexChange (index) {
        this.index = index
      },
      bannerLinkHandle () {
        if (this.index === 0) {
          // window.location.href = `/app/h5/drawAward/index.html?userId=${this.userData.userNo}&platform=web&token=${this.userData.accessToken}`
        }
        if (this.index === 1) {
          // window.location.href = `/app/h5/newActivities/index.html?userId=${this.userData.userNo || ''}&platform=web&invest=${this.lendOptimizSignData.length || this.lendLooseSignData.length ? 'employed' : 'employed'}`
        }
        return false
      }
    }
  }
</script>

<style lang="less">
  .vux-slider > .vux-indicator, .vux-slider .vux-indicator-right {
    bottom: 0.53333333rem!important;
    &>a {
      margin-left: 0!important;
      .vux-icon-dot {
        width: 0.48888888rem!important;
        height: 0.48888888rem!important;
        background: url("../../assets/images/home/icon_banner_tab.png") no-repeat center center !important;
        background-size: cover!important;
        border-radius: 0!important;
        &.active {
          background: url("../../assets/images/home/icon_banner_tab_selected.png") no-repeat center center !important;
          background-size: cover!important;
        }
      }
    }
  }
  .vux-slider > .vux-swiper > .vux-swiper-item > a > .vux-swiper-desc {
    display: none;
  }
</style>
