import Vue from 'vue'
import Router from 'vue-router'

import AveragePage from '@/components/AveragePage'

import CurrentMsgHeader from '@/components/CurrentMsgHeader'

import SingleChat from '@/components/CurrentPages/SingleChat'
import GroupChat from '@/components/CurrentPages/GroupChat'
import DiscuzChat from '@/components/CurrentPages/DiscuzChat'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/CurrentMsgHeader',
      name: 'CurrentMsgHeader',
      component: CurrentMsgHeader,
      children: [{
          path: '/SingleChat',
          name: 'SingleChat',
          component: SingleChat
        },
        {
          path: '/GroupChat',
          name: 'GroupChat',
          component: GroupChat
        },
        {
          path: '/DiscuzChat',
          name: 'DiscuzChat',
          component: DiscuzChat
        },
      ]
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
