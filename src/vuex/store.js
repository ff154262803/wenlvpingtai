import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    count: 10,
    child:[],//储存左侧导航栏内容
    // ip:'https://gysl-home.zkshiwei.com:5000/api',//请求地址ip
    ip:'https://qlv.test.zkshiwei.com/api',//请求地址ip
    resip:'https://qlv.test.zkshiwei.com/res/'
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
