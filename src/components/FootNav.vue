<template>
  <div class="foot-nav">
    <tabbar v-model="index" @on-index-change="tabbarHandle">
      <tabbar-item link="/">
        <span class="foot-icon icon-home" slot="icon"></span>
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item link="/product">
        <span class="foot-icon icon-product" slot="icon"></span>
        <span slot="label">项目</span>
      </tabbar-item>
      <tabbar-item @click.native="userHandle">
        <span class="foot-icon icon-user" slot="icon"></span>
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Tabbar, TabbarItem, Group, Cell } from 'vux'

  const Util = require('@/assets/js/util')

  export default {
    props: ['navIndex'],
    components: {
      Tabbar,
      TabbarItem,
      Group,
      Cell
    },
    data () {
      return {
        index: this.navIndex
      }
    },
    computed: {
      ...mapGetters({
        userData: 'login/getUserInfo' // 获取用户信息
      })
    },
    methods: {
      tabbarHandle (index) {
        this.index = index
      },
      userHandle () {
        if (!this.userData.userNo || !Util.getSessionStorage('toKen')) { // 判断用户是否登录
          if (this.userData.userNo) {
            this.$store.dispatch('login/removeUserInfo')
          }
          let backPage = ''
          if (this.index === 0) { // 首页
            backPage = 'Home'
          }
          if (this.index === 1) { // 项目页面
            backPage = 'Product'
          }
          this.$router.push({ name: 'Login', params: { backPage: backPage } })
          return false
        }
        this.$router.push({ name: 'User' })
      }
    }
  }
</script>

<style lang="less">
  .foot-nav {
    .weui-tabbar {
      position: fixed;
      height: 1.91111111rem;
      &:before {
        border-top: 1px solid #eee;
      }
      .weui-tabbar__item {
        padding-top: 0.22222222rem;
        .weui-tabbar__icon {
          width: 0.82222222rem;
          height: 0.82222222rem;
        }
        .foot-icon {
          display: inline-block;
          width: 0.82222222rem;
          height: 0.82222222rem;
        }
        .icon-home {
          background: url("../assets/images/home/icon_foot_nav_home.png") no-repeat;
          background-size: cover;
        }
        .icon-product {
          background: url("../assets/images/home/icon_foot_nav_product.png") no-repeat;
          background-size: cover;
        }
        .icon-user {
          background: url("../assets/images/home/icon_foot_nav_user.png") no-repeat;
          background-size: cover;
        }
        .weui-tabbar__label {
          font-size: 0.35555555rem;
          color: #ccc;
        }
        &.weui-bar__item_on {
          .icon-home {
            background: url("../assets/images/home/icon_foot_nav_home_selected.png") no-repeat;
            background-size: cover;
          }
          .icon-product {
            background: url("../assets/images/home/icon_foot_nav_product_selected.png") no-repeat;
            background-size: cover;
          }
          .icon-user {
            background: url("../assets/images/home/icon_foot_nav_user_selected.png") no-repeat;
            background-size: cover;
          }
          .weui-tabbar__label {
            color: #999;
          }
        }
      }
    }
  }
</style>
