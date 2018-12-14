<template>
  <div class="home-wrap">
    <Banner></Banner>
    <Guide></Guide>
    <RecommendStandardItem></RecommendStandardItem>
    <div class="hint-msg">
      <p class="text"><span>市场有风险</span><span>出借需谨慎</span></p>
    </div>
    <PlatformData></PlatformData>
    <div class="message-box"><router-link to="/user/notices"><span :class="`icon icon-msg${messageData.messageIsRead === 0 || messageData.userMessageIsRead === 0 ? ' icon-msg-active' : ''}`"></span></router-link></div>
    <div class="foot">
      <FootNav :navIndex="0"></FootNav>
    </div>
    <PopHint :showStatus="popHintStatus"></PopHint>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Banner from '@/components/home/Banner'
  import Guide from '@/components/home/Guide'
  import RecommendStandardItem from '@/components/home/RecommendStandardItem'
  import PlatformData from '@/components/home/PlatformData'
  import PopHint from '@/components/home/PopHint'
  import FootNav from '@/components/FootNav'

  const Util = require('@/assets/js/util')

  export default {
    components: {
      Banner,
      Guide,
      RecommendStandardItem,
      PlatformData,
      PopHint,
      FootNav
    },
    created () {
      this.$store.dispatch('home/getMessage')
    },
    computed: {
      ...mapGetters({
        messageData: 'home/getMessageData'
      }),
      popHintStatus () {
        return !Util.getSessionStorage('toKen')
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../assets/css/util.less";
  .home-wrap {
    position: relative;
    padding-bottom: 1.91111111rem;
    .message-box {
      position: absolute;
      top: 0.8rem;
      right: 0.8rem;
      width: 0.91111111rem;
    }
    .hint-msg {
      width: 100%;
      height: 1.68888888rem;
      line-height: 1.68888888rem;
      .text {
        text-align: center;
        font-size: @f21;
        span {
          margin: 0 5px;
          color: #999;
        }
      }
    }
  }
</style>
