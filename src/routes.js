import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './vuex/store'

Vue.use(VueRouter)

import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'


// //首页内容
import pay from './views/tongji/a'//概览
import garden from './views/garden/garden'//园区管理
import user from './views/user/user'//用户管理

//基本设置
import basic from './views/basic/basic'
import classification from './views/basic/classification'
import three from './views/basic/three'

const router = new VueRouter({
    routes: [
        {path: '/login', component: Login, name: '', hidden: true, meta: {requireAuth: true}},
        {path: '/404', component: NotFound, name: '404', hidden: true, meta: {requireAuth: false}}, {
            path: '/',
            component: Home,
            name: '返回',
            hidden: true,
            back: true,
            meta: {requireAuth: true}
        }, {
            path: '/',
            component: Home,
            name: 'pay',
            hidden: false,
            // iconCls: 'fa fa-bar-chart',
            children: [
                {path: '/pay', component: pay, name: '概览', meta: {requireAuth: true}},
            ],
            meta: {requireAuth: true}
        }, {
            path: '/',
            component: Home,
            name: 'garden',
            hidden: false,
            children: [
                {path: '/garden', component: garden, name: '园区管理', meta: {requireAuth: true}},
            ],
            meta: {requireAuth: true}
        }, {
            path: '/',
            component: Home,
            name: 'user',
            hidden: false,
            children: [
                {path: '/user', component: user, name: '用户管理', meta: {requireAuth: true}},
            ],
            meta: {requireAuth: true}
        }, {
            path: '/',
            component: Home,
            name: 'basic',
            hidden: false,
            unfold: true,
            children: [
                {path: '/basic', component: basic, name: '基本设置', meta: {requireAuth: true}},
                {path: '/classification', component: classification, name: '分类管理', meta: {requireAuth: true}}
            ],
            meta: {requireAuth: true}
        }, {
            path: '/',
            component: Home,
            name: 'three',
            hidden: true,
            unfold: true,
            children: [
                {path: '/three', component: three, name: '第三级', meta: {requireAuth: true, parent: 'basic', class: 3}},
            ],
            meta: {requireAuth: true}
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
            next({path: '/login'})
        } else {
            next();
            // console.warn(to);
            // router.options.routes.map(n => {
            //     console.log(n);
            //     if (n.name == to.fullPath.substr(1)) {
            //         // console.log(n);
            //         if(to.meta.parent){
            //             console.error(n.children)
            //             store.state.child = n.children
            //         }
            //     }
            // })
        }
    } else {
        next()
    }
});
export const init = function (route) {
    var child = router.options.routes.filter(n => {
        if (~n.name.indexOf(route)) return true
    });
    // console.error(child[0].children)
    store.state.child = child[0].children
};
export default router;

