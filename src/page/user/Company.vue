<template>
  <div class="company-wrap header-occupy">
    <x-header :left-options="{backText: ''}">关于乐商宝</x-header>
    <div class="logo"></div>
    <div class="other">
      <LumpListBox borderType="border-bottom">
        <label class="label" slot="left">官方微信</label>
        <span class="wx-box fr" slot="right">公众号：ystzfw</span>
      </LumpListBox>
      <LumpListBox borderType="border-bottom">
        <label class="label" slot="left">版本号</label>
        <strong class="fr" slot="right">v3.1</strong>
      </LumpListBox>
    </div>
  </div>
</template>

<script>
  import { XHeader } from 'vux'
  import LumpListBox from '@/components/other/LumpListBox'

  export default {
    components: {
      XHeader,
      LumpListBox
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .company-wrap {
    .logo {
      width: 2.66666666rem;
      height: 2.66666666rem;
      margin: 2.31111111rem auto;
      background: url("../../assets/images/logo.png") no-repeat center;
      background-size: 100% 100%;
    }
    .other {
      .wx-box {
        font-size: @f21;
        color: @t-two-color;
      }
      strong {
        font-size: @f30;
      }
    }
  }

</style>
