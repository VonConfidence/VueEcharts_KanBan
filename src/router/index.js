import Vue from 'vue'
import Router from 'vue-router'

import AveragePage from '@/components/AveragePage'

import CurrentMsgHeader from '@/components/CurrentMsgHeader'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/CurrentMsgHeader',
      name: 'CurrentMsgHeader',
      component: CurrentMsgHeader
    },
    {
      path: '/average',
      name: 'AveragePage',
      component: AveragePage
    },
    // {
    //   path: '/testDate',
    //   name: 'testDate',
    //   component: () =>
    //     import ('@/components/test/DateTest.vue')
    // }
  ]
})
