import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './vuex/store'

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
import orderlist from './views/order/list'//订单列表
// import shoplist from './components/editor'//订单列表
// 园区管理
import base from './views/park/base'//园区基础信息
import routerlist from './views/park/routerlist'//路线列表
import scenicdetail from './views/park/scenicdetail'//景点详情
import sencelist from './views/park/senceList'//景点列表
import product from './views/park/product'//商品列表
import schedule from './views/park/active'//活动管理
import partdetail from './views/park/partdetail'//活动管理

// 商品管理
import active from './views/shop/active'//商城活动

//基本设置
import basic from './views/basic/basic'//基本设置
import classification from './views/basic/classification'//分类管理
import manage from './views/basic/manage'//管理员
import page from './views/basic/page'//页面链接管理

const metaTrue = {meta: {requireAuth: true}}

const router = new VueRouter({
    routes: [
        {path: '/login', component: Login, name: '', hidden: true, ...metaTrue},
        {path: '/404', component: NotFound, name: '404', hidden: true, meta: {requireAuth: false}},
        {path: '/back', component: Home, name: '返回', hidden: true, back: true, ...metaTrue},
        {path: '/', component: Home, name: 'tongjihome', hidden: false, meta: {requireAuth: true, level: 1},
            children: [
                {path: '/', component: tongjihome, name: '概览', ...metaTrue},
            ]
        }, {path: '/', component: Home, name: 'parklist', hidden: false, meta: {requireAuth: true, level: 1},
            children: [
                {path: '/parklist', component: parklist, name: '园区管理', ...metaTrue},
            ],
        }, {path: '/', component: Home, name: 'base', hidden: true, meta: {requireAuth: true, level: 2},
            children: [
                {path: '/base', component: base, name: '基础信息', meta: {requireAuth: true, parent: 'parklist'}},
                {path: '/sencelist', component: sencelist, name: '景点列表', meta: {requireAuth: true, parent: 'parklist'}},
                {path: '/routerlist', component: routerlist, name: '路线列表', meta: {requireAuth: true, parent: 'parklist'}},
                {path: '/product', component: product, name: '商品列表', meta: {requireAuth: true, parent: 'parklist'}},
                {path: '/schedule', component: schedule, name: '活动管理', meta: {requireAuth: true, parent: 'schedule'}},
            ],
        },
        {path: '/', component: Home, name: 'shoplist', hidden: false, unfold: true, meta: {requireAuth: true, level: 2},
            children: [
                {path: '/shoplist', component: shoplist, name: '商品管理', ...metaTrue},
                {path: '/active', component: active, name: '商城活动', ...metaTrue}
            ]
        },{path: '/', component: Home, name: 'msgsend', hidden: false, meta: {requireAuth: true, level: 1},
            children: [
                {path: '/msgsend', component: msgsend, name: '消息推送', ...metaTrue},
            ]
        }, {path: '/', component: Home, name: 'user', hidden: false, meta: {requireAuth: true, level: 1},
            children: [
                {path: '/user', component: user, name: '用户管理', ...metaTrue},
            ],
        },
        {path: '/', component: Home, name: 'orderlist', hidden: false, meta: {requireAuth: true, level: 1},
            children: [
                {path: '/orderlist', component: orderlist, name: '订单管理', ...metaTrue},
            ]
        }, {path: '/', component: Home, name: 'basic', hidden: false, unfold: true, meta: {requireAuth: true, level: 2},
            children: [
                {path: '/basic', component: basic, name: '基本设置', ...metaTrue},
                {path: '/classification', component: classification, name: '分类管理', ...metaTrue},
                {path: '/manage', component: manage, name: '管理员', ...metaTrue},
                {path: '/page', component: page, name: '页面链接管理', ...metaTrue}
            ]
        }, {path: '/', component: Home, name: 'scenicdetail', hidden: true, unfold: true, meta: {requireAuth: true, level: 3},
            children: [
                {path: '/scenicdetail', component: scenicdetail, name: '景点信息', meta: {requireAuth: true, parent: 'sencelist'}},
            ]
        }, {path: '/', component: Home, name: 'partdetail', hidden: true, unfold: true, meta: {requireAuth: true, level: 3},
            children: [
                {path: '/partdetail', component: partdetail, name: '时段列表', meta: {requireAuth: true, parent: 'sencelist'}},
            ]
        },{path: '/', component: Home, name: 'feedback', hidden: false, meta: {requireAuth: true, level: 1},
            children: [
                {path: '/feedback', component: feedback, name: '意见反馈', ...metaTrue},
            ],
        }]
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
            next({path: '/login'})
        } else {
            router.options.routes.map(n => {
                if (n.name != to.name) {
                    if (n.children) n.children.map(m => {
                        if (m.name == to.name && n.meta.level - 1) {
                            // console.log(m,to)
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

