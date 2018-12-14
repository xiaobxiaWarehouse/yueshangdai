<template>
  <div :class="'red-pack-item' + (status ? '' : ' red-pack-item-gray')">
    <div class="num-box">
      <div class="num">
        <span class="unit" v-if="data.envelopesType === 1">￥</span>
        <strong>{{data.envelopesMoney | parseIntNum}}</strong>
        <span class="unit" v-if="data.envelopesType === 2">%</span>
      </div>
      <span class="num-sign">{{data.envelopesName}}</span>
    </div>
    <div class="line"></div>
    <div class="text-box">
      <h3 class="title">{{data.envelopesCondition}}</h3>
      <p class="text">{{data.envelopesScope}}</p>
      <div class="other">
        <span class="time">有效期至{{data.envelopesEndTime | dateFormat('yyyy-MM-dd')}}</span>
        <div class="status-box">
          <router-link to="" class="btn-use" @click.native="useHandle(data.envelopesId, data.envelopesType)">立即使用</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['status', 'data'],
    methods: {
      useHandle (id, type) {
        this.$emit('parentUseRedPack', id, type)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .red-pack-item {
    width: 100%;
    height: 4.4rem;
    margin-bottom: 0.53333333rem;
    background-color: #fff;
    border-top: 1px solid @m-color;
    border-bottom: 1px solid @m-color;
    border-left: 3px solid @m-color;
    display: flex;
    .num-box {
      width: 6.66666666rem;
      padding-top: 1.15555555rem;
      text-align: center;
      .unit, strong, .num-sign {
        color: @m-color;
      }
      .unit {
        margin-right: 0.13333333rem;
        font-size: @f30;
      }
      strong {
        font-size: @f58;
      }
      .num-sign {
        font-size: @f21;
      }
    }
    .line {
      width: 0.4rem;
      height: 4.4rem;
      background: url("../../assets/images/user/line_redPack_red.png") no-repeat center center;
      background-size: 100% 100%;
      margin-top: -1px;
    }
    .text-box {
      padding: 0 0.53333333rem;
      .title {
        padding: 0.53333333rem 0 0.26666666rem;
        font-size: @f30;
      }
      .text {
        font-size: @f21;
        color: @t-two-color;
      }
      .other {
        display: flex;
        justify-content: space-between;
        height: 0.88888888em;
        line-height: 0.88888888em;
        margin-top: 0.4rem;
        .time {
          color: @t-two-color;
        }
        .btn-use {
          font-size: @f30;
          color: @m-color;
        }
      }
    }
    &-gray {
      border-color: #ccc;
      .num-box {
        width: 6.66666666rem;
        padding-top: 1.15555555rem;
        text-align: center;
        .unit, strong, .num-sign {
          color: @t-three-color;
        }
      }
      .line {
        background: url("../../assets/images/user/line_redPack_gray.png") no-repeat center center;
        background-size: 100% 100%;
      }
      .text-box {
        .title {
          color: @t-three-color;
        }
        .text {
          color: @t-three-color;
        }
        .other {
          .time {
            color: @t-three-color;
          }
          .btn-used {
            font-size: @f30;
            color: @t-three-color;
          }
        }
      }
    }
  }
</style>
