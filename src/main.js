// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

//过滤器
Vue.filter('currency', function(value) {
  if (!value) { return '' }
  if (value > 10000000) { return (value / 10000000).toFixed(2) + "(千万)" }
  if (value > 10000) { return (value / 10000).toFixed(2) + "(万)" }
  if (value > 1000) { return (value / 1000).toFixed(2) + "(千)" }
  return value.toFixed(2)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

router.push({path: 'SingleChat', query: {
  url: '/screen/22'
}})
