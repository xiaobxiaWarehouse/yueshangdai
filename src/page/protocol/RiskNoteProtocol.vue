<template>
  <div class="protocol-wrap header-occupy">
    <x-header :left-options="{backText: ''}">风险提示书</x-header>
    <div class="protocol-content">
      <div class="protocol-info">
        <h1 class="title">风险提示书</h1>
        <p class="text">尊敬的客户：</p>
        <p class="text">在购买投资产品之前，请您仔细阅读如下风险提示，并按照您的实际资产情况与风险承受能力，审慎作出投资决策。</p>
        <h2 class="subTitle">一、市场风险：</h2>
        <p class="text">1. 政策风险：因国家宏观政策（如货币政策、财政政策、行业政策、地区发展政策等）发生变化，导致市场价格波动而产生风险。</p>
        <p class="text">2. 经济周期风险：随经济运行的周期性变化，市场的收益水平也呈周期性变化。同时，经济周期影响资金市场的走势，给本产品的投资带来一定的风险。</p>
        <p class="text">3. 公司经营风险：债务人和融资方的经营状况受多种因素影响，如公司的治理结构、经营管理能力、市场前景、行业竞争、人员素质、技术变迁等因素，会影响企业的盈利发生变化。如果财产所投资的公司经营发生变化，将影响到本产品预期收益的实现。</p>
        <p class="text">4.购买力风险：产品财产的收益将主要通过现金形式来分配，而现金可能因为通货膨胀的影响而导致购买力下降，从而使产品财产的实际收益下降。</p>
        <h2 class="subTitle">二、信用风险：</h2>
        <p class="text">信用风险是指产品在交易过程发生交收违约, 或者产品所受让资产的债务人违约，或者产品所受让资产的原始权益人出现违约、拒绝到期回购基础资产,等情形都可能导致产品财产损失和收益变化</p>
        <h2 class="subTitle">三、流动性风险：</h2>
        <p class="text">流动性风险可视为一种综合可能不佳，由此可能影响到产品投资收益的实现。产品到期时，如果产品不能迅速性风险，它是其他风险在产品资产管理和公司整体经营方面的综合体现。本产品投资的基础资产流动性转变成现金，或者变现为现金时使资金净值产生不利的影响，都会影响产品资产运作和收益水平。</p>
        <h2 class="subTitle">四、信息传递风险：</h2>
        <p class="text">乐商宝将按协议约定进行信息披露，用户应充分关注并及时主动查询项目相关信息，如未及时查询，或由于通讯故障、系统故障以及其他不可抗力等因素的影响使得无法及时了解项目信息，由此产生责任和风险应由用户承担。</p>
        <h2 class="subTitle">五、提前终止风险：</h2>
        <p class="text">根据市场环境变化乐商宝有权停止系统实时匹配交易功能，在提前终止情形下，客户面临丧失出借机会及再出借的风险。</p>
        <h2 class="subTitle">六、操作风险：</h2>
        <p class="text">包括但不限于自然灾害、金融市场危机、战争、黑客攻击、病毒感染等不能预见、不能避免、不能克服的不可抗力事件，对于由于不可抗力及意外事件风险导致的任何损失，客户须自行承担。</p>
        <h2 class="subTitle">七、退出风险：</h2>
        <p class="text">用户提前退出或到期退出的申请经乐商宝确认后方可进行，经确认后用户持有的出借项目将以债权转让方式通过乐商宝平台进行转让。乐商宝不对债权转让完成的时间以及债权转让能否全部成功实现做出任何承诺，用户因债权转让申请未成功完成将面临资金不能变现、丧失其他出借机会的风险。</p>
        <p class="text">特别提示</p>
        <p class="text"><strong>前述风险提示不能穷尽全部风险及市场的全部情形。</strong></p>
        <p class="text"><strong>乐商宝风控部以审慎的态度对借款人提供的资料进行风控审核，不保证审核的信息完全无误。乐商宝作为金融信息服务平台，不以任何明示或暗示的方式对出借人提供担保或承诺保本保息，出借人应根据自身的出借偏好和风险承受能力对出借项目进行独立判断和作出决策，并自行承担资金出借的风险与责任。</strong></p>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'

export default {
  components: {
    XHeader
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/css/protocol.less";
</style>
