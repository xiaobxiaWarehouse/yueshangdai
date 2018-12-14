<template>
    <div class="record-wrap header-occupy">
      <x-header :left-options="{backText: ''}">加入记录</x-header>
      <div class="ranking-box border-bottom">
        <div class="title"><strong>排行榜</strong><span class="title-hint">数据每5分钟更新一次</span></div>
        <div class="list">
          <div class="item-box" v-for="(item, index) in rankData" :key="index">
            <div :class="`icon icon_${index + 1}`"></div>
            <div class="item border-bottom">
              <span class="user">{{item.investPeople | phoneFormat}}</span><strong class="num">{{item.investMoney | moneyFormat}}</strong>
            </div>
          </div>
        </div>
      </div>
      <div class="record-info border-bottom">
        <div class="title border-bottom">
          <strong>投资人/时间</strong><strong>金额（元）</strong>
        </div>
        <div class="record-content" :style="listStyle">
          <scroller :on-refresh="refreshAddRecord" :on-infinite="infiniteAddRecord" :noDataText="addRecordNoDataText">
            <div class="list">
              <div class="item-box border-bottom" v-for="(item, index) in addRecordData" :key="index">
                <div>
                  <strong>{{item.investPeople | phoneFormat}}</strong>
                  <span>{{item.investDate | dateFormat}}</span>
                </div>
                <div>
                  <strong class="num">{{item.investMoney | moneyFormat}}</strong>
                </div>
              </div>
            </div>
          </scroller>
          <NoDataHint v-if="addRecordNoNoDataStatus"></NoDataHint>
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
  import NoDataHint from '@/components/other/NoDataHint'

  const html = document.getElementsByTagName('html')[0]
  const listStyle = () => 'height:' + (html.getBoundingClientRect().height - Math.ceil(12.66666654 * parseFloat(html.style.fontSize))) + 'px'

  export default {
    components: {
      Spinner,
      XHeader,
      NoDataHint
    },
    data () {
      return {
        listStyle: listStyle(),
        addRecordNoDataText: '没有更多数据了',
        addRecordNoNoDataStatus: false,
        loadingStatus: true,
        addRecordPageCount: 10,
        addRecordPageNo: 1
      }
    },
    created () {
      // 排行榜
      this.$store.dispatch('addRecord/getRank', { id: this.$route.params.id }).then((data) => {
        this.loadingStatus = false
      })
      // 加入记录
      this.$store.dispatch('addRecord/getAddRecord', { id: this.$route.params.id, pageCount: this.addRecordPageCount, pageNo: this.addRecordPageNo }).then((data) => {
        this.loadingStatus = false
        if (!data.length) {
          this.addRecordNoNoDataStatus = true
        }
      })
    },
    computed: {
      ...mapGetters({
        rankData: 'addRecord/getRankData', // 排行榜
        addRecordData: 'addRecord/getAddRecordData' // 加入记录
      })
    },
    methods: {
      refreshAddRecord (done) { // 投资人下拉刷新
        setTimeout(() => {
          this.$store.dispatch('addRecord/getAddRecord', { id: this.$route.params.id, pageCount: this.addRecordPageCount, pageNo: 1 }).catch((errorMsg) => {
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: errorMsg,
              position: 'middle'
            })
            this.loadingStatus = false
          })
          done()
        }, 1500)
      },
      infiniteAddRecord (done) { // 投资人上拉加载
        if (this.addRecordData.length < this.addRecordPageCount) {
          this.addRecordNoDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.addRecordPageNo + 1
          this.$store.dispatch('addRecord/getMoreAddRecord', { id: this.$route.params.id, pageCount: this.addRecordPageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.addRecordNoDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.addRecordPageNo = pageNo
            done()
          }).catch((errorMsg) => {
            this.$vux.toast.show({
              type: 'text',
              width: '15em',
              text: errorMsg,
              position: 'middle'
            })
            this.loadingStatus = false
          })
        }, 1500)
        return false
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .record-wrap {
    .ranking-box {
      padding: 0.88888888rem 0.8rem 0;
      background-color: #fff;
      .title {
        strong {
          font-size: @f36;
        }
        span {
          margin-left: 0.26666666rem;
          font-size: @f21;
          color: @t-two-color;
        }
      }
      .list {
        margin-top: 0.26666666rem;
        .item-box {
          display: flex;
          align-items: center;
          height: 2.57777777rem;
          line-height: 2.57777777rem;
          .icon {
            display: inline-block;
            width: 1.02222222rem;
            height: 1.35555555rem;
            vertical-align: middle;
          }
          .icon_1 {
            background: url("../../assets/images/product/icon_rank_1.png") no-repeat;
            background-size: contain;
          }
          .icon_2 {
            background: url("../../assets/images/product/icon_rank_2.png") no-repeat;
            background-size: contain;
          }
          .icon_3 {
            background: url("../../assets/images/product/icon_rank_3.png") no-repeat;
            background-size: contain;
          }
          .item {
            width: 100%;
            margin-left: 0.53333333rem;
            display: flex;
            justify-content: space-between;
            .user {
              font-size: @f30;
              font-weight: bold;
            }
            .num {
              font-size: @f30;
              color: @m-color;
            }
          }

        }
      }
    }
    .record-info {
      margin: 0.53333333rem 0 0;
      background-color: #fff;
      .title {
        height: 1.68888888rem;
        padding: 0 0.8rem;
        line-height: 1.68888888rem;
        display: flex;
        justify-content: space-between;
        strong {
          font-size: @f30;
        }
      }
      .record-content {
        position: relative;
      }
      .list {
        padding: 0 0.8rem;
        .item-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 2.57777777rem;
          div:first-child {
            strong {
              font-size: @f30;
              font-weight: bold;
            }
            span {
              display: block;
              margin-top: 0.11111111rem;
              font-size: @f21;
              color: @t-two-color;
            }
          }
          div:last-child {
            .num {
              font-size: @f30;
              color: @m-color;
            }
          }
        }
      }
    }
  }
</style>
