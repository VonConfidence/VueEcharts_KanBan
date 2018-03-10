<template>
  <div class="map-chart" id="map-chart">
    <!-- <h2 class="map-title">地图数据</h2> -->
    <el-container>
      <el-main>
        <div class="chart-main">
          <div class="chart-content" style="border: 1px solid #ccc;" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(222, 222, 222, 0.5)"></div>
          <div class="not-in-map">
            <el-table :data="notInMapRes" border style="width: 100%;" :fit="true">
              <el-table-column prop="name" label="地区" width="180">
              </el-table-column>
              <el-table-column prop="value" label="值">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-main>
    </el-container>
    <!--     <div class="map-header">
      <h2>地图形式</h2>
    </div> -->
  </div>
</template>
<script>
import axios from 'axios'
import echarts from 'echarts'
import china from 'echarts/map/js/china'
import * as Util from '@/util/util'
import set_map_data from '@/util/set_map_data'

import Config from '@/config/config'

import cityData from '@/resources/cityData.json'

export default {
  data() {
    return {
      // 图表配置项
      color: this.$store.state.color,
      myChart: {},
      geoCoordMap: {},
      name: '散点图',
      loading: false,

      notInMapRes: []
    }
  }, // end data
  mounted() {
    // 获取城市地图数据
    this._getCityData()
  }, // end mounted
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null;
    }
  },
  methods: {
    _getCityData() {
      this.geoCoordMap = cityData
      this.$nextTick(() => {
        this._getMyChart()
      })
      // axios.get('static/data/cityData.json').then((res) => {
      //   this.geoCoordMap = res.data
      //   this.$nextTick(() => {
      //     this._getMyChart()
      //   })
      // })
    }, // end _getCityData
    _getMyChart() {

      // 测试数据  需要从网上获取
      // axios.get('static/data/mapData.json').then(res => {
      //   this._dealData(res.data);
      // })
      // chart/k?cf=AVERAGE1&graph_type=k&id=16163&start=-300&sum=off&sumonly=off
      var _this = this;
      _this.loading = true;
      function getData() {
        axios.get('/chart/k', {
          params: {
            id: 16163,
            start: -300,
            cf: 'AVERAGE',
            graph_type: 'k',
            sum: 'off',
            sumonly: 'off',
            "-": Math.random(),
            access_user: 'observer'
          }
        }).then(response => response.data).then(originalVal => {
          // console.log('map originalVal ------------------#######')
          // console.log(originalVal)
          // 处理数据
          _this.loading = false;
          _this._dealData(originalVal)
        }).catch(error => { alert(error.message) })
      }
      getData();
      this.timer = setInterval(function() {
        getData()
      }, Config.refreshMap)

      /*
      Util.getIds('/screen/10').then(idArray => idArray[0]).then(id => {
        // console.log(id, '--------------------------')
        axios.get('/chart/k', {
          params: {
            id: 16163,
            start: -300,
            cf: 'AVERAGE',
            graph_type: 'k',
            sum: 'off',
            sumonly: 'off',
            tongbi: ''
          }
        }).then(response => response.data).then(originalVal => {
          console.log('map data ------------------#######')
          console.log(originalVal)
          // 处理数据
          this._dealData(originalVal)
        }).catch(error => { console.log(error) })
      }) */
    }, // end _getMyChart
    convertData(data) {
      // data是testData.json中获取的数据  测试数据-真实数据
      let res = [];
      let notInMapRes = [];
      let l = data.length
      for (let i = 0; i < l; i++) {
        // l是测试数据数组的长度

        // 随机去一个整数值  即随机从其中取一个地址
        // let x = parseInt(Math.random() * l)

        // 获取地图中的一个中文名字的 geoCoord 是一个数组,  data[x].name表示地址
        let geoCoord = this.geoCoordMap[data[i].name]
        // let geoCoord = this.geoCoordMap[data[i].name];
        // 如果取出的地址数组存在的话
        if (geoCoord) {
          res.push({
            name: data[i].name,
            // Todo ----------
            // geoCoord是一个数组 数组的前两位是 [经度 纬度 随机值一个]
            // value: geoCoord.concat(Math.random() * 200)
            value: geoCoord.concat(data[i].value)
          });
          if (data[i].name != '中国') {
            notInMapRes.push(data[i])
          }
        }

      }
      console.log('notInMapRes convertData -->')
      console.log(notInMapRes) // 长度为4的数组 每一个对象里面包含name:string, value:Array[3](经度 纬度 数据值)
      notInMapRes.sort((item1, item2) => {
        return item2.value - item1.value
      })
      this.notInMapRes = notInMapRes
      return res;
    },
    _dealData(originalVal) {
      console.log('originalVal')
      console.log(originalVal)
      let originalSeries = originalVal.series;
      let series = [];
      originalSeries.forEach(function(item, index) {
        let counter = item.counter;
        if (counter.indexOf('/location.province=') > -1) {
          series.push({
            name: counter.split('/location.province=')[1], //地址名称
            // 值
            value: item.data[item.data.length - 1][1] ? item.data[item.data.length - 1][1] : 0
          })
        }
      }); // 此时数据已经处理完毕

      let options = {
        // backgroundColor: '#404a59',
        title: {
          show: false // 不显示标题组件
        },
        // 提示框组件
        tooltip: {
          // item: 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
          // axis: 坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
          trigger: 'item',
          // 散点图（气泡）图 : {a}（系列名称），{b}（数据名称），{c}（数值数组）, {d}（无）
          // (params: Object|Array, ticket: string, callback: (ticket: string, html: string)) => string
          /* // params 对象
          {
                componentType: 'series',
                // 系列类型
                seriesType: string,
                // 系列在传入的 option.series 中的 index
                seriesIndex: number,
                // 系列名称
                seriesName: string,
                // 数据名，类目名
                name: string,
                // 数据在传入的 data 数组中的 index
                dataIndex: number,
                // 传入的原始数据项
                data: Object,
                // 传入的数据值
                value: number|Array,
                // 数据图形的颜色
                color: string,

                // 饼图的百分比
                percent: number,

                //
                galleryViewPath: ,

                //
                galleryEditorPath: ,

                //
                imagePath: ,

                //
                gl: ,

            }
           */
          formatter: function(params) {
            // params.name 表示地址
            // params.value 是一个数组  第一二位位经纬度 第三位为地址名称 (上海 北京)
            // console.log(params.name + ' ==:== ' + params.value[2])
            return params.name + ' : ' + params.value[2];
          }
        },
        legend: {
          show: false
        },
        visualMap: {
          type: 'piecewise',
          min: 0,
          max: 600,
          bottom: 20, // bottom 的值可以是像 20 这样的具体像素值，可以是像 '20%' 这样相对于容器高宽的百分比。
          splitNumber: 6,
          /*对于连续型数据，自动平均切分成几段。默认为5段。 连续数据的范围需要 max 和 min 来指定。*/
          // show:false, // 是否显示左侧的控件图标

          // text:['High','Low'],
          // realtime: false,
          // calculable : true,
          // color: ['#FF99FF','#FF9999','#CCCCFF', '#CCCC33', '#99CCFF', '#99CC66', '#66CCFF', '#66CC33', '#0099FF'],
          inRange: {
            // color: ['#255B78', '#2A7484', '#2F9696', '#3BBCB0', '#51D4EB']
            color: ['#d94e5d', '#eac736', '#50a3ba'],
            // color: ['#FF99FF', '#FF9999', '#CCCCFF', '#CCCC33', '#99CCFF', '#99CC66', '#66CCFF', '#66CC33', '#0099FF'],
          },
          textStyle: {
            color: 'gray'
          }
        },
        geo: {
          map: 'china',
          label: {
            emphasis: {
              show: false
            }
          },
          zoom: 1,
          top: 50,
          itemStyle: {
            normal: {
              color: '#3c4247',
              opacity: 0.8,
              borderColor: 'rgba(255, 255, 255, 0.35)'
            },
            emphasis: {
              color: '#2a333d'
            }
          }
        },
        series: [{
          name: '实时信息',
          type: 'scatter',
          coordinateSystem: 'geo',
          // 这里的val指的是 下面配置的data数组中的每一项
          symbolSize: function(val) {
            // if (val[2] > 300) {
            //   return val[2] / 30;
            // } else if (val[2] > 200) {
            //   return val[2] / 20;
            // } else if (val[2] > 100) {
            //   return val[2] / 10;
            // } else if (val[2] > 10) {
            //   return val[2] / 5;
            // }
            var symSize = Math.log(val[2]) ** 2;
            if (symSize < 4) {
              return 4;
            }
            return symSize;
            // return 8;
          },
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            emphasis: {
              borderColor: '#fff',
              borderWidth: 1
            }
          },
          data: this.convertData(series)
        }]
      }
      // console.log('-------------')
      console.log(series)
      console.log(this.convertData(series))
      // this._myinit(options)
      this.myChart = echarts.init(document.querySelector('.map-chart .chart-content'))
      this.myChart.clear()
      this.myChart.setOption(options)

      // set_map_data(this.myChart, series)
    }, // end _dealData
  }, // end methods
  computed: {

  }, // end computed

  components: {

  }, // end components
}

</script>
<style>
.map-title {
  padding-top: 10px;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  background: rgb(233, 238, 243);
  color: black;
}

#map-chart .chart-main {
  overflow: hidden;
}

#map-chart .chart-content {
  min-height: 950px;
  display: inline-block;
  width: 80%;
  float: left;
}

#map-chart .chart-main .not-in-map {
  text-align: left;
  float: left;
  margin-top: 10px;
  margin-left: 10px;
  background: rgb(118, 126, 134);
}

#map-chart .el-table__body td{
  padding: 3px 0;
}

.el-header,
.el-footer {
  background-color: rgb(118, 126, 134);
  color: white;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  /*line-height: 160px;*/
  padding-top: 0;
}

body>.el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

</style>
