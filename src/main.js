import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ajax from './api/api'

import VueUeditorWrap from 'vue-ueditor-wrap'

import store from './vuex/store'
import Vuex from 'vuex'
import router from './routes.js'


import 'font-awesome/css/font-awesome.min.css'


Vue.use(ElementUI);
Vue.use(Vuex);
Vue.prototype.$ajax = ajax;
Vue.component('vue-ueditor-wrap', VueUeditorWrap)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

