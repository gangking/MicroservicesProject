/**
 * 页面的入口
 * <pre>
 * 作者:daxin ding
 * 邮箱:daxin.ding@pactera.com
 * 日期:2015-11-02-下午3:29:34
 * 版权:深圳文思海辉有限公司
 * </pre>
 */
// import 'babel-polyfill'
import Vue from 'vue'// Vue
import App from './App'// 应用

import store from './store' // 存储
import i18n from './i18n' // Internationalization 国际化

// 核心插件
import ibps from '@/plugins/ibps'

// 菜单和路由设置
import router from './router' // 路由

import '@/permission' // permission control 权限控制

import '@/utils/directives.js'
// 引入vue-fullscreen全屏插件
import fullscreen from 'vue-fullscreen'
Vue.use(fullscreen)



// 增加axios
import axios from "axios";
Vue.prototype.axios = axios

//增加顶栏自定义字体图标
// import '@/assets/fonts/topicon/iconfont.css'
//引入spa字体图标
import '@/assets/fonts/iconfontmergesapfont/style.css'
/* //波浪插件
import Waves from 'node-waves/dist/waves.js';
import 'node-waves/dist/waves.min.css';
Waves.attach();
Waves.init() */

// 平台核心插件
Vue.use(ibps)

new Vue({
  router,
  store,
  i18n,
  mounted() {
    // 展示系统信息
    this.$store.commit('ibps/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('ibps/account/load')
    // 获取并记录用户 UA
    this.$store.commit('ibps/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('ibps/fullscreen/listen')
  },
  render: h => h(App)
}).$mount('#app')
