<template>
  <div class="accountSet-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">账户设置</x-header>
    <div class="content">
      <div class="item-title"><span>基本信息</span></div>
      <LumpListBox borderType="border-bottom">
        <label class="label" slot="left">实名认证</label>
        <span class="name-box" slot="center" v-if="(userData.data && userData.data.realNameAuth)">{{userData.data.name | nameFormat}}</span>
        <span class="link-box fr" slot="right" v-if="!(userData.data && userData.data.realNameAuth)"><router-link class="link-red" to="/user/realNameCard">去认证<span class="icon icon-arrow-right"></span></router-link></span>
      </LumpListBox>
      <LumpListBox borderType="border-bottom">
        <label class="label" slot="left">手机认证</label>
        <span class="phone-box" slot="center">{{(userData.data && userData.data.mobileNo) | phoneFormat}}</span>
      </LumpListBox>
      <LumpListBox borderType="border-bottom">
        <label class="label" slot="left">银行卡管理</label>
        <span class="card-box" slot="center" v-if="(userData.data && userData.data.realNameAuth)">{{userData.data.bankNo | bankCardFormat}}</span>
        <span class="link-box fr" slot="right">
          <router-link class="link-red" to="/user/realNameCard" v-if="!(userData.data && userData.data.realNameAuth)">去设置<span class="icon icon-arrow-right"></span>
          </router-link><router-link class="link-red" to="/user/bankCard" v-if="(userData.data && userData.data.realNameAuth)"><span :class="`icon icon-bank icon-bank-${parseInt(userData.data.bankCode)}`"></span>
          <span class="icon icon-arrow-right"></span></router-link></span>
      </LumpListBox>
      <div class="item-title"><span>账号安全</span></div>
      <LumpListBox borderType="border-bottom">
        <label class="label" slot="left">登录密码</label>
        <span class="link-box fr" slot="right"><router-link class="link" to="/user/loginPwChange">修改<span class="icon icon-arrow-right"></span></router-link></span>
      </LumpListBox>
      <LumpListBox borderType="border-bottom">
        <label class="label" slot="left">交易密码</label>
        <span class="link-box fr" slot="right"><router-link class="link-red" to="/user/dealPwSet" v-if="!(userData.data && userData.data.setTradePassword)">去设置<span class="icon icon-arrow-right"></span></router-link><router-link class="link" to="/user/dealPwChange" v-if="(userData.data && userData.data.setTradePassword)">修改<span class="icon icon-arrow-right"></span></router-link></span>
      </LumpListBox>
      <LumpListBox borderType="border-bottom">
        <label class="label" slot="left">风险评估测试</label>
        <span class="risk-box" slot="center" v-if="(userData.data && userData.data.setRiskLevel)">{{userData.data.riskLevel}}</span>
        <span class="link-box fr" slot="right"><router-link class="link-red" to="/user/riskSurvey" v-if="!(userData.data && userData.data.setRiskLevel)">去测试<span class="icon icon-arrow-right"></span></router-link><router-link class="link" to="/user/riskSurvey" v-if="(userData.data && userData.data.setRiskLevel)">重新测试<span class="icon icon-arrow-right"></span></router-link></span>
      </LumpListBox>
      <div class="buy-btn">
        <SubBtn :status="btnActive" @click.native="logoutHandle">退出</SubBtn>
      </div>
    </div>
    <div v-transfer-dom>
      <loading :show="logoutHintShow" text="退出中"></loading>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { XHeader, Loading, TransferDom } from 'vux'
  import LumpListBox from '@/components/other/LumpListBox'
  import SubBtn from '@/components/user/SubBtn'
  import { setTimeout } from 'timers'

  let formFlag = true // 防止多次提交

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      LumpListBox,
      SubBtn,
      Loading
    },
    data () {
      return {
        status: false,
        btnActive: true,
        logoutHintShow: false
      }
    },
    computed: {
      ...mapGetters({
        userData: 'login/getUserInfo',
        selectBankInfo: 'bankList/getSelectBankInfo'
      })
    },
    methods: {
      logoutHandle () {
        if (!formFlag) return false
        let _this = this
        // 质询是否退出系统
        this.$vux.confirm.show({
          content: '确认退出系统吗？',
          onConfirm () {
            formFlag = false
            _this.logoutHintShow = true
            _this.$store.dispatch('login/logout').then(() => {
              formFlag = true
              _this.$store.dispatch('login/removeUserInfo') // 移除登录信息
              setTimeout(() => {
                _this.logoutHintShow = false
                // 退出成功，跳转到首页
                _this.$router.push({ name: 'Home' })
              }, 300)
            }).catch((data) => {
              formFlag = true
              _this.logoutHintShow = false
              // 退出失败，提示
              _this.$vux.toast.show({
                type: 'text',
                width: '15em',
                text: data.errorMsg,
                position: 'middle'
              })
              return false
            })
          }
        })
      },
      backHandle () {
        this.$router.push({ name: 'User' })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .accountSet-wrap {
    .content {
      .item-title {
        padding: 0.66666666rem 0.8rem 0.4rem;
        span {
          font-size: @f30;
          color: @t-two-color;
        }
      }
      .label {
        display: inline-block;
        width: 4.4rem;
      }
      .name-box, .phone-box, .card-box, .risk-box {
        font-size: @f30;
      }
      .risk-box {
        color: @t-two-color;
      }
      .link-box {
        .link, .link-red {
          font-size: @f30;
        }
        .link {
          color: @t-two-color;
        }
        .link-red {
          color: @m-color;
        }
        .icon {
          margin-left: 0.26666666rem;
        }
      }
      .buy-btn {
        padding: 0 0.8rem;
        margin: 3.55555555rem 0 1.288888888rem;
      }
    }
  }
</style>
