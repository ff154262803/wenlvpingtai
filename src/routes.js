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
import parklist from './views/park/parklist'//园区列表

// 园区管理
import base from './views/park/base'//园区基础信息
import routerlist from './views/park/routerlist'//路线列表
import scenicdetail from './views/park/scenicdetail'//景点详情
import sencelist from './views/park/senceList'//景点详情

//基本设置
import basic from './views/basic/basic'//基本设置
import classification from './views/basic/classification'//分类管理
import manage from './views/basic/manage'//管理员

const metaTrue = {meta: {requireAuth: true}}

const router = new VueRouter({
    routes: [
        {path: '/login', component: Login, name: '', hidden: true, ...metaTrue},
        {path: '/404', component: NotFound, name: '404', hidden: true, meta: {requireAuth: false}},
        {path: '/back', component: Home, name: '返回', hidden: true, back: true, ...metaTrue},
        {path: '/', component: Home, name: 'tongjihome', hidden: false, meta: {requireAuth: true, isparent: false, level: 1},
            children: [
                {path: '/', component: tongjihome, name: '概览', ...metaTrue},
            ]
        }, {path: '/', component: Home, name: 'parklist', hidden: false, meta: {requireAuth: true, level: 1},
            children: [
                {path: '/parklist', component: parklist, name: '园区列表', ...metaTrue},
            ],
        }, {path: '/', component: Home, name: 'base/sencelist/routerlist', hidden: true, meta: {requireAuth: true, level: 2},
            children: [
                {path: '/base', component: base, name: '基础信息', meta: {requireAuth: true, parent: 'parklist'}},
                {path: '/sencelist', component: sencelist, name: '景点列表', meta: {requireAuth: true, parent: 'parklist'}},
                {path: '/routerlist', component: routerlist, name: '路线列表', meta: {requireAuth: true, parent: 'parklist'}},
            ],
        }, {path: '/', component: Home, name: 'user', hidden: false, meta: {requireAuth: true, level: 1},
            children: [
                {path: '/user', component: user, name: '用户管理', ...metaTrue},
            ],
        }, {path: '/', component: Home, name: 'basic', hidden: false, unfold: true, meta: {requireAuth: true, level: 2},
            children: [
                {path: '/basic', component: basic, name: '基本设置', ...metaTrue},
                {path: '/classification', component: classification, name: '分类管理', ...metaTrue},
                {path: '/manage', component: manage, name: '管理员', ...metaTrue}
            ]
        }, {path: '/', component: Home, name: 'scenicdetail', hidden: true, unfold: true, meta: {requireAuth: true, level: 3},
            children: [
                {path: '/scenicdetail', component: scenicdetail, name: '第三级', meta: {requireAuth: true, parent: 'sencelist'}},
            ]
        }
    ]
});

// 全局路由钩子
router.beforeEach((to, from, next) => {
    //NProgress.start();
    if (to.path == '/login') {
        sessionStorage.removeItem('user');
    }
    let user = sessionStorage.getItem('uid');
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

