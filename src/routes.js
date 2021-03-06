import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './vuex/store'
const routerPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location)//.catch(error=> error)
}
Vue.use(VueRouter)

import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'


//首页内容
import tongjihome from './views/tongji/home'//统计首页
import user from './views/user/user'//用户管理
import parklist from './views/park/parklist'//园区管理
//积分商城
import shopActivityList from './views/integralShop/shopActivityList'//商品活动列表
import discountsAdmin from './views/integralShop/discountsAdmin'//优惠券管理
import msgsend from './views/msg/msgsend'//消息推送
import integralRule from './views/integralRule/integralRule'//积分规则
import feedback from './views/feedback/feedback'//商品列表
// import orderlist from './views/order/list'//订单列表
// import shoplist from './components/editor'//订单列表
// 园区管理
//基础信息
import base from './views/park/base'//基础信息
//基础配置
import topline from './views/park/deploy/topline'//公告管理
import message from './views/park/deploy/message';//消息推送
import pagelist from './views/park/deploy/pagelist'//页面链接管理
//景点管理
import sencelist from './views/park/scenicSpotAdmin/senceList'//景点列表
import procam from './views/park/scenicSpotAdmin/procam'//全景资源管理
import routerlist from './views/park/scenicSpotAdmin/routerlist'//路线列表
//商品管理
import shopMessage from './views/park/shop/shopMessage';//商品信息管理
import shopOrder from './views/park/shop/shopOrder';//商品订单管理
import shopBinding from './views/park/shop/shopBinding';//绑定管理
import shopDistribution from './views/park/shop/shopDistribution';//商品分布管理
// import shoplist from './views/park/shop/list'//商品管理 
// import product from './views/park/shop/product'//商品列表
//活动管理
import schedule from './views/park/active'//活动列表
import schedunum from './views/park/schedunum'//预约统计
import partdetail from './views/park/partdetail'//预约时段列表

//游客服务
import lostManage from './views/park/lostManage'//失物管理
//租赁管理
import leaseItem from './views/park/lease/leaseItem'//租赁管理
import leaseRes from './views/park/lease/leaseRes'//租赁物品
import leaseDistribution from './views/park/lease/leaseDistribution'//租赁分布
import scenicdetail from './views/park/scenicdetail'//景点详情
//充值设置
import paySet from './views/pay/paySet'//充值设置
import topUp from './views/pay/topUp'//充值管理
import withdraw from './views/pay/withdraw'//提现管理
import IntegralRecord from './views/pay/IntegralRecord'//积分记录
import exchangeRecord from './views/pay/exchangeRecord'//兑换记录
//新闻管理
import newsmanagement from './views/park/newsmanagement' //新闻管理
//票务管理
import ticketAdmin from './views/park/ticketAdmin';//票务管理
//酒店管理
import hotelAdmin from './views/park/hotelAdmin';//酒店管理
//游客管理
import touristAdmin from './views/park/touristAdmin/touristAdmin';//游客管理
import stoneDetail from './views/park/touristAdmin/stoneDetail';//五彩石明细记录
import integralDetail from './views/park/touristAdmin/integralDetail';//积分明细记录
import discountAdmin from './views/park/touristAdmin/discountAdmin';//优惠券明细记录
//首页配置
import homeConfiguration from './views/park/homeConfiguration'//首页配置
//景观设备管理
import landscapeAdmin from './views/park/landscapeAdmin';//景观设备管理
// 商品管理
// import active from './views/park/active'//商城活动

//基本设置
import basic from './views/basic/basic'//基本设置
import classification from './views/basic/classification'//分类管理
import manage from './views/basic/manage'//管理员
import page from './views/basic/page'//页面链接管理
//权限管理
import roleManagement from './views/role/roleManagement';//角色管理
import adminManagement from './views/role/adminManagement';//管理员管理
import welcome from './views/welcome';//管理员管理

//五彩石商城
import shopIndex from './views/shopAdmin/shopIndex';//商城首页
import shopOrders from './views/shopAdmin/shopOrders';//商品订单
import salesStatistics from './views/shopAdmin/salesStatistics';//销量统计
import axios from 'axios'
const metaTrue = { meta: { requireAuth: true } }

const router = new VueRouter({
    routes: [
        { path: '/login', component: Login, name: '', hidden: true, ...metaTrue },
        { path: '/404', component: NotFound, name: '404', hidden: true, meta: { requireAuth: false } },
        { path: '/back', component: Home, name: '返回', hidden: true, back: true, ...metaTrue },
        {
            path: '/', component: Home, name: 'tongjihome', hidden: false, meta: { requireAuth: true, level: 1 },
            children: [{ path: '/', component: tongjihome, name: '数据统计', ...metaTrue, meta: { title: "数据统计" } },]
        },
        {
            path: '/', component: Home, name: 'role', hidden: false, unfold: true, meta: { requireAuth: true, level: 2 },
            children: [
                { path: '/roleManagement', component: roleManagement, name: '角色管理', meta: { title: "权限管理", requireAuth: true, parent: '/' } },
                { path: '/adminManagement', component: adminManagement, name: '管理员管理', meta: { requireAuth: true, parent: '/' } },
            ]
        },
        {
            path: '/', component: Home, name: 'parklist', hidden: false, meta: { requireAuth: true, level: 1 },
            children: [{ path: '/parklist', component: parklist, name: '园区管理', ...metaTrue, meta: { title: "园区管理" } },],
        },

        {
            path: '/', component: Home, name: 'base', hidden: true, meta: { requireAuth: true, level: 2 },
            children: [
                { path: '/welcome', component: welcome, name: '欢迎进入园区', hidden: true, meta: { requireAuth: true, parent: 'parklist' } },
                { path: '/base', component: base, name: '基础信息', meta: { requireAuth: true, parent: 'parklist' } },
                {
                    path: '/topline', component: topline, redirect: 'topline', name: '基础配置', meta: { requireAuth: true, parent: 'parklist' },
                    children: [{ path: '/topline', component: topline, name: '公告管理', meta: { requireAuth: true, parent: '/base' } }]
                },
                {
                    path: '/sencelist', component: sencelist, name: '景点管理', meta: { requireAuth: true, parent: 'parklist' },
                    children: [{
                        path: '/sencelist', component: sencelist, name: '景点列表', meta: { requireAuth: true, parent: '/base' }
                    },]
                },
                {
                    path: '/shopMessage', component: shopMessage, name: '商品管理', meta: { requireAuth: true, level: 2 },
                    children: [
                        { path: '/shopMessage', component: shopMessage, name: '商品信息设置', meta: { requireAuth: true, parent: '/base' } },
                    ]
                },
                {
                    path: '/schedule', component: schedule, name: '活动管理', meta: { requireAuth: true, parent: 'parklist' },
                    children: [
                        { path: '/schedule', component: schedule, name: '活动列表', meta: { requireAuth: true, parent: '/base' } },
                    ]
                },
                {
                    path: '/lostManage', component: lostManage, name: '游客服务', meta: { requireAuth: true, parent: 'parklist' },
                    children: [
                        { path: '/lostManage', component: lostManage, name: '失物管理', meta: { requireAuth: true, parent: '/base' } },
                    ]
                },
                { path: '/newsmanagement', component: newsmanagement, name: '新闻管理', meta: { requireAuth: true, parent: 'parklist' } },
                // { path: '/ticketAdmin', component: ticketAdmin, name: '票务管理', meta: { requireAuth: true, parent: 'parklist' } },
                // { path: '/hotelAdmin', component: hotelAdmin, name: '酒店管理', meta: { requireAuth: true, parent: 'parklist' } },
                {
                    path: '/touristAdmin', component: touristAdmin, name: '游客管理', meta: { requireAuth: true, parent: 'parklist' },
                    children: [
                        { path: '/touristAdmin', component: touristAdmin, name: '游客列表', meta: { requireAuth: true, parent: '/base' } },
                    ]
                },
                { path: '/homeConfiguration', component: homeConfiguration, name: '页面配置', meta: { requireAuth: true, switchs: true, parent: 'parklist' } },
                // { path: '/landscapeAdmin', component: landscapeAdmin, name: '景观设备管理', meta: { requireAuth: true, switchs: true, parent: 'parklist' } },
            ],
        },

        {
            path: '/', component: Home, name: 'pay', hidden: false, unfold: true, meta: { requireAuth: true, level: 2 },
            children: [
                { path: '/paySet', component: paySet, name: '五彩石管理', meta: { title: "五彩石管理", requireAuth: true, parent: '/' } },
                { path: '/topUp', component: topUp, name: '充值管理', meta: { requireAuth: true, parent: '/' } },
                { path: '/withdraw', component: withdraw, name: '提现管理', meta: { requireAuth: true, parent: '/' } },
                // { path: '/IntegralRecord', component: IntegralRecord, name: '积分记录', meta: { requireAuth: true, parent: '/' } },
                // { path: '/exchangeRecord', component: exchangeRecord, name: '兑换记录', meta: { requireAuth: true, parent: '/' } }
            ]
        },
        {
            path: '/', component: Home, name: 'shopIndex', hidden: false, unfold: true, meta: { requireAuth: true, level: 2 },
            children: [
                { path: '/shopIndex', component: shopIndex, name: '商城首页', meta: { title: "五彩石商城", requireAuth: true, parent: '/' } },
                { path: '/shopOrders', component: shopOrders, name: '商品订单', meta: { requireAuth: true, parent: '/' } },
                { path: '/salesStatistics', component: salesStatistics, name: '销量统计', meta: { requireAuth: true, parent: '/' } },
            ]
        },
        {
            path: '/', component: Home, name: 'integralShop', hidden: false, unfold: true, meta: { requireAuth: true, level: 2 },
            children: [
                { path: '/shopActivityList', component: shopActivityList, name: '商品活动列表', meta: { title: "积分商城", requireAuth: true, parent: '/' } },
                { path: '/discountsAdmin', component: discountsAdmin, name: '优惠券管理', meta: { requireAuth: true, parent: '/' } },
            ]
        },
        {
            path: '/', component: Home, name: 'msgsend', hidden: false, meta: { requireAuth: true, level: 1 },
            children: [
                { path: '/msgsend', component: msgsend, name: '消息推送', ...metaTrue, meta: { title: "消息推送" } },
            ]
        },
        {
            path: '/', component: Home, name: 'integralRule', hidden: false, meta: { requireAuth: true, level: 1 },
            children: [
                { path: '/integralRule', component: integralRule, name: '积分规则', ...metaTrue, meta: { title: "积分规则" } },
            ]
        },

        //隐藏
        // {
        //     path: '/', component: Home, name: 'user', hidden: false, meta: { requireAuth: true, level: 1 },
        //     children: [
        //         { path: '/user', component: user, name: '用户管理', ...metaTrue, meta: { title: "用户管理" } },
        //     ],
        // },
        {
            path: '/', component: Home, name: 'basic', hidden: false, unfold: true, meta: { requireAuth: true, level: 2 },
            children: [
                { path: '/basic', component: basic, name: '基本设置', meta: { title: "基本设置", requireAuth: true, parent: '/' } },
                { path: '/classification', component: classification, name: '分类管理', meta: { requireAuth: true, parent: '/' } },
                { path: '/manage', component: manage, name: '管理员', meta: { requireAuth: true, parent: '/' } },
                { path: '/page', component: page, name: '页面链接管理', meta: { requireAuth: true, parent: '/' } }
            ]
        },

        {
            path: '/', component: Home, name: 'scenicdetail', title: '', hidden: true, unfold: true, meta: { requireAuth: true, level: 3 },
            children: [
                { path: '/scenicdetail', component: scenicdetail, name: '景点信息', meta: { requireAuth: true, parent: 'sencelist' } },
            ]
        },
        {
            path: '/', component: Home, name: 'schedule', hidden: true, unfold: true, meta: { requireAuth: true, level: 3 },
            children: [
                { path: '/partdetail', component: partdetail, name: '时段列表', meta: { requireAuth: true, parent: 'schedule' } },
            ]
        },
        //基础配置
        {
            path: '/', component: Home, name: 'topline', hidden: true, unfold: true, meta: { requireAuth: true, parent: 'parklist', level: 3 },
            children: [
                { path: '/topline', component: topline, name: '公告管理', meta: { requireAuth: true, parent: '/base' } },
                { path: '/message', component: message, name: '消息推送 ', meta: { requireAuth: true, parent: '/base' } },
                { path: '/pagelist', component: pagelist, name: '页面链接管理 ', meta: { requireAuth: true, parent: '/base' } }
            ]
        },
        //景点管理
        {
            path: '/', component: Home, name: 'sencelist', hidden: true, unfold: true, meta: { requireAuth: true, parent: 'parklist', level: 3 },
            children: [
                { path: '/sencelist', component: sencelist, name: '景点列表', meta: { requireAuth: true, parent: '/base' } },
                { path: '/procam', component: procam, name: '全景资源管理', meta: { requireAuth: true, parent: '/base' } },
                { path: '/routerlist', component: routerlist, name: '路线列表', meta: { requireAuth: true, parent: '/base' } },
            ]
        },
        //商品管理
        {
            path: '/', component: Home, name: 'shopMessage', hidden: true, unfold: true, meta: { requireAuth: true, parent: 'parklist', level: 3 },
            children: [
                { path: '/shopMessage', component: shopMessage, name: '商品信息设置', meta: { requireAuth: true, parent: '/base' } },
                { path: '/shopOrder', component: shopOrder, name: '商品订单管理', meta: { requireAuth: true, parent: '/base' } },
                { path: '/shopBinding', component: shopBinding, name: '绑定管理', meta: { requireAuth: true, parent: '/base' } },
                { path: '/shopDistribution', component: shopDistribution, name: '商品分布管理', meta: { requireAuth: true, parent: '/base' } },
                // { path: '/shoplist', component: shoplist, name: '商品管理', meta: { requireAuth: true, parent: '/base' } },
                // { path: '/active', component: active, name: '商城活动', meta: { requireAuth: true, parent: '/base' } },
                // { path: '/product', component: product, name: '商品列表', meta: { requireAuth: true, parent: '/base' } },

            ]
        },
        //活动管理
        {
            path: '/', component: Home, name: 'schedule', hidden: true, unfold: true, meta: { requireAuth: true, parent: 'parklist', level: 3 },
            children: [
                { path: '/schedule', component: schedule, name: '活动列表', meta: { requireAuth: true, parent: '/base' } },
                { path: '/schedunum', component: schedunum, name: '预约统计', meta: { requireAuth: true, parent: '/base' } },
            ]
        },
        //游客服务
        {
            path: '/', component: Home, name: 'lostManage', hidden: true, unfold: true, meta: { requireAuth: true, parent: 'parklist', level: 3 },
            children: [
                { path: '/lostManage', component: lostManage, name: '失物管理', meta: { requireAuth: true, parent: '/base' } },
                { path: '/leaseItem', component: leaseItem, name: '租赁管理', meta: { requireAuth: true, parent: '/lostManage' } }
            ]
        },
        //游客管理
        {
            path: '/', component: Home, name: 'touristAdmin', hidden: true, unfold: true, meta: { requireAuth: true, parent: 'parklist', level: 3 },
            children: [
                { path: '/touristAdmin', component: stoneDetail, name: '游客列表', meta: { requireAuth: true, parent: '/base' } },
                { path: '/stoneDetail', component: stoneDetail, name: '五彩石明细记录', meta: { requireAuth: true, parent: '/base' } },
                { path: '/integralDetail', component: integralDetail, name: '积分明细记录', meta: { requireAuth: true, parent: '/base' } },
                { path: '/discountAdmin', component: discountAdmin, name: '优惠券明细记录', meta: { requireAuth: true, parent: '/base' } },
            ]
        },
        //租赁管理
        {
            path: '/', component: Home, name: 'lease', hidden: true, unfold: true, meta: { requireAuth: true, parent: 'lostManage', level: 4 },
            children: [
                { path: '/leaseItem', component: leaseItem, name: '租赁管理', meta: { requireAuth: true, parent: 'lostManage' } },
                { path: '/leaseRes', component: leaseRes, name: '租赁物品管理', meta: { requireAuth: true, parent: 'lostManage' } },
                { path: '/leaseDistribution', component: leaseDistribution, name: '物品分布管理', meta: { requireAuth: true, parent: 'lostManage' } }
            ]
        },
        //隐藏
        // {
        //     path: '/', component: Home, name: 'feedback', hidden: false, meta: { requireAuth: true, level: 1 },
        //     children: [
        //         { path: '/feedback', component: feedback, name: '意见反馈', ...metaTrue, meta: { title: "意见反馈" } },
        //     ],
        // },
        // {
        //     path: '/heads', component: heads, name: '头图管理'
        // }, {
        //     path: '/functions', component: functions, name: '功能按钮'
        // }, {
        //     path: '/multiprobe', component: multiprobe, name: '夜探阿朵'
        // }, {
        //     path: '/bright', component: bright, name: '夜游亮点'
        // }
    ]
});

// 全局路由钩子
router.beforeEach((to, from, next) => {
    //NProgress.start();
    if (to.path == '/login') {
        sessionStorage.removeItem('user');
    }
    // let isadmin = JSON.parse(sessionStorage.getItem("user")).isadmin;
    var user = sessionStorage.getItem('user');
    var permissionName = []
    if (to.meta.requireAuth) { // 是否需要登录
        if (!user && to.path != '/login') { // 如果登录超时跳转页面的话需要增加是否登录超时的判断，如果超时需要重新登录
            next({ path: '/login' })
        } else {
            var permissions = JSON.parse(sessionStorage.getItem('permissions'));
            router.options.routes.map(n => {
                if (n.name != to.name) {
                    if (n.children) n.children.map(m => {
                        if (permissions) {
                            if (n.meta.level == 2) {
                                // console.log('进入');
                                if (m.name == '基础信息') {
                                    for (let j = 0; j < permissions.length; j++) {
                                        for (let i = 0; i < n.children.length; i++) {
                                            if (n.children[i].name == permissions[j].name) {
                                                permissionName.push(n.children[i])
                                            }
                                        }
                                    }
                                    store.state.child = permissionName
                                    // console.log('permissionName', permissionName);
                                }
                            } else if (m.name == to.name && n.meta.level - 1) {
                                store.state.child = n.children
                            }
                        }
                        else if (m.name == to.name && n.meta.level - 1) {
                            store.state.child = n.children
                        }
                    })
                }
            })
            next();

        }
    } else {
        next()
    }
});
export default router;

