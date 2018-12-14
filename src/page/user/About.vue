<template>
  <div class="about-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">关于我们</x-header>
    <div class="content">
      <div class="about-menu mt24">
        <router-link to="/user/help">
          <LumpListBox borderType="border-bottom">
            <label class="label" slot="left">帮助中心</label>
            <div class="link-box fr" slot="center"><span class="icon icon-arrow-right"></span></div>
          </LumpListBox>
        </router-link>
        <router-link to="/user/opinion">
          <LumpListBox borderType="border-bottom">
            <label class="label" slot="left">意见反馈</label>
            <div class="link-box fr" slot="center"><span class="icon icon-arrow-right"></span></div>
          </LumpListBox>
        </router-link>
        <LumpListBox borderType="border-bottom" @click.native="serviceHintHandle">
          <label class="label" slot="left">客服</label>
          <div class="link-box fr" slot="center"><span class="time">工作时间9:00-17:00</span></div>
        </LumpListBox>
      </div>
      <div class="about-menu mt24">
        <router-link to="/user/company">
          <LumpListBox borderType="border-bottom">
            <label class="label" slot="left">关于乐商宝</label>
            <div class="link-box fr" slot="center"><span class="icon icon-arrow-right"></span></div>
          </LumpListBox>
        </router-link>
      </div>
    </div>
    <div v-transfer-dom>
      <alert v-model="serviceHintStatus" button-text="我知道了">
        <p class="text-l">客服电话：400-857-7600</p>
      </alert>
    </div>
  </div>
</template>

<script>
  import { XHeader, Alert, TransferDom } from 'vux'
  import LumpListBox from '@/components/other/LumpListBox'

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      LumpListBox,
      Alert
    },
    data () {
      return {
        serviceHintStatus: false
      }
    },
    methods: {
      backHandle () {
        this.$router.push({ name: 'User' })
      },
      serviceHintHandle () {
        this.serviceHintStatus = true
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .about-wrap {
    .content {
      .link-box {
        .time {
          font-size: @f30;
          color: @t-two-color;
        }
      }
    }
  }
</style>
