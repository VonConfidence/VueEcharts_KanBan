// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Config from '@/config/config'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vuex)

//过滤器
Vue.filter('currency', function(value) {
  if (!value) { return '' }
  if (value > 10000000) { return (value / 10000000).toFixed(2) + "(千万)" }
  if (value > 10000) { return (value / 10000).toFixed(2) + "(万)" }
  if (value > 1000) { return (value / 1000).toFixed(2) + "(千)" }
  return Number(value).toFixed(2)
})

const store = new Vuex.Store({
  state: {
    numOfDaysData: Config.numOfDaysData
  },
  mutations: {
    // this.$store.commit('changeNumOfDaysData')
    changeNumOfDaysData(state, payload) {
      // 变更状态
      state.numOfDaysData = payload.numOfDaysData
    }
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

router.push({

  path: 'CurrentMsgHeader'
  // query: {
  //   url: '/screen/22'
  // }
})
