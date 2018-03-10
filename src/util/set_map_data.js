// 设置地图形式数据
function _loadChatData(myChart, resData, callback) {

  let series = [{
    name: '标签1',
    type: 'scatter',
    coordinateSystem: 'geo',
    // 这里的val指的是 下面配置的data数组中的每一项
    symbolSize: function(val) {
      return val[2] / 6;
    },
    label: {
      normal: {
        show: false
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
    data: resData
  }];

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
      min: 0,
      max: 200,
      bottom: 50,
      splitNumber: 5,
      inRange: {
        color: ['#255B78', '#2A7484', '#2F9696', '#3BBCB0', '#51D4EB']
      },
      textStyle: {
        color: '#fff'
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
          opacity: 0.6,
          borderColor: 'rgba(255, 255, 255, 0.35)'
        },
        emphasis: {
          color: '#2a333d'
        }
      }
    },
    series: series
  }
  // _myinit(options)
  console.log('resData --->')
  console.log(resData)
  myChart.setOption(options)
  callback && callback();
}

export default _loadChatData
