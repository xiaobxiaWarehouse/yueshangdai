<template>
  <div class="opinion-wrap header-occupy">
    <x-header :left-options="{backText: ''}">意见反馈</x-header>
    <div class="content mt24">
      <div class="page-form">
        <div class="form-item border-bottom">
          <textarea class="text" v-model="value" placeholder="欢迎您向我们发送反馈意见">fdsfsdf</textarea>
        </div>
        <div class="buy-btn">
          <SubBtn :status="true" @click.native="submitHandle">提交</SubBtn>
        </div>
      </div>
    </div>
    <toast v-model="hintPopStatus" type="text" :text="hintPopText" width="12rem" :time="3000"></toast>
  </div>
</template>

<script>
  import { XHeader, Toast } from 'vux'
  import SubBtn from '@/components/user/SubBtn'
  import postAjax from '@/plugins/PostAjax'

  const Util = require('@/assets/js/util')

  const apiUrl = '/api/fadeBack'  // 反馈接口

  let formFlag = true // 防止多次提交

  export default {
    components: {
      XHeader,
      SubBtn,
      Toast
    },
    data () {
      return {
        value: '',
        hintPopStatus: false,
        hintPopText: '反馈成功，3s后跳转至关于我们页面',
        hintTimer: null
      }
    },
    destroyed: function () {
      // 清除定时器（注册成功提示）
      this.hintTimer && clearInterval(this.hintTimer)
    },
    methods: {
      submitHandle () {
        if (!formFlag) return false
        let content = Util.trim(this.value)
        if (!content) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '请填写反馈意见',
            position: 'middle'
          })
          return false
        }
        if (content.length < 5) {
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '反馈意见至少为5个字符',
            position: 'middle'
          })
          return false
        }
        formFlag = false  // 阻止多次提交
        postAjax({
          url: apiUrl,
          data: {
            content: content
          }
        }).then((res) => {
          if (res.data.success) {
            this.hintPopStatus = true
            this.changeTime(() => {
              formFlag = true
              this.$router.push({ name: 'About' })
            })
          } else {
            formFlag = true
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: res.data.errorMsg,
              position: 'middle'
            })
          }
        })
        return false
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
            this.hintPopText = `反馈成功，${time}s后跳转至关于我们页面`
          }
        }, 1000)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .opinion-wrap {
    .form-item {
      width: 100%;
      padding: 0.8rem;
      background-color: #fff;
      .text {
        width: 100%;
        height: 6.4rem;
        border: none;
        font-size: @f30;
        color: @t-two-color;
      }
    }
    .buy-btn {
      padding: 0 0.8rem;
      margin: 2.57777777rem 0 1.06666666rem;
    }
  }
</style>
