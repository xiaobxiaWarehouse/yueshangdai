<template>
  <div class="bank-card-wrap header-occupy">
    <x-header :left-options="{backText: ''}">银行卡管理</x-header>
    <div class="content">
      <div class="bank-card-list">
        <div class="item mt24" v-for="(itemData, index) in userBankCardData" :key="index">
          <div class="item-title border-bottom">
            <div class="bank-tit"><span :class="`icon icon-bank icon-bank-${parseInt(itemData.bankCode)}`"></span><strong>{{itemData.bankName}}</strong></div>
            <span class="bank-type">借记卡</span>
          </div>
          <div class="item-content">
            <span class="name">{{userData.data.name | nameFormat}}</span>
            <span class="num">{{itemData.bankNo | bankCardFormat2}}</span>
          </div>
        </div>
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

  export default {
    components: {
      Spinner,
      XHeader
    },
    data () {
      return {
        loadingStatus: true
      }
    },
    created () {
      this.$store.dispatch('bankCard/getUserBankCard').then(() => {
        this.loadingStatus = false
      })
    },
    computed: {
      ...mapGetters({
        userBankCardData: 'bankCard/getUserBankCardData',
        userData: 'login/getUserInfo'
      })
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .bank-card-wrap {
    .bank-card-list {
      padding: 0 0.8rem;
      .item {
        width: 100%;
        padding: 0 0.8rem;
        background-color: #fff;
        border: solid 1px #eee;
        border-radius: 0.8rem;
        &-title {
          display: flex;
          justify-content: space-between;
          height: 2.84444444rem;
          line-height: 2.84444444rem;
          strong, span {
            font-size: @f30;
          }
          strong {
            margin-left: 0.53333333rem;
          }
        }
        &-content {
          height: 3.6rem;
          .name, .num {
            font-size: @f30;
          }
          .name {
            display: block;
            margin-top: 0.8rem;
          }
          .num {
            display: block;
            margin-top: 0.53333333rem;
          }
        }
      }
    }
  }

</style>
