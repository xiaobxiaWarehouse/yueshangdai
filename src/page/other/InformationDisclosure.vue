<template>
  <div class="information-disclosure-wrap header-occupy">
    <x-header :left-options="{backText: ''}">信息披露</x-header>
    <div class="page-tab-title">
      <tab :line-width="2" active-color='#ED214B' :custom-bar-width="getTabBarWidth" v-model="lendIndex">
        <tab-item class="vux-center" :selected="activeItem === item" v-for="(item, index) in list" @click="activeItem = item" :key="index">{{item}}</tab-item>
      </tab>
    </div>
    <div class="content">
      <swiper v-model="lendIndex" :height="getWinHeight" :show-dots="false">
        <swiper-item :key="0" style="overflow-y: auto;">
          <div class="box-wrap">
            <div class="chunk-box info-box mt24 border-bottom">
              <p class="text">乐商宝前身是温州乐商投资有限公司旗下原包公理财平台，经过整合改版后全新上线的乐商宝平台。
  </p>
              <p class="text">温州乐商投资有限公司成立于2011年4月，注册资本金为5000万元人民币，实缴资本为5000万元人民。成立7年来，乐商投资作为乐清市农房借贷的龙头企业，一直秉承“透明、高效、稳健”的经营宗旨，立足传统金融，创新服务小微，扎实服务实体的业务理念，向广大投融资用户提供便利、安全的网络借贷信息中介服务。
  </p>
              <p class="text">平台依托自身优势，以严格的准入机制，通过5道严密的审核流程，采用360°的风险评估体系等技术保障，全面保护投资人的资金安全。
  </p>
            </div>
            <ChunkBoxDownUp class="mt24" title="工商信息" :chunkStatus="false">
              <div class="chunk-box info-box border-bottom">
                <ul class="list">
                  <li><label class="label">公司全称：</label><p class="list-text">温州乐商投资有限公司</p></li>
                  <li><label class="label">公司简称：</label><p class="list-text">乐商贷</p></li>
                  <li><label class="label">统一社会信用代码：</label><p class="list-text">91330382573967753L</p></li>
                  <li><label class="label">注册资本（元）：</label><p class="list-text">50,000,000.00</p></li>
                  <li><label class="label">实缴注册资本（元）：</label><p class="list-text">50,000,000.00</p></li>
                  <li><label class="label">注册地：</label><p class="list-text">乐清市城东街道皇都花园A-C幢105号（乐清市民间借贷服务有限公司内）</p></li>
                  <li><label class="label">经营地：</label><p class="list-text">浙江省杭州市下城区新天地商务中心4幢东望座702室</p></li>
                  <li><label class="label">成立时间：</label><p class="list-text">2011-04-27</p></li>
                  <li><label class="label">经营期限：</label><p class="list-text">2011-04-27至2021-04-26</p></li>
                  <li><label class="label">经营状态：</label><p class="list-text">开业</p></li>
                  <li><label class="label">法定代表人：</label><p class="list-text">包永利</p></li>
                  <li><label class="label">经营范围：</label><p class="list-text">对实业的投资、对房地产的投资、对酒店业的投资、对旅游业的投资、对建筑业的投资；民间借贷撮合业务服务。</p></li>
                </ul>
              </div>
            </ChunkBoxDownUp>
            <ChunkBoxDownUp class="mt24" title="平台证件" :chunkStatus="false">
              <div class="chunk-box certificate-box border-bottom">
                <div class="left">
                  <div class="pic1"><img src="../../assets/images/other/informationDisclosure/certificate_pic1.png" alt=""></div>
                  <div class="pic2"><img src="../../assets/images/other/informationDisclosure/certificate_pic2.png" alt=""></div>
                </div>
                <div class="right">
                  <div class="pic3"><img src="../../assets/images/other/informationDisclosure/certificate_pic3.png" alt=""></div>
                </div>
              </div>
            </ChunkBoxDownUp>
            <ChunkBoxDownUp class="mt24" title="组织架构" :chunkStatus="false">
              <div class="chunk-box group-box border-bottom">
                <div class="pic"><img src="../../assets/images/other/informationDisclosure/group_pic.png" alt=""></div>
              </div>
            </ChunkBoxDownUp>
            <!-- <ChunkBoxDownUp class="mt24" title="管理团队" :chunkStatus="false">
              <div class="chunk-box cont-box border-bottom">
                <h3 class="tit"><strong>刘明杰</strong><span class="unit">CEO</span></h3>
                <p class="text">刘明杰先生拥有多年的企业管理经验，曾长期致力于IPO、并购、资产证券化等金融领域，并对互联网金融业务模式创新、资产管理等拥有丰富的实战经验。目前担任乐商宝CEO，全面负责乐商宝工作。</p>
                <h3 class="tit"><strong>叶亚飞</strong><span class="unit">技术总监</span></h3>
                <p class="text">8年以上技术架构、企业应用开发和团队管理经验；曾在波导、金诚集团等多家科技公司任职。深耕系统研发多年，拥有丰富的系统研发经验，对互联网信息安全等领域有深入研究。目前担任乐商宝技术总监，全面负责系统架构和技术研发。</p>
                <h3 class="tit"><strong>王坤</strong><span class="unit">风控经理</span></h3>
                <p class="text">多年风险控制管理经验，曾在中国银行、房金所等多家大型互联网金融科技公司任职。目前担任乐商宝风控经理，主要负责风控产品设计及风险建模，擅长风险管理、数据建模、内控合规、风险定价。</p>
                <h3 class="tit"><strong>吴文博</strong><span class="unit">运营总监</span></h3>
                <p class="text">毕业于哈尔滨商业大学，曾供职于口袋理财、信用白条等，负责运营工作；拥有丰富的互联网金融项目独立操盘经验。在互联网行业实战多年，对品牌、新媒体及网站运营有深入研究与了解。目前担任乐商宝运营总监，全面负责平台运营工作。</p>
              </div>
            </ChunkBoxDownUp> -->
            <ChunkBoxDownUp class="mt24" title="合作伙伴" :chunkStatus="false">
              <div class="chunk-box cont-box border-bottom">
                <h3 class="tit">渤海银行</h3>
                <p class="text">介绍：渤海银行是1996年至今国务院批准新设立的唯一一家全国性股份制商业银行，是第一家在发起设立阶段就引进境外战略投资者的中资商业银行，是第一家总部设在天津的全国性股份制商业银行。</p>
                <h3 class="tit">同盾科技</h3>
                <p class="text">介绍：同盾科技成立于2013年，总部位于浙江杭州，是国内专业的第三方智能风险管理服务提供商。自创立以来，同盾坚持“智能诚信网络”的风控理念，将人工智能与风险管理深度结合，为非银行信贷、银行、保险、基金理财、三方支付、航旅、电商、O2O、游戏、社交平台等多个行业客户提供高效智能的风险管理整体解决方案。</p>
                <h3 class="tit">上上签</h3>
                <p class="text">介绍：上上签电子签约云平台被誉为中国的DocuSign，产品与团队受到市场和客户的广泛认可。上上签将以安全合规、稳定高效的电子签约服务构建智能时代的诚信规则。</p>
                <h3 class="tit">通联支付</h3>
                <p class="text">介绍：通联支付作为一家市场化运作的第三方支付公司，立足于方兴未艾，拥有广阔发展前景的金融支付产业,凭借对行业的深刻理解，秉持“市场第一、客户第一、服务第一”的经营思想，秉承“专业提升品质,联合创造价值”的服务理念，紧密围绕商业银行、商户和持卡人的核心服务需求，致力于为客户和合作伙伴提供安全、灵活、符合客户需求的产品及解决方案。</p>
              </div>
            </ChunkBoxDownUp>
          </div>
        </swiper-item>
        <swiper-item :key="1" style="overflow-y: auto;">
          <div class="box-wrap">
            <ChunkBoxDownUp class="mt24" title="项目描述" :chunkStatus="false">
              <div class="chunk-box border-bottom">
                <p class="text">大风控中心负责风险管理，对所有项目进行风险评估、风险预警、催收处置。下设尽调部、风险策略部、审核中心、贷后管理部。</p>
                <p class="text">尽调部：所有的资产生产方都会经过尽调部门的评估，对其产品、风控、财务情况进行全方位的调查了解，通过投决会审批后，可接入符合条件的资产。</p>
                <p class="text">风险策略部：建设覆盖贷前、贷中、贷后的风控体系，收集外部征信信息，结合内部数据，不断优化授信评分模型和反欺诈模型，根据用户风险，进行差异的人工干预和额度管理</p>
                <p class="text">审核中心：借助授信评分模型和反欺诈模型，对所有资产进行初审、复审、终审，确定借款额度，并对资产进行持续跟踪，以修正审核标准。</p>
                <p class="text">贷后管理部：对用户进行持续的跟踪管理，并对风险项目进行催收。</p>
              </div>
            </ChunkBoxDownUp>
            <ChunkBoxDownUp class="mt24" title="风险评估流程" :chunkStatus="false">
              <div class="chunk-box risk-assessment-flow-box border-bottom">
                <div class="pic"><img src="../../assets/images/other/informationDisclosure/riskAssessmentFlow_pic.png" alt=""></div>
              </div>
            </ChunkBoxDownUp>
            <ChunkBoxDownUp class="mt24" title="风险预警和催收" :chunkStatus="false">
              <div class="chunk-box border-bottom">
                <p class="text">1.贷后管理对风险因素实时上报，及时预警；</p>
                <p class="text">2.对风险项目进行风险评估，排查外围负面信息、 用户财务状况、资产质量等，对收回可能性进行评级， 同时制定有效的解决方案；</p>
                <p class="text">3.管理外部催收合作机构，确定准入、合规、淘汰等相关标准。对外部催收进行实时监控，杜绝用户信息的泄露，以及暴力催收等情况。</p>
              </div>
            </ChunkBoxDownUp>
          </div>
        </swiper-item>
      </swiper>
    </div>
  </div>
</template>

<script>
  import { XHeader, Tab, TabItem, Swiper, SwiperItem } from 'vux'
  import ChunkBoxDownUp from '@/components/other/ChunkBoxDownUp'

  const list = () => ['公司简介', '风险体系']
  export default {
    components: {
      XHeader,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      ChunkBoxDownUp
    },
    data () {
      return {
        list: list(),
        activeItem: '公司简介',
        lendIndex: 0
      }
    },
    computed: {
      getTabBarWidth () {
        return Math.ceil(parseFloat(document.getElementsByTagName('html')[0].style.fontSize) * 1.15555555) + 'px'
      },
      getWinHeight: function () {
        let html = document.getElementsByTagName('html')[0]
        return html.getBoundingClientRect().height - Math.ceil(5.89999999 * parseFloat(html.style.fontSize)) + 'px'
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/util.less";
  .information-disclosure-wrap {
    .box-wrap {
      padding-bottom: 0.5333rem;
    }
    .chunk-box {
      padding: 0.53333333rem 0.8rem;
      background-color: #fff;
      .text {
        font-size: @f21;
        color: @t-two-color;
        text-indent: 0.93333rem;
        margin-bottom: 0.48888888rem;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .list {
        li {
          margin-bottom: 0.26666666rem;
          font-size: @f21;
          color: @t-two-color;
          overflow: hidden;
          .label {
            float: left;
            width: 5.2222rem;
          }
        }
        &-text {
          float: left;
          width: 9.1rem;
        }
      }
    }
    .certificate-box {
      width: 100%;
      overflow: hidden;
      .left, .right {
        float: left;
        img {
          display: inline-block;
          width: 100%;
          height: auto;
        }
      }
      .left {
        .pic1, .pic2 {
          width: 7.8888rem;
        }
        .pic2 {
          margin-top: 0.5333rem;
        }
      }
      .right {
        margin-left: 0.5333rem;
        .pic3 {
          width: 5.2888rem;
        }
      }
    }
    .group-box, .risk-assessment-flow-box {
      .pic {
        width: 100%;
        img {
          display: inline-block;
          width: 100%;
          height: auto;
        }
      }
    }
    .cont-box {
      .tit {
        margin-bottom: 0.26666666rem;
        font-size: @f21;
        strong {
          display: inline-block;
          width: 2rem;
        }
      }
      .text {
        text-indent: 0;
      }
    }
  }


</style>
