import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
  count: 10,
  child: [],//储存左侧导航栏内容
  ip: 'http://192.192.0.241:5007/travelmanage/api',//开发请求地址
  // ip: 'http://47.95.215.6:5000/travelmanage/api',//测试请求地址
  resip: 'https://ferris-wheel.oss-cn-beijing.aliyuncs.com/',
  //resip: 'http://qlv.test.zkshiwei.com/res/',
  // role: {
  //   list: [{
  //     id: 1,
  //     name: "管理员用户管理",
  //     code: "SYSTEM_PERMISSION_ADMIN",
  //   },
  //   {
  //     id: 2,
  //     name: "角色管理",
  //     code: "SYSTEM_PERMISSION_ROLE",
  //   },
  //   {
  //     id: 3,
  //     name: "播控计划",
  //     code: "FERRISWHEEL_BROADCAST_PLAN",
  //   },
  //   {
  //     id: 16,
  //     name: "基础信息",
  //     code: "PLATFORM_PARK_BASIC_INFO",
  //   },
  //   {
  //     id: 17,
  //     name: "基础配置",
  //     code: "PLATFORM_PARK_BASIC_CONFIG",
  //   },
  //   {
  //     id: 18,
  //     name: "景点管理",
  //     code: "PLATFORM_PARK_SITE_ALL",
  //   },
  //   {
  //     id: 19,
  //     name: "商品管理",
  //     code: "PLATFORM_PARK_GOODS_ALL",
  //   },
  //   {
  //     id: 20,
  //     name: "活动管理",
  //     code: "PLATFORM_PARK_EVENTS_ALL",
  //   },
  //   {
  //     id: 21,
  //     name: "游客服务",
  //     code: "PLATFORM_PARK_VISITORS_SERVICES_ALL",
  //   },
  //   {
  //     id: 22,
  //     name: "新闻管理",
  //     code: "PLATFORM_PARK_NOTICE_ALL",
  //   },
  //   {
  //     id: 23,
  //     name: "票务管理",
  //     code: "PLATFORM_PARK_TICKET_ALL",
  //   },
  //   {
  //     id: 24,
  //     name: "酒店管理",
  //     code: "PLATFORM_PARK_HOTEL_ALL",
  //   },
  //   {
  //     id: 25,
  //     name: "游客管理",
  //     code: "PLATFORM_PARK_VISITORS_MANAGE_ALL",
  //   },
  //   {
  //     id: 26,
  //     name: "页面管理",
  //     code: "PLATFORM_PARK_PAGELINK_ALL",
  //   },
  //   {
  //     id: 27,
  //     name: "设备管理",
  //     code: "PLATFORM_PARK_DEVICES_ALL",
  //   }],
  //   name: {
  //     //权限管理
  //     SYSTEM_PERMISSION_ADMIN: '管理员',
  //     SYSTEM_PERMISSION_ROLE: '角色管理',
  //     //园区管理
  //     PLATFORM_PARK_BASIC_INFO: '基础信息',
  //     PLATFORM_PARK_BASIC_CONFIG: '基础配置',
  //     PLATFORM_PARK_SITE_ALL: '景点管理',
  //     PLATFORM_PARK_GOODS_ALL: '商品管理',
  //     PLATFORM_PARK_EVENTS_ALL: '活动管理',
  //     PLATFORM_PARK_VISITORS_SERVICES_ALL: '游客服务',
  //     PLATFORM_PARK_NOTICE_ALL: '新闻管理',
  //     PLATFORM_PARK_TICKET_ALL: '票务管理',
  //     PLATFORM_PARK_HOTEL_ALL: '酒店管理',
  //     PLATFORM_PARK_VISITORS_MANAGE_ALL: '游客管理',
  //     PLATFORM_PARK_PAGELINK_ALL: '页面管理',
  //     PLATFORM_PARK_DEVICES_ALL: '设备管理',
  //   },
  //   id: {
  //     //权限管理
  //     SYSTEM_PERMISSION_ADMIN: 1,
  //     SYSTEM_PERMISSION_ROLE: 2,
  //     //园区管理
  //     PLATFORM_PARK_BASIC_INFO: 16,
  //     PLATFORM_PARK_BASIC_CONFIG: 17,
  //     PLATFORM_PARK_SITE_ALL: 18,
  //     PLATFORM_PARK_GOODS_ALL: 19,
  //     PLATFORM_PARK_EVENTS_ALL: 20,
  //     PLATFORM_PARK_VISITORS_SERVICES_ALL: 21,
  //     PLATFORM_PARK_NOTICE_ALL: 22,
  //     PLATFORM_PARK_TICKET_ALL: 23,
  //     PLATFORM_PARK_HOTEL_ALL: 24,
  //     PLATFORM_PARK_VISITORS_MANAGE_ALL: 25,
  //     PLATFORM_PARK_PAGELINK_ALL: 26,
  //     PLATFORM_PARK_DEVICES_ALL: 27,
  //   }
  // }
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
