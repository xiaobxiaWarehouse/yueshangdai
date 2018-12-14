<template>
  <ul class="risk-survey-item">
    <li v-for="(liData, i) in data.riskSurveyAnswerResDtos" :key="i">
      <div class="radio-box">
        <input type="radio" :id="data.questionId + '-' + answerArr[i]" :value="data.questionId + '-' + answerArr[i]" v-model="picked">
        <span :class="`icon icon-check${picked === data.questionId + '-' + answerArr[i] ? ' icon-checked' : ''}`"></span>
      </div>
      <label class="text" :for="data.questionId + '-' + answerArr[i]">{{liData.answer}}</label>
    </li>
  </ul>
</template>

<script>
  export default {
    props: ['data'],
    data () {
      return {
        answerArr: ['A', 'B', 'C', 'D'],
        picked: ''
      }
    },
    watch: {
      picked () {
        this.$emit('selectParentHandle', this.picked)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .risk-survey-item {
    margin: 1.28888888rem 0;
    li {
      display: flex;
      align-items: center;
      margin-bottom: 0.8rem;
      &:last-child {
        margin-bottom: 0;
      }
      .radio-box {
        position: relative;
        width: 0.51111111rem;
        height: 0.51111111rem;
        margin-right: 0.26666666rem;
        input {
          position: absolute;
          top: 0;
          left: 0;
          width: 0.51111111rem;
          height: 0.51111111rem;
          z-index: 3;
        }
        .icon {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
        }
      }
      .text {
        margin-left: 0.26666666rem;
        font-size: @f30;
      }
    }
  }
  .icon-check {
      width: 0.51111111rem;
      height: 0.51111111rem;
      background: url("../../assets/images/user/icon-check.png") no-repeat center center;
      background-size: cover;
    }
    .icon-checked {
      background: url("../../assets/images/user/icon-checked.png") no-repeat center center;
      background-size: cover;
    }
</style>

