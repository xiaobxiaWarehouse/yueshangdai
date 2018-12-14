<template>
  <div class="product-wrap header-occupy">
    <x-header :left-options="{backText: ''}">项目详情</x-header>
    <div class="look-detail">
      <div class="object-info border-bottom">
        <div class="item">
          <h3 class="title">项目说明</h3>
          <p class="text">{{data.projectDesc}}</p>
        </div>
        <div class="item">
          <h3 class="title">借款人基本信息</h3>
          <ul class="list list_1">
            <li><label class="label">借款人</label><span class="list-text">{{data.borrower && data.borrower.borrowerName | nameFormat}}</span></li>
            <li><label class="label">年龄</label><span class="list-text">{{data.borrower && data.borrower.borrowerAge}}岁</span></li>
            <li><label class="label">性别</label><span class="list-text">{{data.borrower && data.borrower.borrowerMale}}</span></li>
            <li><label class="label">婚姻状况</label><span class="list-text">{{data.borrower && data.borrower.borrowerMarrage}}</span></li>
            <li><label class="label">证件号码</label><span class="list-text">{{data.borrower && data.borrower.borrowerDocumentNumber | idCard}}</span></li>
            <li><label class="label">所属行业</label><span class="list-text">{{data.borrower && data.borrower.borrowerIndustry}}</span></li>
            <li><label class="label">借款用途</label><span class="list-text">{{data.borrower && data.borrower.borrowerUsage}}</span></li>
            <li><label class="label">还款来源</label><span class="list-text">{{data.borrower && data.borrower.borrowerRepayment}}</span></li>
          </ul>
        </div>
        <div class="item">
          <h3 class="title">债权信息</h3>
          <table class="table pro-table">
            <thead class="border-bottom">
              <tr><th>借款金额</th><th>借款期限</th><th>年化利率</th><th>还款方式</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>{{(data.claimsInfo && data.claimsInfo.loanMoney || 0) | moneyFormat}}元</td>
                <td>{{data.claimsInfo && data.claimsInfo.loanLimit}}</td>
                <td>{{data.claimsInfo && data.claimsInfo.loanApr}}%</td>
                <td>{{data.claimsInfo && data.claimsInfo.loanRepay}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="item">
          <h3 class="title">资质审核</h3>
          <table class="table pro-table pro-table_2">
            <thead>
              <tr><th>审核材料</th><th>审核结果</th></tr>
            </thead>
            <tbody>
              <tr v-for="(itemData, index) in qualificationAuditData" :key="index">
                <td>{{itemData.datumName}}</td><td>通过</td>
              </tr>
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
        loadingStatus: true
      }
    },
    created () {
      // 项目详情
      this.$store.dispatch('lookDetail/getProjectDescription', { id: this.$route.params.id }).then(() => {
        this.loadingStatus = false
      })
      // 资质审核
      this.$store.dispatch('lookDetail/getQualificationAudit', { id: this.$route.params.id }).then(() => {
        this.loadingStatus = false
      })
    },
    computed: {
      ...mapGetters({
        data: 'lookDetail/getProjectDescriptionData', // 项目详情
        qualificationAuditData: 'lookDetail/getQualificationAuditData' // 资质审核
      })
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";

  .object-info {
    padding: 0.26666666rem 0.8rem 1.22222222rem;
    background-color: #fff;
    .item {
      padding-top: 1rem;
      .title {
        font-size: @f30;
      }
      .text {
        margin-top: 0.4rem;
        font-size: @f24;
        color: @t-two-color;
        span {
          margin-right: 0.26666666rem;
        }
      }
      .list {
        margin-top: 0.4rem;
        li {
          margin-bottom: 0.13333333rem;
          font-size: @f24;
          .label {
            display: inline-block;
          }
          .list-text {
            margin-left: 0.53333333rem;
          }
        }
        &_1 {
          .label {
            width: 2.22222222rem;
            text-align: right;
            color: @t-two-color;
          }
        }
        &_2 {
          .label {
            width: 3.77777777rem;
            text-align: right;
          }
          .list-text {
            color: @t-two-color;
          }
        }
      }
      .pro-table {
        width: 100%;
        margin-top: 0.4rem;
        thead {
          tr {
            height: 1.22222222rem;
            text-align: left;
            th {
              font-size: @f24;
              font-weight: 100;
              color: @t-two-color;
            }
          }
        }
        tbody {
          tr {
            height: 1.22222222rem;
            td {
              font-size: @f24;
            }
          }
        }
        &_2 {
          tbody {
            tr {
              height: 0.8rem;
              td:nth-child(2) {
                color: @t-two-color;
              }
            }
          }
        }
      }
    }
  }
</style>
