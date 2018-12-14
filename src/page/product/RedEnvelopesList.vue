<template>
  <div class="redEnvelopes-list-wrap header-occupy">
    <x-header :left-options="{backText: '', preventGoBack: 'true'}" @on-click-back="backHandle">可使用</x-header>
    <div class="content mt24">
      <div class="list" :style="listStyle">
        <RedPackItem :data='item' :status="true" @parentUseRedPack="useRedPackHandle" v-for="item in redEnvelopesData" :key="item.envelopesId"></RedPackItem>
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
  import RedPackItem from '@/components/product/RedPackItem'

  const Util = require('@/assets/js/util')

  export default {
    components: {
      Spinner,
      XHeader,
      RedPackItem
    },
    data () {
      return {
        loadingStatus: true
      }
    },
    created () {
      let params = this.$route.params
      this.$store.dispatch('redEnvelopesList/getRedEnvelopesList', { id: params.id, type: params.type, investMoney: params.investMoney }).then(() => {
        this.loadingStatus = false
      })
    },
    computed: {
      ...mapGetters({
        productDetailData: 'productDetail/getProductDetailData', // 项目详情
        redEnvelopesData: 'redEnvelopesList/getRedEnvelopesData'
      }),
      listStyle () {
        let html = document.getElementsByTagName('html')[0]
        return 'height:' + (html.getBoundingClientRect().height - Math.ceil(4.34444444 * parseFloat(html.style.fontSize))) + 'px'
      }
    },
    methods: {
      useRedPackHandle (id) {
        this.$store.dispatch('redEnvelopesList/getUseEnveLopos', { id: id }).then((data) => {
          // 设置利息
          let apr = data.envelopesType === 2 ? Util.floatAdd(data.envelopesMoney, this.productDetailData.apr) : this.productDetailData.apr
          this.$store.dispatch('productDeal/setInterest', { investMoney: this.$route.params.investMoney, apr: apr, limit: this.productDetailData.limit, limitUnit: this.productDetailData.limitUnit })
          this.$router.push({ name: 'ProductDeal', params: { id: this.$route.params.id, page: 'redEnvelopesList' } })
        })
      },
      backHandle () {
        this.$router.push({ name: 'ProductDeal', params: { id: this.$route.params.id, page: 'redEnvelopesList' } })
      }
    }
  }
</script>

<style lang="less" scoped>
  .redEnvelopes-list-wrap {
    .content {
      position: relative;
    }
  }
</style>
