<template>
  <div class="average-page">
    <header class="header-title">折线图: 平均消息</header>
    <div class="item-container" v-loading="loading">
      <data-item :data="item" v-for="(item,index) in items" :key="item.title" :isActiveItem="item.title == activeItemTitle" @changeActiveItem="changeActiveItem(item.title)">
      </data-item>
    </div>
    <div class="chart-container">
      <div class="chart-header">
        <span>应用用户同时在线峰值</span>
        <div class="chart-date-picker">
          <span class="demonstration">请选择日期:  </span>
          <el-date-picker v-model="selectedDateRange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :editable="false" :clearable="false">
          </el-date-picker>
        </div>
      </div>
      <div class="chart-main">
        <div class="chart-content" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(222, 222, 222, 0.5)"></div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
// 测试数据
// import TestData from '@/resources/lineDataMonth.json'
// import ItemData from '@/components/test/itemData.json'

import dealData_func from '@/util/get_month_data'
import set_chart_data from '@/util/set_chart_data'

import DataItem from '@/components/AveragePages/AverageItem'

import Config from '@/config/config'
import * as Util from '@/util/util'

import axios from 'axios'

export default {
  data() {
    return {
      // 加载中状态
      loading: true,
      // 选项卡
      items: [],
      // 默认选中的title  控制样式
      activeItemTitle: null, // 默认选中
      // 一个月的数据 处理后的  用来剪切
      monthData: [],
      //datePicker 配置项
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now() || time.getTime() <= Date.now() - 31 * 24 * 60 * 60 * 1000;
        }
      },
      // 默认是最近Config中配置的天数numOfDaysData的数据
      selectedDateRange: [new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * (Config.numOfDaysData - 1))), new Date()],

      // 图表配置项
      myChart: {},

      // 图标上显示
      series: [],

      // 显示多少天的数据
      numOfDaysData: Config.numOfDaysData,

      // 日期的结束时间  会根据选择时间修改  默认当前
      endDay: Date.now(),

    }
  }, // end data
  components: {
    DataItem
  }, // end components
  watch: {
    // 用户选择的时间发生改变的时候
    selectedDateRange(newValue, oldValue) {
      let now = new Date()
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let endCount = parseInt((today - newValue[1]) / Util.ONE_DAY)
      let startCount = parseInt((today - newValue[0]) / Util.ONE_DAY)

      console.log('count------', startCount, endCount)

      let monthData = this.monthData

      let series = [];

      // 实际上这里没有用到 数据项目的差距太多 不用全部显示
      // if (!this.activeItemTitle) {
      //   // 表示是在没有选中单个的标识符下 点击日期选项  即全部显示
      //   console.log('显示所有的数据--------------')
      //   this.endDay = newValue[1];
      //   this.numOfDaysData = startCount - endCount + 1;

      //   for (let count = 0; count < monthData.length; count++) {
      //     let labelName = monthData[count].lineName;
      //     let dataItemShow;
      //     if (endCount == 0) {
      //       dataItemShow = monthData[count].data.slice(-startCount - 1)
      //     } else {
      //       dataItemShow = monthData[count].data.slice(-startCount - 1, -endCount);
      //     }
      //     series.push({
      //       name: Util.msgReflect.get(labelName) || labelName,
      //       // name:labelName,
      //       type: 'line',
      //       smooth: false,
      //       data: dataItemShow
      //     })
      //   }

      //   this.series = series;
      //   // console.log(series)
      //   set_chart_data(this.myChart, this.dateMonthBlank, series)
      //   return ;
      // }

      // 选中单根线条的情况下实现
      // alert('单线条情况下的时间选择')
      this.endDay = newValue[1];
      this.numOfDaysData = startCount - endCount + 1;

      let activeItemIndex = this.items.findIndex(itm => itm.title == this.activeItemTitle)
      console.log('this.series: in singeLine ', this.series[activeItemIndex])
      // this.showOneItem(this.series[activeItemIndex])
      let labelName = monthData[activeItemIndex].lineName;
      let dataItemShow;
      if (endCount == 0) {
        dataItemShow = monthData[activeItemIndex].data.slice(-startCount - 1)
      } else {
        dataItemShow = monthData[activeItemIndex].data.slice(-startCount - 1, -endCount);
      }
      series.push({
        name: Util.msgReflect.get(labelName) || labelName,
        type: 'line',
        smooth: false,
        data: dataItemShow
      })
      this.series = series;
      // console.log('this.dateMonthBlank, series')
      // console.log(this.dateMonthBlank, series)
      set_chart_data(this.myChart, this.dateMonthBlank, series)

    }, // end selectedDateRange

  },
  computed: {
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
  }, // end computed
  methods: {
    _getNetData() {
      Util.getIds('/screen/12').then(ids => {
        let id = ids[0];
        axios.get('/chart/k', {
          params: {
            id,
            cf: '',
            start: -2592000,
            access_user: 'observer'
          }
        }).then(response => response.data).then(result => {
          console.log('%c HomePage _getNetData------', 'background:rgb(255,255,0)')
          console.log(result)
          this._dealData(result)
        })
      }).catch(error => {
        console.log('Error=>', error.message)
      })
    },
    // 点击的时候 更改选中的card
    changeActiveItem(itemTitle) {
      // alert(index)
      this.activeItemTitle = itemTitle;
      console.log('the click item show', itemTitle)

      let activeItemIndex = this.items.findIndex(itm => itm.title == itemTitle)
      console.log('activeItemIndex', activeItemIndex)
      // 同时更改图表中的数据  showOneItem(item, index)
      // this._dealData();
      // 选中的是第几项的时候 需要修改
      // console.log(this.monthData)
      let serie = this.monthData[activeItemIndex];
      // this.series = [serie];
      console.log('选中的数据项', this.series[activeItemIndex])
      console.log(serie)
      let series = [];
      // console.log(this.selectedDateRange)
      let now = new Date()
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      let endCount = parseInt((today - this.selectedDateRange[1]) / Util.ONE_DAY)
      let startCount = parseInt((today - this.selectedDateRange[0]) / Util.ONE_DAY)
      // console.log('=------------', startCount, endCount)
      series.push({
        name: Util.msgReflect.get(serie.lineName) || serie.lineName,
        // name:labelName,
        type: 'line',
        smooth: false,
        data: endCount == 0 ? serie.data.slice(-startCount - 1) : serie.data.slice(-startCount - 1, -endCount)
      })
      this.series = series;
      this.showOneItem(this.series[0])
    },

    // 数据表象数据修改
    showOneItem(item) {
      //alert(item.name)
      console.log('the click one item show: ', item)
      this.myChart.clear()
      // item 是series中的一个对象
      set_chart_data(this.myChart, this.dateMonthBlank, [item])
    },
    _dealData(originalVal) {
      // this._getNetData()
      //  利用测试数据 //////////////////
      // originalVal = TestData
      /////////////////////////

      console.log('OriginalNetValues ', originalVal);
      // originalVal 即表示就是需要传递  进行处理的数据

      // 开始时间往后数的时间戳
      var endDay = new Date(originalVal.series[0].data[originalVal.series[0].data.length - 1][0]);
      console.log('endDay', endDay)

      // this.$nextTick(() => {
      //   console.log(this.dateMonthBlank)
      // })

      // 四个图表的二维数组项
      var data = [];
      var series = [];
      // 标签名城项
      var labelNames = [];

      // monthData 即表示进行过处理后的数据  在deal.js中进行处理
      // monthData:Array (length:30, 里面的数据类型是 {lineName: 'user.alive', data:[number*31]})
      var monthData = dealData_func(originalVal);
      console.log('monthData:   ', monthData)
      this.monthData = monthData;
      let items = [];
      for (let count = 0; count < monthData.length; count++) {
        let labelName = monthData[count].lineName;

        labelNames[count] = Util.msgReflect.get(labelName) || labelName;

        let dataItemShow = monthData[count].data.slice(-this.numOfDaysData)
        // console.log('dataItemShow'+labelName, monthData[count].data)
        items.push({
          title: Util.msgReflect.get(labelName) || labelName,
          data: monthData[count].data[monthData[count].data.length - 1],
          dateTitle: '昨日',
          isRise: false,
          rate: 0,
          isActive: false
        })

        series.push({
          name: Util.msgReflect.get(labelName) || labelName,
          // name:labelName,
          type: 'line',
          smooth: false,
          data: dataItemShow
        })
      }

      this.series = series;

      this.endDay = endDay;

      this.items = items;
      // 默认第一项选中
      this.activeItemTitle = items[0].title;

      // 所有的series数据都已经准备好了 开始装填数据
      console.log('series:', series)
      // console.log('labelNames:', labelNames)
      this.loading = false;
      // 默认显示 第一个项目
      set_chart_data(this.myChart, this.dateMonthBlank, series[0])
    },

    _myinit(myChart) {
      // 初始化的时候 渲染空数据模板
      // console.log('init___',this.dateMonthBlank)
      set_chart_data(myChart, this.dateMonthBlank, [])

      // 加载所有的数据 显示在 chart上
      this._getNetData()

      // 直接调用 表示使用本地测试数据 网络不好情况下测试
      // this._dealData({})
    }
  },
  mounted() {
    // this.items = ItemData;

    var myChart = echarts.init(document.querySelector('.chart-content'));
    this.myChart = myChart;
    // this.__loadChartData(this.myChart,this.dateBlank, this.series)
    this._myinit(myChart)
  }
}

</script>
<style scoped>
.header-title {
  text-align: left;
  font-weight: bold;
  font-size: 25px;
}

.item-container {
  margin-top: 10px;
  min-height: 300px;
  text-align: left;
}

</style>
