import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/page/Home'

import ProductIndex from '@/page/product/Index' // 首页
import Product from '@/page/product/Product'  // 我的项目
import ProductDetail from '@/page/product/ProductDetail'  // 项目详情
import ProductDeal from '@/page/product/ProductDeal'  // 项目购买页面
import ProductLookDetail from '@/page/product/ProductLookDetail'  // 项目查看详情
import AddRecord from '@/page/product/addRecord'  // 加入记录
import RedEnvelopesList from '@/page/product/RedEnvelopesList'  // 可用红包列表
import PaySuccess from '@/page/product/PaySuccess'  // 支付成功
import PayFailure from '@/page/product/PayFailure'  // 支付失败

import User from '@/page/user/User'
import UserIndex from '@/page/user/Index' // 我的主页
import AccountPandect from '@/page/user/AccountPandect' // 账户总览
import Lend from '@/page/user/Lend' // 出借明细
import LendDetail from '@/page/user/LendDetail' // 出借明细详情
import FundAccount from '@/page/user/FundAccount' // 资金流水
import FundAccountDetail from '@/page/user/FundAccountDetail' // 流水详情
import Coupons from '@/page/user/Coupons' // 我的红包页面
import CouponsInstructions from '@/page/user/CouponsInstructions' // 红包使用说明
import Notices from '@/page/user/Notices' // 我的消息、系统消息
import About from '@/page/user/About' // 关于我们
import Help from '@/page/user/Help' // 帮助中心
import FamiliarAsk from '@/page/user/FamiliarAsk' // 常见问题
import Opinion from '@/page/user/Opinion' // 意见反馈
import Company from '@/page/user/Company' // 关于乐商贷
import AccountSet from '@/page/user/AccountSet' // 账户设置
import RealNameCard from '@/page/user/RealNameCard' // 实名认证
import BankCard from '@/page/user/BankCard' // 银行卡管理
import BankList from '@/page/user/BankList' // 银行列表

import Login from '@/page/user/Login' // 登录
import Register from '@/page/user/Register' // 注册
import RegisterSetPw from '@/page/user/RegisterSetPw' // 注册完成密码设置
import ResetPw from '@/page/user/ResetPw' // 重置密码
import ResetPwSet from '@/page/user/ResetPwSet' // 重置密码完成密码设置
import LoginPwChange from '@/page/user/LoginPwChange' // 修改密码

import DealPwSet from '@/page/user/DealPwSet' // 设置交易密码
import DealPwChange from '@/page/user/DealPwChange' // 修改交易密码
import DealPwFind from '@/page/user/DealPwFind' // 找回交易密码
import DealPwFindNext from '@/page/user/DealPwFindNext' // 找回交易密码下一步(设置新交易密码)

import Recharge from '@/page/user/Recharge' // 充值
import RechargeSuccess from '@/page/user/RechargeSuccess' // 充值成功
import RechargeLose from '@/page/user/RechargeLose' // 充值失败
import RechargeWithdrawRecord from '@/page/user/RechargeWithdrawRecord' // 充值记录、提现记录
import RechargeRecord from '@/page/user/RechargeRecord' // 充值记录
import WithdrawRecord from '@/page/user/WithdrawRecord' // 提现记录
import Repayment from '@/page/user/Repayment' // 提现
import RepaymentSuccess from '@/page/user/RepaymentSuccess' // 提现成功
import RepaymentLose from '@/page/user/RepaymentLose' // 提现失败
import LimitExplain from '@/page/user/limitExplain' // 限额说明
import MyInvited from '@/page/user/MyInvited' // 我的邀请
import RiskSurvey from '@/page/user/RiskSurvey' // 风险测评

import RegisterProtocol from '@/page/protocol/RegisterProtocol' // 注册协议
import BorrowProtocol from '@/page/protocol/BorrowProtocol' // 借款协议
import RiskNoteProtocol from '@/page/protocol/RiskNoteProtocol' // 风险提示书
import InformationDisclosure from '@/page/other/InformationDisclosure'  // 信息披露
import ActivityList from '@/page/other/ActivityList'  // 活动专享页面

import OnlineCustomers from '@/page/other/OnlineCustomers'  // 在线客服

Vue.use(VueRouter)

// const Util = require('@/assets/js/util')

const routes = [{
  path: '/',
  name: 'Home',
  component: Home
}, {
  path: '/login',
  name: 'Login',
  component: Login
}, {
  path: '/register',
  name: 'Register',
  component: Register
}, {
  path: '/registerSetPw',
  name: 'RegisterSetPw',
  component: RegisterSetPw
}, {
  path: '/resetPw',
  name: 'ResetPw',
  component: ResetPw
}, {
  path: '/resetPwSet',
  name: 'ResetPwSet',
  component: ResetPwSet
}, {
  path: '/user',
  component: UserIndex,
  children: [
    {
      path: '',
      name: 'User',
      component: User
    },
    {
      path: 'accountPandect',
      name: 'AccountPandect',
      component: AccountPandect
    },
    {
      path: 'lend',
      name: 'Lend',
      component: Lend
    },
    {
      path: 'lendDetail/:id',
      name: 'LendDetail',
      component: LendDetail
    },
    {
      path: 'fundAccount',
      name: 'FundAccount',
      component: FundAccount
    },
    {
      path: 'fundAccountDetail/:id',
      name: 'FundAccountDetail',
      component: FundAccountDetail
    },
    {
      path: 'coupons',
      name: 'Coupons',
      component: Coupons
    },
    {
      path: 'couponsInstructions',
      name: 'CouponsInstructions',
      component: CouponsInstructions
    },
    {
      path: 'notices',
      name: 'Notices',
      component: Notices
    },
    {
      path: 'about',
      name: 'About',
      component: About
    },
    {
      path: 'help',
      name: 'Help',
      component: Help
    },
    {
      path: 'familiarAsk',
      name: 'FamiliarAsk',
      component: FamiliarAsk
    },
    {
      path: 'opinion',
      name: 'Opinion',
      component: Opinion
    },
    {
      path: 'company',
      name: 'Company',
      component: Company
    },
    {
      path: 'accountSet',
      name: 'AccountSet',
      component: AccountSet
    },
    {
      path: 'realNameCard',
      name: 'RealNameCard',
      component: RealNameCard
    },
    {
      path: 'bankCard',
      name: 'BankCard',
      component: BankCard
    },
    {
      path: 'bankList',
      name: 'BankList',
      component: BankList
    }, {
      path: 'loginPwChange',
      name: 'LoginPwChange',
      component: LoginPwChange
    }, {
      path: 'dealPwSet',
      name: 'DealPwSet',
      component: DealPwSet
    }, {
      path: 'dealPwChange',
      name: 'DealPwChange',
      component: DealPwChange
    }, {
      path: 'dealPwFind',
      name: 'DealPwFind',
      component: DealPwFind
    }, {
      path: 'dealPwFindNext',
      name: 'DealPwFindNext',
      component: DealPwFindNext
    }, {
      path: 'recharge',
      name: 'Recharge',
      component: Recharge
    }, {
      path: 'rechargeSuccess',
      name: 'RechargeSuccess',
      component: RechargeSuccess
    }, {
      path: 'rechargeLose',
      name: 'RechargeLose',
      component: RechargeLose
    }, {
      path: 'rechargeWithdrawRecord',
      name: 'RechargeWithdrawRecord',
      component: RechargeWithdrawRecord
    }, {
      path: 'rechargeRecord',
      name: 'RechargeRecord',
      component: RechargeRecord
    }, {
      path: 'withdrawRecord',
      name: 'WithdrawRecord',
      component: WithdrawRecord
    }, {
      path: 'repayment',
      name: 'Repayment',
      component: Repayment
    }, {
      path: 'repaymentSuccess',
      name: 'RepaymentSuccess',
      component: RepaymentSuccess
    }, {
      path: 'repaymentLose',
      name: 'RepaymentLose',
      component: RepaymentLose
    }, {
      path: 'limitExplain',
      name: 'LimitExplain',
      component: LimitExplain
    }, {
      path: 'myInvited',
      name: 'MyInvited',
      component: MyInvited
    }, {
      path: 'riskSurvey',
      name: 'RiskSurvey',
      component: RiskSurvey
    }
  ]
}, {
  path: '/product',
  component: ProductIndex,
  children: [
    {
      path: '',
      name: 'Product',
      component: Product
    }, {
      path: 'detail/:id',
      name: 'ProductDetail',
      component: ProductDetail
    }, {
      path: 'deal/:id',
      name: 'ProductDeal',
      component: ProductDeal
    }, {
      path: 'redEnvelopesList',
      name: 'RedEnvelopesList',
      component: RedEnvelopesList
    }, {
      path: 'lookDetail/:id',
      name: 'ProductLookDetail',
      component: ProductLookDetail
    }, {
      path: 'addRecord/:id',
      name: 'AddRecord',
      component: AddRecord
    }, {
      path: 'paySuccess',
      name: 'PaySuccess',
      component: PaySuccess
    }, {
      path: 'payFailure',
      name: 'PayFailure',
      component: PayFailure
    }
  ]
}, {
  path: '/registerProtocol',
  name: 'RegisterProtocol',
  component: RegisterProtocol
}, {
  path: '/borrowProtocol',
  name: 'BorrowProtocol',
  component: BorrowProtocol
}, {
  path: '/riskNoteProtocol',
  name: 'RiskNoteProtocol',
  component: RiskNoteProtocol
}, {
  path: '/other/informationDisclosure',
  name: 'InformationDisclosure',
  component: InformationDisclosure
}, {
  path: '/other/activityList',
  name: 'ActivityList',
  component: ActivityList
}, {
  path: '/other/onlineCustomers',
  name: 'OnlineCustomers',
  component: OnlineCustomers
}]

export default new VueRouter({
  routes
})
