<template>
  <div class="deal-pw-find-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">重置交易密码</x-header>
    <div class="content">
      <div class="title">
        <span class="h">注册手机号</span>
        <strong>{{userData.data.mobileNo | phoneFormat}}</strong>
      </div>
      <div class="deal-pw-find-wrap-form">
        <form class="page-form">
          <LumpListBox borderType="border-bottom">
            <label class="label fl" slot="left">身份证号</label>
            <div class="form-box fl" slot="center">
              <input type="text" v-model="identityNo" class="form-control form-text form-text-auto" placeholder="请输入身份证号码">
            </div>
          </LumpListBox>
          <LumpListBox borderType="border-bottom">
            <label class="label fl" slot="left">验证码</label>
            <div class="form-box fl" slot="center">
              <div class="item">
                <div class="left">
                  <input type="number" v-model="code" :maxlength="6" class="form-control form-text" placeholder="请输入手机验证码">
                </div>
                <div class="right">
                  <CodeBtn :status="codeStatus" :phone="userData.data.mobileNo" :noteType="noteType" slot="right"></CodeBtn>
                </div>
              </div>
            </div>
          </LumpListBox>
        </form>
        <div class="buy-btn">
          <SubBtn :status="btnStatus" @click.native="nextHandle">下一步</SubBtn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { XHeader } from 'vux'
  import LumpListBox from '@/components/other/LumpListBox.vue'
  import CodeBtn from '@/components/other/CodeBtn'
  import SubBtn from '@/components/user/SubBtn'

  const Util = require('@/assets/js/util')

  export default {
    components: {
      XHeader,
      LumpListBox,
      CodeBtn,
      SubBtn
    },
    data () {
      return {
        paramsId: this.$route.params.id,
        paramsBackPage: this.$route.params.backPage,
        code: '',
        identityNo: '',
        noteType: '001',
        codeStatus: false,
        btnStatus: false
      }
    },
    watch: {
      identityNo: function () {
        this.triggeCodeStatus()
        this.triggeBtnStatus()
      },
      code: function () {
        this.code = this.code.substr(0, 6)
        this.triggeBtnStatus()
      }
    },
    computed: {
      ...mapGetters({
        userData: 'login/getUserInfo'
      })
    },
    methods: {
      nextHandle: function () {
        if (!this.btnStatus) return false
        if (!this.identityNo) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入身份证号码',
            position: 'middle'
          })
          return false
        }
        if (!Util.isIdCard(this.identityNo)) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '身份证号码格式不正确',
            position: 'middle'
          })
          return false
        }
        if (!this.code) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请输入验证码',
            position: 'middle'
          })
          return false
        }
        // 校验手机验证码
        this.$http.post('/api/checkCode', {
          mobileNo: this.userData.data.mobileNo,
          code: this.code,
          type: '001'
        }).then((rs) => {
          if (rs.data.success) {
            // 点下一步，跳转完成
            let params = {
              id: this.paramsId,
              backPage: this.paramsBackPage,
              mobileNo: this.userData.data.mobileNo,
              identityNo: this.identityNo,
              code: this.code
            }
            this.$router.push({ name: 'DealPwFindNext', params: params })
          } else {
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: rs.data.errorMsg,
              position: 'middle'
            })
          }
        })
        return false
      },
      backHandle () {
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
      },
      triggeCodeStatus: function () {
        this.codeStatus = Util.isIdCard(this.identityNo)
      },
      triggeBtnStatus: function () {
        this.btnStatus = this.identityNo && this.code
      },
      triggerSeeStatusHandle () {
        this.seeStatus = !this.seeStatus
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .deal-pw-find-wrap {
    .content {
      .title {
        width: 100%;
        padding: 0.8rem;
        text-align: center;
        .h {
          font-size: @f21;
          color: @t-two-color;
        }
        strong {
          display: block;
          margin-top: 0.35555555rem;
          font-size: @f36;
        }
      }
    }
    &-form {
      .label {
        width: 4.26666666rem;
      }
      .form-text {
        width: 6.22222222rem;
        font-size: @f30;
        &-auto {
          width: auto;
        }
      }
      .form-box {
        position: absolute;
        left: 0;
        width: 100%;
        padding-left: 4.35555555rem;
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
