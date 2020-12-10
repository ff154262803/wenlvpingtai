import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    count: 10,
    child:[],//储存左侧导航栏内容
    // ip:'https://unicom-test.zkshiwei.com:12015/api',//请求地址ip
    // ip:'http://platform.hw.zkshiwei.com:30020/api',//请求地址ip
    
    //ip:'http://qlv.test.zkshiwei.com/api',//请求地址ip00
    //ip: 'http://192.192.0.241:8008/api',//请求地址ip00
    //ip: 'http://192.192.0.241:5005/api',//请求地址ip00
    ip:'http://qlv.test.zkshiwei.com:5051/api',//请求地址ip00
    //ip:'http://qlv.test.zkshiwei.com:5001/api',//请求地址ip00
    //ip:'http://qlv.test.zkshiwei.com:5050/api',//请求地址ip00
    
    // resip:'https://qlv.test.zkshiwei.com/res/'
    resip: 'https://unicom-test.zkshiwei.com:12015/res/',
    role: {
        list: [{
            id: 1,
            name: "管理员用户管理",
            code: "SYSTEM_PERMISSION_ADMIN",
        }, {
            id: 2,
            name: "角色管理",
            code: "SYSTEM_PERMISSION_ROLE",
        }, {
            id: 3,
            name: "播控计划",
            code: "FERRISWHEEL_BROADCAST_PLAN",
        }, {
            id: 4,
            name: "播控设置",
            code: "FERRISWHEEL_BROADCAST_SETTING",
        }, {
            id: 5,
            name: "播控记录",
            code: "FERRISWHEEL_BROADCAST_RECORD",
        }, {
            id: 6,
            name: "分类管理",
            code: "FERRISWHEEL_CONTENT_CLASSIFICATION",
        }, {
            id: 7,
            name: "元素管理",
            code: "FERRISWHEEL_CONTENT_ELEMENT",
        }, {
            id: 8,
            name: "主题管理",
            code: "FERRISWHEEL_CONTENT_THEME",
        }, {
            id: 9,
            name: "循环动画管理",
            code: "FERRISWHEEL_CONTENT_ANIMATION",
        }, {
            id: 10,
            name: "常用语审核管理",
            code: "FERRISWHEEL_AUDIT_LANGUAGE",
        }, {
            id: 11,
            name: "抽奖管理",
            code: "FERRISWHEEL_LOTTERY_DRAW",
        }, {
            id: 12,
            name: "中奖记录",
            code: "FERRISWHEEL_LOTTERY_RECORD",
        }, {
            id: 13,
            name: "文字上传",
            code: "FERRISWHEEL_TEXT_UPLOAD",
        }, {
            id: 14,
            name: "播控刷新",
            code: "FERRISWHEEL_BROADCAST_SETTING",
        }, {
            id: 15,
            name: "服务信息",
            code: "FERRISWHEEL_BROADCAST_SETTING",
        }],
        name: {
            //权限管理
            SYSTEM_PERMISSION_ADMIN: '管理员',
            SYSTEM_PERMISSION_ROLE: '角色管理',
            //播控管理
            FERRISWHEEL_BROADCAST_PLAN: '播控计划',
            FERRISWHEEL_BROADCAST_SETTING: '播控设置',
            FERRISWHEEL_BROADCAST_RECORD: '播控记录',
            //内容管理
            FERRISWHEEL_CONTENT_CLASSIFICATION: '内容管理',
            FERRISWHEEL_CONTENT_ELEMENT: '元素管理',
            FERRISWHEEL_CONTENT_THEME: '主题管理',
            FERRISWHEEL_CONTENT_ANIMATION: '循环动画管理',
            FERRISWHEEL_TEXT_UPLOAD: '文字上传',
            //审核管理
            FERRISWHEEL_AUDIT_LANGUAGE: '常用语管理',
            //抽奖管理
            FERRISWHEEL_LOTTERY_DRAW: '抽奖',
            FERRISWHEEL_LOTTERY_RECORD: '中奖记录',
            //系统服务
            FERRISWHEEL_BROADCAST_SETTING:'播控刷新',
            FERRISWHEEL_BROADCAST_SETTING:'服务信息'
        },
        id: {
            SYSTEM_PERMISSION_ADMIN: 1,
            SYSTEM_PERMISSION_ROLE: 2,
            FERRISWHEEL_BROADCAST_PLAN: 3,
            FERRISWHEEL_BROADCAST_SETTING: 4,
            FERRISWHEEL_BROADCAST_RECORD: 5,
            FERRISWHEEL_CONTENT_CLASSIFICATION: 6,
            FERRISWHEEL_CONTENT_ELEMENT: 7,
            FERRISWHEEL_CONTENT_THEME: 8,
            FERRISWHEEL_CONTENT_ANIMATION: 9,
            FERRISWHEEL_AUDIT_LANGUAGE: 10,
            FERRISWHEEL_LOTTERY_DRAW: 11,
            FERRISWHEEL_LOTTERY_RECORD: 12,
            FERRISWHEEL_TEXT_UPLOAD: 13
        }
    }
}

// 定义所需的 mutations
const mutations = {
    INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})
