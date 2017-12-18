<template>
  <div class="line-test">
    <!-- 加载图表的区域 不宜在charts里面写入数据-->
    <div class="charts"></div>
    <button @click='buttonClicked'>加载数据</button>
    <div>
      <button v-for="(item, index) in series" @click="showOneItem(item, index)">{{item.name}}</button>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts';

import TestData from '@/resources/lineDataMonth.json'
import dealData_func from '@/util/get_month_data'
import set_chart_data from '@/util/set_chart_data'

import * as Util from '@/util/util'
import Config from '@/config/config'

import NavHeader from '@/components/NavHeader'

function change_chart_data(myChart, dateMonthBlank, series) {
  console.log(series)
  myChart.setOption({
    xAxis: {
      data: dateMonthBlank
    },
    series: []
  });
}

export default {
  data() {
    return {
      myChart: {},

      series: [],
      numOfDaysData: Config.numOfDaysData,

      endDay: Date.now(),
    }
  }, // end data
  computed: {
    dateMonthBlank() {
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
  methods: {
    showOneItem(item, index) {
      //alert(item.name)
      console.log('the click item show: ', item)
      this.myChart.clear()
      set_chart_data(this.myChart, this.dateMonthBlank, [item])
    },
    _dealData(originalVal) {
      //  利用测试数据
      originalVal = TestData
      console.log('OriginalNetValues ', originalVal);
      // originalVal 即表示就是需要传递  进行处理的数据

      // 开始时间往后数的时间戳
      var endDay = new Date(originalVal.series[0].data[originalVal.series[0].data.length - 1][0]);
      console.log('endDay', endDay)

      console.log(this.dateMonthBlank)

      // 四个图表的二维数组项
      var data = [];
      var series = [];
      // 标签名城项
      var labelNames = [];

      // monthData 即表示进行过处理后的数据  在deal.js中进行处理
      // monthData:Array (length:30, 里面的数据类型是 {lineName: 'user.alive', data:[number*31]})
      var monthData = dealData_func(originalVal);
      console.log('monthData:   ', monthData)
      for (let count = 0; count < monthData.length; count++) {
        let labelName = monthData[count].lineName;
        labelNames[count] = Util.msgReflect.get(labelName) || labelName;

        let dataItemShow = monthData[count].data.slice(-this.numOfDaysData)

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

      // 所有的series数据都已经准备好了 开始装填数据
      // this._loadChartData();
      console.log('series:', series)
      set_chart_data(this.myChart, this.dateMonthBlank, series)
    },
    _loadChartData() {
      this.myChart.setOption({
        title: {
          text: '月活消息',
          show: false
        },
        legend: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: function(params) {
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              relVal += '<br/>' + params[i].seriesName + ' : ' + Math.floor(params[i].value);
            }
            return relVal;
          },
          textStyle: {}
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          nameTextStyle: {
            color: 'rgba(255, 255, 255, 0.69)'
          },
          axisLabel: {
            textStyle: {
              color: 'white'
            }
          },
          data: this.dateMonthBlank
        },
        yAxis: [{
          axisLine: {
            show: false
          },
          nameLocation: 'end',
          nameGap: 20,
          nameRotate: 0,
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: ['rgba(230, 230, 230, 0.2)']
            }
          },
          axisLabel: {
            textStyle: {
              color: 'white',
              fontSize: 14
            }
          },
          name: '',
          type: 'value',
          nameTextStyle: {
            color: 'rgba(255, 255, 255, 0.69)'
          }
        }],
        series: this.series
      });
    }, // end loadChartData
    buttonClicked() {
      this._dealData();
    },

    _myinit(myChart) {
      // 初始化的时候 渲染空数据模板
      set_chart_data(myChart, this.dateMonthBlank, [])
    }
  }, // end methods
  components: {

  }, // end components
  mounted() {
    // this._dealData();
    var myChart = echarts.init(document.querySelector('.charts'));
    this.myChart = myChart;
    // this.__loadChartData(this.myChart,this.dateBlank, this.series)
    this._myinit(myChart)
  }, // end mounted
  components: {
    NavHeader
  }
}

</script>
<style scopred>
.line-test {
  background: #666;
}

.charts {
  /*margin: 0 auto;*/
  margin-left: 40px;
  margin-top: 40px;
  height: 400px;
  width: 1000px;
  background: dodgerblue;
}

</style>
