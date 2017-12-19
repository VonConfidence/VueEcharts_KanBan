<template>
  <div class="singel-chat">
    <div class="item-container" v-loading="loading">
      <data-item :data="item" v-for="(item,index) in cardItems" :key="item.title" :isActiveItem="index == activeItemIndex" @changeActiveItem="changeActiveItem" :index="index">
      </data-item>
    </div>
    <div class="chart-container">
      <div class="chart-header">
        <span>{{chartTitle}}折线图</span>
        <div class="chart-date-picker">
          <div class="startTime">
            <span class="timeText">起始时间</span>
            <el-date-picker v-model="startDateData" type="date" :clearable="false" :picker-options="pickerOptions" placeholder="选择日期">
            </el-date-picker>
            <div class="myCalendar"></div>
          </div>
          <div class="endTime">
            <span class="timeText">截止时间</span>
            <el-date-picker v-model="endDay" type="date" :readonly="true" placeholder="选择日期">
            </el-date-picker>
            <div class="myCalendar"></div>
          </div>
        </div>
      </div>
      <div class="chart-main">
        <div class="chart-content" style="border: 1px solid #ccc" v-loading="loading"></div>
      </div>
    </div>
  </div>
</template>
<script>
import SingleChatData from '@/components/test/SingleChat.json'

import echarts from 'echarts'
import axios from 'axios'

import dealData_func from '@/util/get_month_data'
import set_chart_data from '@/util/set_chart_data'
import Config from '@/config/config'
import * as Util from '@/util/util'
import DataItem from '@/components/DataItem'

// 测试数据
// import ItemData from '@/components/test/itemData.json'

export default {
  computed: {
    chartTitle() {
      return Util.currentMsgMap.get(this.$route.path.slice(1))
    },
    dateMonthBlank() {
      // 根据endDay  和 numOfDaysData 两个数据进行改变
      // 月份的数组
      var result = [];
      // 截取10天的数据展示出来, Config.numOfDaysData 在当前文件夹下面的config文件中  (最大值是当前月的天数(28-29-30~31) )
      for (var i = 0; i < this.numOfDaysData; i++) {
        var currentDate = new Date(this.endDay - i * Util.ONE_DAY);
        result.push((currentDate.getMonth()) + 1 + '/' + currentDate.getDate())
      }
      return result.reverse();
    }
  },
  data() {
    return {
      loading: true,
      cardItems: [], // 显示data-item 项目的
      activeItemIndex: null, // 默认选中的title

      monthData: [], // 处理之后的月数据
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now() || time.getTime() <= Date.now() - 31 * 24 * 60 * 60 * 1000;
        }
      },
      // 默认是最近Config中配置的天数numOfDaysData的数据
      startDateData: new Date(new Date() - 3600 * 1000 * 24 * (this.$store.state.numOfDaysData-1)).getTime(),

      // 图表配置项
      myChart: {},

      series: [],

      // 查看多少天的数据
      numOfDaysData: this.$store.state.numOfDaysData,

      // 这里固定死  即把 时间选择器的后一个定死readonly
      endDay: Date.now(),
    }
  }, // end data
  watch: {
    // 监听起始时间的改变
    startDateData(newValue) {
      // console.log('时间改变', newValue)
      let numOfDaysData = parseInt((this.endDay - newValue) / Util.ONE_DAY) + 1;
      this.numOfDaysData = numOfDaysData;
      this.$store.commit('changeNumOfDaysData', {numOfDaysData})
      // console.log('时间改变numOfDaysData', numOfDaysData)
      console.log('watch--------change')
      this.$nextTick(() => {
        // 考虑dataMonthBlank numOfDaysData 上改变之后 进行操作
        this.refreshChat();
      })
    },
  },
  mounted() {
    // 获取网络数据后更改////
    // this.cardItems = ItemData;
    // this.activeItemIndex = 0;
    ////////////////////////

    var myChart = echarts.init(document.querySelector('.chart-content'));

    this.myChart = myChart;
    this._myinit(myChart)
    // console.log('00000000000000000000000000000000')
    // console.log(this.$store.state)
  },
  methods: {
    // 初始化
    _myinit(myChart) {
      // myChart.clear()
      set_chart_data(myChart, this.dateMonthBlank, [])

      // 用本地数据测试
      // this._dealData(SingleChatData);

      this.$nextTick(() => {
        // 从路由对象上传递过来的
        console.log('------------------%c-------------', 'background:rgb(0,255,0)')
        console.log(this.$route.query.url)
        var url = this.$route.query.url;
        this._getNetData(url)
      })
    },
    // 1. 获取网络数据
    _getNetData(url) {
      // 默认采取/screen/22 这里采用从路由对象上获取
      console.log('_getNetData -------------------')
      Util.getIds(url).then(ids => {
        let id = ids[0];
        axios.get('/chart/k', {
          params: {
            id,
            cf: '',
            start: -2592000,
            access_user: 'observer'
          }
        }).then(response => response.data).then(result => {
          console.log('%c singel-chat _getNetData original ------', 'background:rgb(255,255,0)')
          console.log(url)
          console.log(result)
          this._dealData(result)
        })
      }).catch(error => {
        console.log('Error=>', error.message)
      })
    },
    refreshChat() {
      // 考虑到时间上选择 以及activeItemIndex ----------------------------------
      let monthData = this.monthData;
      let activeItemIndex = this.activeItemIndex;

      let series = [];

      let labelName = monthData[activeItemIndex].lineName;
      let dataItemShow = monthData[activeItemIndex].data.slice(-this.numOfDaysData)

      series.push({
        name: Util.currentMsgMap.get(labelName) || labelName,
        // name:labelName,
        type: 'line',
        smooth: false,
        data: dataItemShow
      })
      // console.log('refresh chart: activeItemIndex', this.activeItemIndex)
      // console.log(series)
      // console.log(this.dateMonthBlank)
      set_chart_data(this.myChart, this.dateMonthBlank, series)
    },
    // 点击选项卡cardItem 改变样式和修改chart中的数据
    changeActiveItem(activeItemIndex) {
      // alert(index)
      this.activeItemIndex = activeItemIndex;
      // console.log('the click item show', itemIndex)
      this.$nextTick(() => {
        // 控制确实在 this.activeItemIndex 改变之后
        this.refreshChat()
      })
      /*
      // 找到选中的索引

      console.log('activeItemIndex', activeItemIndex)
      // 同时更改图表中的数据  showOneItem(item, index)
      // this._dealData();
      // 选中的是第几项的时候 需要修改
      // console.log(this.monthData)
      let serie = this.series[activeItemIndex];

      // serie 为 { data:[Number*31], lineName:String }
      console.log(serie);
      // 获取点击的索引  从series中获取数据  更改series中选中的数据 将其显示
      set_chart_data(this.myChart, this.dateMonthBlank, serie)
      */

    }, // end changeActiveItem
    _dealData(originalVal) {

      // originalVal = SingleChatData;

      // 展示cardItems
      // 四个图表的二维数组项
      var data = [];
      var series = [];

      // 开始时间往后数的时间戳
      // var endDay = new Date(originalVal.series[0].data[originalVal.series[0].data.length - 1][0]);
      // var startDateData =   处理后设置到this.startDateData 上
      // monthData 即表示进行过处理后的数据  在deal.js中进行处理
      // monthData:Array (length:30, 里面的数据类型是 {lineName: 'user.alive', data:[number*31]})

      var monthData = dealData_func(originalVal);
      console.log('original数据处理成五点钟30天数据monthData:   ')

      console.log(monthData)

      this.monthData = monthData;

      // 展示的选项卡 tab-cards
      let cardItems = [];

      for (let count = 0; count < monthData.length; count++) {
        let labelName = monthData[count].lineName;

        // labelNames[count] = Util.currentMsgMap.get(labelName) || labelName;

        let dataItemShow = monthData[count].data.slice(-this.numOfDaysData)
        // console.log('dataItemShow'+labelName, monthData[count].data)
        cardItems.push({
          title: Util.currentMsgMap.get(labelName) || labelName,
          data: monthData[count].data.slice(-2),
          yestTitle: '昨日',
          todTitle: '今日',
          isRise: false,
          rate: 0,
          isActive: false
        })

        series.push({
          name: Util.currentMsgMap.get(labelName) || labelName,
          // name:labelName,
          type: 'line',
          smooth: false,
          data: dataItemShow
        })
      }

      this.series = series;
      // 要求固定 所以不用更改
      // this.endDay = endDay;

      // 设置卡片以及选中项
      this.cardItems = cardItems;
      this.activeItemIndex = 0;
      // 所有的series数据都已经准备好了 开始装填数据
      this.loading = false;
      console.log('加载数据')
      console.log('this.dateMonthBlank', this.dateMonthBlank)
      console.log('series:', series)

      // 默认加载第一项
      set_chart_data(this.myChart, this.dateMonthBlank, series[0])
    },
  }, // end methods
  components: {
    DataItem
  }, // end components
}

</script>
<style scoped>


</style>
