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
import msgsend from './views/msg/msgsend'//商品列表
import feedback from './views/feedback/feedback'//商品列表
import shoplist from './views/shop/list'//商品列表
// import orderlist from './views/order/list'//订单列表
// import shoplist from './components/editor'//订单列表
// 园区管理
import base from './views/park/base'//园区基础信息
import routerlist from './views/park/routerlist'//路线列表
import scenicdetail from './views/park/scenicdetail'//景点详情
import sencelist from './views/park/senceList'//景点列表
import product from './views/park/product'//商品列表
import schedule from './views/park/active'//活动管理
import schedunum from './views/park/schedunum'//预约统计
import topline from './views/park/topline'//头条管理
import procam from './views/park/procam'//全景资源管理
import partdetail from './views/park/partdetail'//活动管理
import lostManage from './views/park/lostManage'//失物管理
import leaseItem from './views/park/lease/leaseItem'//租赁管理
import leaseRes from './views/park/lease/leaseRes'//租赁物品
import leaseDistribution from './views/park/lease/leaseDistribution'//租赁分布
import paySet from './views/pay/paySet'//充值设置
import IntegralRecord from './views/pay/IntegralRecord'//积分记录
import exchangeRecord from './views/pay/exchangeRecord'//兑换记录
import homeConfiguration from './views/park/homeConfiguration'//首页配置

// 商品管理
import active from './views/shop/active'//商城活动

//基本设置
import basic from './views/basic/basic'//基本设置
import classification from './views/basic/classification'//分类管理
import manage from './views/basic/manage'//管理员
import page from './views/basic/page'//页面链接管理
//首页配置
import heads from './views/gohome/heads'//头图管理
import functions from './views/gohome/functions'//功能按钮
import bright from './views/gohome/bright'//夜游亮点
import multiprobe from './views/gohome/multiprobe'// 夜探阿朵
//权限管理
import roleManagement from './views/role/roleManagement';//角色管理
import adminManagement from './views/role/adminManagement';//管理员管理
const metaTrue = { meta: { requireAuth: true } }

const router = new VueRouter({
    routes: [
        { path: '/login', component: Login, name: '', hidden: true, ...metaTrue },
        { path: '/404', component: NotFound, name: '404', hidden: true, meta: { requireAuth: false } },
        { path: '/back', component: Home, name: '返回', hidden: true, back: true, ...metaTrue },
        {
            path: '/', component: Home, name: '概览', hidden: false, meta: { requireAuth: true, level: 1 },
            children: [{ path: '/', component: tongjihome, name: '概览', ...metaTrue },]
        },
        {
            path: '/', component: Home, name: '权限管理', hidden: false, unfold: true, meta: { requireAuth: true, level: 2 },
            children: [
                { path: '/roleManagement', component: roleManagement, name: '角色管理', meta: { requireAuth: true, parent: '/' } },
                { path: '/adminManagement', component: adminManagement, name: '管理员管理', meta: { requireAuth: true, parent: '/' } },
            ]
        },
        {
            path: '/', component: Home, name: '园区管理', hidden: false, meta: { requireAuth: true, level: 1 },
            children: [{ path: '/parklist', component: parklist, name: '园区管理', ...metaTrue },],
        },
        
        {
            path: '/', component: Home, name: '基础信息', hidden: true, meta: { requireAuth: true, level: 2 },
            children: [
                { path: '/base', component: base, name: '基础信息', meta: { requireAuth: true, parent: 'parklist' } },
                { path: '/sencelist', component: sencelist, name: '景点列表', meta: { requireAuth: true, parent: 'parklist' } },
                { path: '/routerlist', component: routerlist, name: '路线列表', meta: { requireAuth: true, parent: 'parklist' } },
                { path: '/procam', component: procam, name: '全景资源管理', meta: { requireAuth: true, parent: 'parklist' } },
                { path: '/product', component: product, name: '商品列表', meta: { requireAuth: true, parent: 'parklist' } },
                { path: '/schedule', component: schedule, name: '活动管理', meta: { requireAuth: true, parent: 'parklist' } },
                { path: '/lostManage', component: lostManage, name: '失物管理', meta: { requireAuth: true, parent: 'parklist' } },
                {
                    path: '/leaseItem', component: leaseItem, redirect: 'leaseItem', name: '租赁管理', meta: { requireAuth: true, parent: 'parklist' },
                    //路由加载模块，导航加载菜单
                    children: [{ path: '/leaseItem', component: leaseItem, name: '租赁管理', meta: { requireAuth: true, parent: 'base' } }]
                },
                { path: '/topline', component: topline, name: '公告管理', meta: { requireAuth: true, parent: 'parklist' } },
                { path: '/schedunum', component: schedunum, name: '预约统计', meta: { requireAuth: true, parent: 'parklist' } },
                { path: '/homeConfiguration', component: homeConfiguration, name: '首页配置', meta: { requireAuth: true, switchs: true, parent: 'parklist' } },
            ],
        },
        {
            path: '/', component: Home, name: '商品管理', hidden: false, unfold: true, meta: { requireAuth: true, level: 2 },
            children: [
                { path: '/shoplist', component: shoplist, name: '商品管理', meta: { requireAuth: true, parent: '/' } },
                { path: '/active', component: active, name: '商城活动', meta: { requireAuth: true, parent: '/' } }
            ]
        },
        {
            path: '/', component: Home, name: '消息推送', hidden: false, meta: { requireAuth: true, level: 1 },
            children: [
                { path: '/msgsend', component: msgsend, name: '消息推送', ...metaTrue },
            ]
        },
        {
            path: '/', component: Home, name: '充值设置', hidden: false, unfold: true, meta: { requireAuth: true, level: 2 },
            children: [
                { path: '/paySet', component: paySet, name: '充值设置', meta: { requireAuth: true, parent: '/' } },
                { path: '/IntegralRecord', component: IntegralRecord, name: '积分记录', meta: { requireAuth: true, parent: '/' } },
                { path: '/exchangeRecord', component: exchangeRecord, name: '兑换记录', meta: { requireAuth: true, parent: '/' } }
            ]
        },
        {
            path: '/', component: Home, name: '用户管理', hidden: false, meta: { requireAuth: true, level: 1 },
            children: [
                { path: '/user', component: user, name: '用户管理', ...metaTrue },
            ],
            // },
            // {path: '/', component: Home, name: 'orderlist', hidden: false, meta: {requireAuth: true, level: 1},
            //     children: [
            //         {path: '/orderlist', component: orderlist, name: '订单管理', ...metaTrue},
            //     ]
        },
        {
            path: '/', component: Home, name: '基本设置', hidden: false, unfold: true, meta: { requireAuth: true, level: 2 },
            children: [
                { path: '/basic', component: basic, name: '基本设置', meta: { requireAuth: true, parent: '/' } },
                { path: '/classification', component: classification, name: '分类管理', meta: { requireAuth: true, parent: '/' } },
                { path: '/manage', component: manage, name: '管理员', meta: { requireAuth: true, parent: '/' } },
                { path: '/page', component: page, name: '页面链接管理', meta: { requireAuth: true, parent: '/' } }
            ]
        },
        {
            path: '/', component: Home, name: '景点信息', hidden: true, unfold: true, meta: { requireAuth: true, level: 3 },
            children: [
                { path: '/scenicdetail', component: scenicdetail, name: '景点信息', meta: { requireAuth: true, parent: 'sencelist' } },
            ]
        },
        {
            path: '/', component: Home, name: '时段列表', hidden: true, unfold: true, meta: { requireAuth: true, level: 3 },
            children: [
                { path: '/partdetail', component: partdetail, name: '时段列表', meta: { requireAuth: true, parent: 'schedule' } },
            ]
        },
        {
            path: '/', component: Home, name: '租赁管理', hidden: true, unfold: true, meta: { requireAuth: true, parent: 'parklist', level: 3 },
            children: [
                { path: '/leaseItem', component: leaseItem, name: '租赁管理', meta: { requireAuth: true, parent: 'base' } },
                { path: '/leaseRes', component: leaseRes, name: '租赁物品管理', meta: { requireAuth: true, parent: 'base' } },
                { path: '/leaseDistribution', component: leaseDistribution, name: '物品分布管理', meta: { requireAuth: true, parent: 'base' } }
            ]
        },
        {
            path: '/', component: Home, name: '意见反馈', hidden: false, meta: { requireAuth: true, level: 1 },
            children: [
                { path: '/feedback', component: feedback, name: '意见反馈', ...metaTrue },
            ],
        },
        {
            path: '/heads', component: heads, name: '头图管理'
        }, {
            path: '/functions', component: functions, name: '功能按钮'
        }, {
            path: '/multiprobe', component: multiprobe, name: '夜探阿朵'
        }, {
            path: '/bright', component: bright, name: '夜游亮点'
        }
    ]
});

// 全局路由钩子
router.beforeEach((to, from, next) => {
    //NProgress.start();
    if (to.path == '/login') {
        sessionStorage.removeItem('user');
    }
    let user = sessionStorage.getItem('user');
    if (to.meta.requireAuth) { // 是否需要登录
        if (!user && to.path != '/login') { // 如果登录超时跳转页面的话需要增加是否登录超时的判断，如果超时需要重新登录
            next({ path: '/login' })
        } else {
            router.options.routes.map(n => {
                if (n.name != to.name) {
                    if (n.children) n.children.map(m => {
                        if (m.name == to.name && n.meta.level - 1) {
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

