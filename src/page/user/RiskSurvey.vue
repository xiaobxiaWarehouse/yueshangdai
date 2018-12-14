<template>
  <div class="risk-survey-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">风险测评</x-header>
    <div class="content">
      <div class="risk-list mt24 border-bottom">
        <div class="item" v-for="(itemData, index) in riskData" :key="index">
          <div class="title">{{itemData.question}}</div>
          <RiskSurveyItem @selectParentHandle="selectHandle" :data="itemData"></RiskSurveyItem>
        </div>
      </div>
      <div class="buy-btn">
        <SubBtn :status="true" @click.native="submitHandle">提交</SubBtn>
      </div>
    </div>
    <div class="spinner-box-center" v-if="loadingStatus">
      <spinner type="bubbles" size="40px"></spinner>
    </div>
    <toast v-model="hintPopStatus" type="text" :text="hintPopText" width="12rem" :time="3000"></toast>
    <div v-transfer-dom>
      <loading :show="riskSurveyHintShow" text="测评中..."></loading>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Spinner, XHeader, Toast, Loading, TransferDom } from 'vux'
  import RiskSurveyItem from '@/components/user/RiskSurveyItem'
  import SubBtn from '@/components/user/SubBtn'

  let formFlag = true // 防止多次提交

  export default {
    directives: {
      TransferDom
    },
    components: {
      Spinner,
      XHeader,
      RiskSurveyItem,
      SubBtn,
      Toast,
      Loading
    },
    data () {
      return {
        paramsId: this.$route.params.id,
        paramsBackPage: this.$route.params.backPage,
        loadingStatus: true,
        riskArr: [],
        hintPopStatus: false,
        hintPopText: '提交成功，3s后返回上一页面',
        timer: null,
        riskSurveyHintShow: false
      }
    },
    created () {
      this.$store.dispatch('riskSurvey/getRisk').then(() => {
        this.loadingStatus = false
      })
    },
    destroyed: function () {
      // 清除定时器（成功提示）
      this.timer && clearInterval(this.timer)
    },
    computed: {
      ...mapGetters({
        riskData: 'riskSurvey/getRiskData'
      })
    },
    methods: {
      selectHandle (val) {
        let arr = val.split('-')
        let arrFlag = true
        if (this.riskArr.length === 0) {
          this.riskArr.push({ questionId: arr[0], answerId: arr[1] })
          return false
        }
        this.riskArr.forEach((item, index) => {
          if (item.questionId === arr[0]) {
            this.riskArr[index].answerId = arr[1]
            arrFlag = false
            return false
          }
        })
        if (arrFlag) {
          this.riskArr.push({ questionId: arr[0], answerId: arr[1] })
        }
      },
      submitHandle () {
        if (!formFlag) return false
        if (this.$store.state.riskSurvey.riskData.length !== this.riskArr.length) { // 判断问题是否全部回答
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: '问题尚未回答完，请确认！',
            position: 'middle'
          })
          return false
        }
        formFlag = false
        this.riskSurveyHintShow = true  // 提示测评中
        this.$store.dispatch('riskSurvey/postRisk', this.riskArr).then(() => {  // 提交成功
          this.$store.dispatch('login/updateUserInfo')  // 刷新用户数据
          this.hintPopStatus = true
          this.riskSurveyHintShow = false // 隐藏测评中
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
            } else {
              this.$router.push({ name: 'AccountSet' })
            }
          })
        }).catch((errorMsg) => {
          formFlag = true
          this.riskSurveyHintShow = false // 隐藏测评中
          this.$vux.toast.show({
            type: 'text',
            width: '15em',
            text: errorMsg,
            position: 'middle'
          })
          return false
        })
      },
      changeTime: function (callBack) {
        this.timer && clearInterval(this.timer)
        let time = 3
        this.timer = setInterval(() => {
          time--
          if (time <= 0 && callBack) {
            callBack.call()
            clearInterval(this.timer)
          } else {
            this.hintPopText = `提交成功，${time}s后返回上一页面`
          }
        }, 1000)
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
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .risk-survey-wrap {
    .risk-list {
      padding: 0.66666666rem 0.8rem;
      background-color: #fff;
      .item {
        margin-bottom: 0.66666666rem;
        .title {
          font-size: @f30;
          font-weight: bold;
        }
      }
    }
    .buy-btn {
      padding: 0 0.8rem;
      margin: 2.11111111rem 0 1.06666666rem;
    }
  }
</style>
