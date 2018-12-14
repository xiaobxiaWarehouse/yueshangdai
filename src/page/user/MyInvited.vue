<template>
  <div class="myInvited-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">我的邀请</x-header>
    <div class="content">
      <div class="myInvited-info border-bottom">
        <div class="item">
          <div class="tit">已获得奖励</div>
          <div class="num"><strong>{{(data.rewardMoney || '0') | moneyFormat}}</strong><span class="unit">元</span></div>
        </div>
        <div class="item">
          <div class="tit">已成功邀请</div>
          <div class="num"><strong>{{data.invitedNumber || '0'}}</strong><span class="unit">人</span></div>
        </div>
      </div>
      <div class="myInvited-list mt24">
        <div class="title border-bottom"><strong>成功邀请</strong></div>
        <div class="list">
          <table class="page-table table">
            <thead>
              <tr><th>手机号</th><th>注册时间</th></tr>
            </thead>
            <tbody>
              <tr v-if="inviteListStatus"><td colspan="2" class="noMore">没有邀请好友哦~</td></tr>
              <tr v-for="(trData, index) in data.invitedList" :key="index"><td>{{trData.phone | phoneFormat}}</td><td>{{trData.time | dateFormat}}</td></tr>
            </tbody>
          </table>
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
        loadingStatus: true,
        inviteListStatus: false
      }
    },
    created () {
      this.$store.dispatch('myInvited/getInvited').then((data) => {
        this.loadingStatus = false
        if (data.invitedList.length === 0) {
          this.inviteListStatus = true
        }
      })
    },
    computed: {
      ...mapGetters({
        data: 'myInvited/getInvitedData' // 用户信息
      })
    },
    methods: {
      backHandle () {
        this.$router.push({ name: 'User' })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .myInvited-wrap {
    .myInvited-info {
      display: flex;
      width: 100%;
      padding: 1.55555555rem 0.8rem;
      background-color: #fff;
      .item {
        width: 50%;
        .tit {
          font-size: @f30;
        }
        .num {
          margin-top: 0.53333333rem;
          .unit {
            margin-left: 0.26666666rem;
            font-size: @f36;
          }
          strong {
            font-size: @f58;
          }
        }
      }
    }
    .myInvited-list {
      background-color: #fff;
      .title {
        display: flex;
        align-items: center;
        height: 2.08888888rem;
        padding: 0 0.8rem;
        strong {
          font-size: @f30;
          font-weight: 100;
        }
      }
      .list {
        .table {
          width: 100%;
          thead tr th, tbody tr td {
            height: 1.68888888rem;
            text-align: center;
            border-bottom: 1px solid #eee;
            font-size: @f21;
          }
        }
      }
    }
  }
</style>
