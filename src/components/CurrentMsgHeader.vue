<template>
  <div id="nav-header">
    <header class="header-title">折线图: 当前消息数</header>
    <nav class="nav-header">
      <ul class="nav-list">
        <li class="item"><a href="javascript:void(0)" @click="clickChart('SingleChat')" :class="{selected: this.tabValue==='SingleChat'}">单聊</a></li>
        <li class="item"><a href="javascript:void(0)" @click="clickChart('GroupChat')" :class="{selected: this.tabValue==='GroupChat'}">群聊</a></li>
        <li class="item"><a href="javascript:void(0)" @click="clickChart('DiscuzChat')" :class="{selected: this.tabValue==='DiscuzChat'}">讨论组</a></li>
      </ul>
    </nav>
    <div class="main">
      <!-- <router-view></router-view> -->
      <SingleChat :url="url" :chartTitle="chartTitle"></SingleChat>
    </div>
  </div>
</template>
<script>
import Config from '@/config/config'
import SingleChat from '@/components/CurrentPages/SingleChat'
import * as Util from '@/util/util'

export default {
  data() {
    return {
      tabValue: 'SingleChat', // 为0 表示 单聊  为1表示群聊, 为2表示讨论组
      url: '/screen/22',
      chartTitle: Util.currentMsgMap.get('SingleChat')
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'routeChange'
  },
  methods: {
    // routeChange() {
    //   var path = this.$route.path;
    //   // console.log('%%%%%%%%%%%%%%%Router Path', path); //           /GroupChat
    //   // 控制路由回退的时候  tabsValue得值 不知道是哪一个
    //   this.tabValue = path.slice(1);
    // },
    clickChart(tabValue) {
      this.tabValue = tabValue;

      let chartTitle = '';
      let query = {}
      switch (tabValue) {
        case 'SingleChat':
          chartTitle = 'SingleChat'
          query.url = '/screen/22'
          break
        case 'GroupChat':
          chartTitle = 'GroupChat'
          query.url = '/screen/23'
          break;
        case 'DiscuzChat':
          chartTitle = 'DiscuzChat'
          query.url=  '/screen/24'
          break;
        default:
          break;
      } // end switch
      this.url = query.url;
      this.chartTitle = Util.currentMsgMap.get(chartTitle);
    }

  },
  components: {
    SingleChat
  }
}

</script>
<style>
#nav-header {
  min-height: 300px;
}

.header-title {
  text-align: left;
  font-weight: bold;
  font-size: 25px;
}

.nav-header {
  text-align: left;
  margin: 20px 0 10px 0;
  height: 60px;
  line-height: 60px;

  border: 1px solid #999;
}

ul.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}


.nav-list li.item {
  display: inline-block;
  width: 30%;
  max-width: 150px;
  text-align: center;
  border-right: 1px solid #ccc;
}

.item a {
  display: block;
  margin: 0 20px;
  font-size: 20px;
  color: #000;
  line-height: 40px;
  text-decoration: none;
}

.single-chat .chart-date-picker {
  display: inline-block;
  position: absolute;
  /*right: 150px;*/
  width: 200px;
}

.startTime,
.endTime {
  display: inline-block;
}

.item-container {
  min-height: 300px;
  text-align: left;
}








/*li.spacer {
  overflow: hidden;
  margin: 11px 5px 0;
  width: 1px;
  height: 10px;
  background-color: #ccc;
  float: left;
}*/

.selected {
  border-bottom: 3px solid rgb(49, 149, 236);
  color: rgb(49, 149, 236);
}









/*#nav-header ,tab-pane{
  text-align: left;
}
#nav-header  .el-tabs__item {
  width: 150px;
  height: 50px;
  line-height: 50px;
}*/

</style>
