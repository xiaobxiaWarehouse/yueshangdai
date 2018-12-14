import Vue from 'vue'
import Vuex from 'vuex'

import home from './modules/home' // 首页

import login from './modules/user/login' // 登录
import register from './modules/user/register'  // 注册

import product from './modules/product/product' // 项目
import productDetail from './modules/product/productDetail' // 项目详情
import productDeal from './modules/product/productDeal' // 项目购买
import lookDetail from './modules/product/lookDetail' // 查看详情
import addRecord from './modules/product/addRecord' // 加入记录
import redEnvelopesList from './modules/product/redEnvelopesList' // 可使用红包列表

import user from './modules/user/user'  // 我的
import lend from './modules/user/lend/lend'  // 出借明细（投资记录）
import lendDetail from './modules/user/lend/lendDetail'  // 出借明细详情（投资记录详情）
import moneyFlow from './modules/user/fundAccount/moneyFlow'  // 资金流水
import moneyFlowDetail from './modules/user/fundAccount/moneyFlowDetail'  // 资金流水详情
import bankList from './modules/user/bank/bankList'  // 银行列表
import repayment from './modules/user/bank/repayment'  // 提现信息
import rechargeRecord from './modules/user/bank/rechargeRecord'  // 充值记录
import withdrawRecord from './modules/user/bank/withdrawRecord'  // 提现记录
import realNameCard from './modules/user/realNameCard/realNameCard'  // 实名认证
import bankCard from './modules/user/bank/bankCard'  // 我的银行卡（银行卡管理）
import myInvited from './modules/user/invited/myInvited'  // 我的邀请
import coupons from './modules/user/coupons/coupons'  // 我的红包
import riskSurvey from './modules/user/riskSurvey/riskSurvey' // 风险测评
import couponsInstructions from './modules/user/coupons/couponsInstructions'  // 红包使用说明
import notices from './modules/user/notices/notices'  // 消息公告
import help from './modules/user/help/help'  // 常见问题
import familiarAsk from './modules/user/familiarAsk/familiarAsk'  // 常见问题
import activityList from './modules/other/activityList'  // 专享活动

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    home,
    login,
    register,
    product,
    productDetail,
    productDeal,
    lookDetail,
    addRecord,
    redEnvelopesList,
    user,
    lend,
    lendDetail,
    moneyFlow,
    moneyFlowDetail,
    bankList,
    repayment,
    rechargeRecord,
    withdrawRecord,
    realNameCard,
    bankCard,
    myInvited,
    coupons,
    riskSurvey,
    couponsInstructions,
    notices,
    help,
    familiarAsk,
    activityList
  }
})
