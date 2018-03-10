import Vue from 'vue'
import Router from 'vue-router'

import AveragePage from '@/components/AveragePages/AveragePage'

import CurrentMsgHeader from '@/components/CurrentMsgHeader'
import MapChart from '@/components/MapChart/MapChart'
import NavMenu from '@/components/NavMenu/nav-menu'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [{
      path: '/',
      redirect: {
        name: 'NavMenu'
      }
    }, {
      path: '/NavMenu',
      name: 'NavMenu',
      component: NavMenu
    }, {
      path: '/CurrentMsg',
      name: 'CurrentMsg',
      component: CurrentMsgHeader
    },
    {
      path: '/AveragePage',
      name: 'AveragePage',
      component: AveragePage
    },
    {
      path: '/MapChart',
      name: 'MapChart',
      component: MapChart
    },
    {
      path: '/test',
      name: 'test',
      component: () =>
        import ('@/components/TreeColumn.vue')
    }
  ]
})
