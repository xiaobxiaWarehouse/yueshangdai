<template>
  <div class="red-pack-use-explain header-occupy">
    <x-header :left-options="{backText: ''}">使用说明</x-header>
    <div class="content">
      <div class="scroller-box" :style="contentStyle()">
        <scroller :on-refresh="refresh" :on-infinite="infinite" :noDataText="noDataText">
          <ChunkBoxDownUp class="mt24" :title="itemData.title" v-for="(itemData, index) in data" :chunkStatus="index === 0" :key="index">
            <div class="item border-bottom">
              <p>{{itemData.content}}</p>
            </div>
          </ChunkBoxDownUp>
        </scroller>
        <NoDataHint v-if="noDataStatus"></NoDataHint>
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
  import ChunkBoxDownUp from '@/components/other/ChunkBoxDownUp'
  import NoDataHint from '@/components/other/NoDataHint'

  export default {
    components: {
      Spinner,
      XHeader,
      ChunkBoxDownUp,
      NoDataHint
    },
    data () {
      return {
        loadingStatus: true,
        cabinetStatus: [true, false, false],
        contentStyle: function () {
          let html = document.getElementsByTagName('html')[0]
          let h = html.getBoundingClientRect().height - Math.ceil(3.81111111 * parseFloat(html.style.fontSize))
          return `height: ${h}px`
        },
        noDataText: '没有更多数据了',
        noDataStatus: false,
        pageCount: 20,
        pageNo: 1
      }
    },
    created () {
      this.$store.dispatch('couponsInstructions/getCouponsInstructions', { pageCount: this.pageCount, pageNo: this.pageNo }).then((data) => {
        this.loadingStatus = false
        if (!data.length) {
          this.noDataStatus = true
        }
      })
    },
    computed: {
      ...mapGetters({
        data: 'couponsInstructions/getCouponsInstructionsData'
      })
    },
    methods: {
      triggerCabinetHandle (i) {
        this.cabinetStatus = this.cabinetStatus.map((currentValue, index) => {
          return i === index
        })
      },
      refresh (done) { // 下拉刷新
        setTimeout(() => {
          this.$store.dispatch('couponsInstructions/getCouponsInstructions', { pageCount: this.pageCount, pageNo: 1 }).catch((errorMsg) => {
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
      infinite (done) {  // 上拉加载
        if (this.data.length < this.pageCount) {
          this.noDataText = ''
          done(true)
          return false
        }
        setTimeout(() => {
          let pageNo = this.pageNo + 1
          this.$store.dispatch('couponsInstructions/getMoreCouponsInstructions', { pageCount: this.pageCount, pageNo: pageNo }).then((data) => {
            if (!data.length) {
              this.noDataText = '没有更多数据了'
              done(true)
              return false
            }
            this.pageNo = pageNo
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
  .red-pack-use-explain {
    .content {
      .scroller-box {
        position: relative;
      }
      .item {
        padding: 0.53333333rem 0.8rem;
        background-color: #fff;
        p {
          margin-bottom: 0.66666666rem;
          text-indent: 0.9333rem;
          font-size: @f21;
          color: @t-two-color;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>
