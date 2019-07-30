import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'


// //首页内容
import pay from './views/tongji/a'//家庭版支付统计
// import person from './views/weChart/person'//家庭版人数统计
// import sencePay from './views/weChart/sencePay'//现场支付统计
// import sencePerson from './views/weChart/sencePerson'//现场人数统计

//基本设置
// import basicPage from './basic/basicPage'
// import classificationPage from './basic/classificationPage'

const router = new VueRouter({
    routes: [
        {path: '/login', component: Login, name: '', hidden: true, meta: {requireAuth: true}},
        {path: '/404', component: NotFound, name: '404', hidden: true, meta: {requireAuth: false}},
        {
            path: '/',
            component: Home,
            name: '返回',
            hidden: true,
            back: true,
            meta: {requireAuth: true}
        }, 
        {
            path: '/',
            component: Home,
            name: '概览',
            hidden: false,
            // iconCls: 'fa fa-bar-chart',
            children: [
                {path: '/pay', component: pay, name: '概览', meta: {requireAuth: true}},
            ],
            meta: {requireAuth: true}
        },
        //  {
        //     path: '/',
        //     component: Home,
        //     name: '园区管理',
        //     hidden: false,
        //     children: [
        //         {path: '/sencePay', component: sencePay, name: '园区管理', meta: {requireAuth: true}},
        //     ],
        //     meta: {requireAuth: true}
        // }, {
        //     path: '/',
        //     component: Home,
        //     name: '用户管理',
        //     hidden: false,
        //     children: [
        //         {path: '/sencePerson', component: sencePerson, name: '用户管理', meta: {requireAuth: true}},
        //     ],
        //     meta: {requireAuth: true}
        // }, {
        //     path: '/',
        //     component: Home,
        //     name: '基本设置',
        //     hidden: false,
        //     children: [
        //         {path: '/basicPage', component: basicPage, name: '基本设置', meta: {requireAuth: true}},
        //     ],
        //     meta: {requireAuth: true}
        // }, {
        //     path: '/',
        //     component: Home,
        //     name: '分类管理',
        //     hidden: true,
        //     children: [
        //         {path: '/classificationPage', component: classificationPage, name: '分类管理', meta: {requireAuth: true}},
        //     ],
        //     meta: {requireAuth: true}
        // }
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
            next()
        }
    }else{
        next()
    }
});
export const initArr = ['概览','园区管理','用户管理','基本设置'];
export const initSet = ['返回','基本设置','分类管理'];
export const init = function (arr) {
    router.options.routes.map(n=>{
        n.hidden = true;
        arr.map(m=>{
            if(n.name == m){
                n.hidden = false;
            }
        })

    })
};
export default router;

