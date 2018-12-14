<template>
  <div class="help-wrap header-occupy">
    <x-header :left-options="{backText: ''}">帮助中心</x-header>
    <div class="content">
      <div class="help_onlineCustomers">
        <a href="https://www.yueshanggroup.cn/app/h5/onlineCustomers/index.html" target="_block"><img src="../../assets/images/user/help_onlineCustomers.png" alt=""></a>
      </div>
      <LumpListBox class="mt24" borderType="border-bottom">
        <label class="label fl" slot="left">客服热线：400-857-7600</label>
        <!-- <div class="fr" slot="right"><span class="icon icon-arrow-right"></span></div> -->
      </LumpListBox>
      <div class="chunk familiarAsk-wrap mt24 border-bottom">
        <div class="title"><h2>常见问题</h2></div>
        <div class="ui-guide">
          <div class="ui-guide-col-3">
            <router-link class="item" :to="{ name: 'FamiliarAsk', params: { tabIndex: 0 } }">
              <span class="pic"><img src="../../assets/images/user/icon_help_cpxg.png" alt=""></span>
              <strong>产品相关</strong>
            </router-link>
          </div>
          <div class="ui-guide-col-3">
            <router-link class="item" :to="{ name: 'FamiliarAsk', params: { tabIndex: 1 } }">
              <span class="pic"><img src="../../assets/images/user/icon_help_zhxg.png" alt=""></span>
              <strong>账户相关</strong>
            </router-link>
          </div>
          <div class="ui-guide-col-3">
            <router-link class="item" :to="{ name: 'FamiliarAsk', params: { tabIndex: 2 } }">
              <span class="pic"><img src="../../assets/images/user/icon_help_zhxg.png" alt=""></span>
              <strong>活动相关</strong>
            </router-link>
          </div>
        </div>
      </div>
      <div class="chunk hotAsk-wrap mt24">
        <div class="title"><h2>热门问题</h2></div>
        <ChunkBoxDownUp :title="itemData.title" v-for="(itemData, index) in hotAskData" :key="index">
          <div class="item border-bottom">
            <p>{{ itemData.content }}</p>
          </div>
        </ChunkBoxDownUp>
      </div>
    </div>
    <div class="spinner-box-center" v-if="loadingStatus">
      <spinner type="bubbles" size="40px"></spinner>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Spinner, XHeader } from 'vux'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import ChunkBoxDownUp from '@/components/other/ChunkBoxDownUp'

  export default {
    components: {
      Spinner,
      XHeader,
      LumpListBox,
      ChunkBoxDownUp
    },
    data () {
      return {
        loadingStatus: true,
        hotAskPageCount: 10,
        hotAskPageNo: 1
      }
    },
    created () {
      this.$store.dispatch('help/getAsk', { isHot: 1, pageCount: this.hotAskPageCount, pageNo: this.hotAskPageNo }).then((data) => {
        this.loadingStatus = false
      })
    },
    computed: {
      ...mapGetters({
        hotAskData: 'help/getHotAskData'  // 热门问题
      })
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .help-wrap {
    .content {
      .help_onlineCustomers {
        width: 100%;
        img {
          width: 100%;
        }
      }
      .chunk {
        width: 100%;
        background-color: #fff;
        .title {
          height: 1.91111111rem;
          padding: 0 0.8rem;
          line-height: 1.91111111rem;
          border-bottom: 1px solid @border-one-color;
          overflow: hidden;
          h2 {
            font-size: @f30;
            font-weight: 100;
          }
        }
      }
      .familiarAsk-wrap {
        .item {
          display: block;
          width: 2.23333333rem;
          margin: 0.53333333rem auto;
          text-align: center;
          .pic {
            img {
              width: 1.9333333rem;
              height: 1.9333333rem;
            }
          }
          strong {
            display: block;
            margin-top: 0.26666666rem;
          }
        }
      }
      .hotAsk-wrap {
        margin-bottom: 0.53333333rem;
        .item {
          padding: 0.53333333rem 0.8rem;
          color: @t-two-color;
        }
      }
    }
  }
</style>
