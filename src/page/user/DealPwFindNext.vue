<template>
  <div class="deal-pw-find-next-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">重置交易密码</x-header>
    <div class="content mt24">
      <div class="form-wrap">
        <form class="page-form">
          <LumpListBox borderType="border-bottom">
            <label class="label fl" slot="left">新交易密码</label>
            <div class="form-box fl" slot="center">
              <div class="item">
                <div class="left">
                  <input :type="seeStatus ? 'number' : 'password'" v-model="newTradePassword" class="form-control form-text" placeholder="请输入6位数新交易密码">
                </div>
                <div class="right" v-if="newTradePassword"><span :class="'icon' + ' icon-see-' + (seeStatus ? 'show' : 'hide')" @click="triggerSeeStatusHandle"></span></div>
              </div>
            </div>
          </LumpListBox>
          <LumpListBox borderType="border-bottom">
            <label class="label fl" slot="left">确认新密码</label>
            <div class="form-box fl" slot="center">
              <input :type="seeStatus ? 'number' : 'password'" v-model="reNewTradePassword" class="form-control form-text" placeholder="请确认新交易密码">
            </div>
          </LumpListBox>
        </form>
        <div class="buy-btn">
          <SubBtn :status="btnActive" @click.native="submitHandle">提交</SubBtn>
        </div>
      </div>
    </div>
    <toast v-model="hintPopStatus" type="text" :text="hintPopText" width="12rem" :time="3000"></toast>
  </div>
</template>

<script>
  import { XHeader, Toast } from 'vux'
  import { Base64 } from 'js-base64'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import CodeBtn from '@/components/other/CodeBtn'
  import SubBtn from '@/components/user/SubBtn'

  import postAjax from '@/plugins/PostAjax'

  const Util = require('@/assets/js/util')

  const apiUrl = '/api/resetTradePassword'

  let formFlag = true // 防止多次提交

  export default {
    components: {
      Toast,
      XHeader,
      LumpListBox,
      CodeBtn,
      SubBtn
    },
    data () {
      return {
        paramsId: this.$route.params.id,
        paramsBackPage: this.$route.params.backPage,
        newTradePassword: '',
        reNewTradePassword: '',
        btnActive: false,
        seeStatus: false,
        hintPopStatus: false,
        hintPopText: '设置成功，3s后跳转到上一页面',
        hintTimer: null
      }
    },
    watch: {
      newTradePassword: function () {
        this.newTradePassword = this.newTradePassword.substring(0, 6)
        this.triggeBtnActive()
      },
      reNewTradePassword: function () {
        this.reNewTradePassword = this.reNewTradePassword.substring(0, 6)
        this.triggeBtnActive()
      }
    },
    methods: {
      submitHandle () {
        if (!formFlag) return false
        // 验证
        if (!this.verificationHandle()) return false
        formFlag = false
        postAjax({
          url: apiUrl,
          data: {
            mobileNo: this.$route.params.mobileNo,
            identityNo: this.$route.params.identityNo,
            code: this.$route.params.code,
            newTradePassword: Base64.encode(this.newTradePassword),
            type: '001'
          }
        }).then((res) => {
          let data = res.data
          if (data.success) {
            this.hintPopStatus = true
            this.changeTime(() => {
              formFlag = true
              let id = this.paramsId
              let backPage = this.paramsBackPage
              if (backPage) {
                if (id) {
                  this.$router.push({ name: backPage, params: { id: id } })
                  return false
                }
                this.$router.push({ name: backPage })
                return false
              }
              this.$router.push({ name: 'AccountSet' })
            })
          } else {
            formFlag = true
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: data.errorMsg,
              position: 'middle'
            })
            return false
          }
        })
      },
      backHandle () {
        let id = this.paramsId
        let backPage = this.paramsBackPage
        this.$router.push({ name: 'DealPwFind', params: { id: id, backPage: backPage } })
      },
      triggerSeeStatusHandle () {
        this.seeStatus = !this.seeStatus
      },
      triggeBtnActive: function () {
        this.btnActive = !!this.newTradePassword && !!this.reNewTradePassword
      },
      changeTime: function (callBack) {
        this.hintTimer && clearInterval(this.hintTimer)
        let time = 3
        this.hintTimer = setInterval(() => {
          time--
          if (time <= 0 && callBack) {
            callBack.call()
            clearInterval(this.hintTimer)
          } else {
            this.hintPopText = `设置成功，${time}s后跳转到上一页面`
          }
        }, 1000)
      },
      verificationHandle: function () {
        if (!this.newTradePassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入新交易密码',
            position: 'middle'
          })
          return false
        }
        if (!Util.isTradePassword(this.newTradePassword)) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '交易密码为6位数字',
            position: 'middle'
          })
          return false
        }
        if (this.newTradePassword !== this.reNewTradePassword) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '两次交易密码输入不一致',
            position: 'middle'
          })
          return false
        }
        return true
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .deal-pw-find-next-wrap {
    .form-wrap {
      .label {
        width: 4.26666666rem;
      }
      .form-text{
        width: 7.46666666rem;
        font-size: @f30;
      }
      .form-box {
        position: absolute;
        left: 0;
        width: 100%;
        padding-left: 5.06666666rem;
        padding-right: 0.8rem;
        display: inline-block;
        .item {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
      }
      .buy-btn {
        padding: 0 0.8rem;
        margin: 2.57777777rem 0 1.06666666rem;
      }
    }
  }
</style>
