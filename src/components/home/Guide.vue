<template>
  <div class="wrap-box guide">
    <div class="ui-guide">
      <div class="ui-guide-col-3">
        <div class="pic"><a href="javascript:;" @click="drawAwardHandle"><img class="pic" src="../../assets/images/home/pic_guide_hd.png" alt=""></a></div>
        <span class="guide-title">专享活动</span>
      </div>
      <div class="ui-guide-col-3">
        <div class="pic"><a :href="`/app/h5/newActivities/index.html?userId=${userData.userNo || ''}&platform=web&invest=${userData.data && userData.data.invest ? 'employed' : ''}`"><img class="pic" src="../../assets/images/home/pic_guide_fl.png" alt=""></a></div>
        <span class="guide-title">新手福利</span>
      </div>
      <!-- <div class="ui-guide-col-4">
        <div class="pic"><img class="pic" src="../../assets/images/home/pic_guide_yq.png" alt=""></div>
        <span class="guide-title">邀请好友</span>
      </div> -->
      <div class="ui-guide-col-3">
        <router-link to="other/informationDisclosure">
          <div class="pic"><img class="pic" src="../../assets/images/home/pic_guide_pl.png" alt=""></div>
          <span class="guide-title">信息披露</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Grid, GridItem } from 'vux'

  export default {
    components: {
      Grid,
      GridItem
    },
    computed: {
      ...mapGetters({
        userData: 'login/getUserInfo',  // 用户信息
        lendOptimizSignData: 'lend/getLendOptimizSignData',  // 优选标
        lendLooseSignData: 'lend/getLendLooseSignData'  // 散标计划
      })
    },
    methods: {
      drawAwardHandle () {
        if (!this.userData.userNo) {
          this.$router.push({ name: 'Login' })
          return false
        }
        this.$router.push({ name: 'ActivityList' })
        // window.location.href = `/app/h5/drawAward/index.html?userId=${this.userData.userNo}&platform=web&token=${this.userData.accessToken}`
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

 .guide {
   padding: 0.8rem 0;
   .ui-guide>div {
     text-align: center;
   }
   &-title {
     display: block;
     margin-top: 0.26666666rem;
     font-size: @f21;
   }
   .pic {
     width: 1.28888888rem;
     height: 1.28888888rem;
     margin: 0 auto;
     img {
       display: inline-block;
       width: 100%;
       height: auto;
     }
   }
 }
</style>
