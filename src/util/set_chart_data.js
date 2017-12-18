 function __loadChartData(myChart, dateMonthBlank, series) {
   // console.log('set_chart_data-----------')
   // console.log(myChart)
   // console.log(dateMonthBlank)
   // console.log(series)

   // 展示单个数据表项的情况
   if (Object.prototype.toString.call(series).slice(8, -1) !== 'Array' && typeof series === 'object') {
     series = [series];
   }
   var title = series.length == 1 ? series[0].name : ''
   /**
    * series? Array[Object*]
    *     {data:[], name:'线条名称', smooth:false, type: 'line'}
    */
   // 绘制图表
   myChart.setOption({
     title: {
       text: '折线图: ' + title,
       show: true,
       textStyle: {
         color: 'white'
       }
     },
     legend: {},
     tooltip: {
       trigger: 'axis',
       axisPointer: {
         type: 'cross'
       },
       textStyle: {}
     },
     xAxis: {
       type: 'category',
       boundaryGap: false,
       axisLine: {
         show: true
       },
       axisTick: {
         show: false
       },
       nameTextStyle: {
         color: 'rgba(255, 255, 255, 0.69)'
       },
       axisLabel: {
         textStyle: {
           color: 'black'
         }
       },
       data: dateMonthBlank
     },
     yAxis: [{
       axisLine: {
         show: true
       },
       nameLocation: 'end',
       nameGap: 20,
       nameRotate: 0,
       axisTick: {
         show: false
       },
       splitLine: {
         lineStyle: {
           color: ['rgba(188, 188, 188, 0.5)']
         }
       },
       axisLabel: {
         textStyle: {
           color: 'black',
           fontSize: 14
         },
         formatter: function(value, index) {
           if (!value) { return '' }
           if (value > 10000000) { return (value / 10000000).toFixed(2) + "(千万)" }
           if (value > 10000) { return (value / 10000).toFixed(2) + "(万)" }
           if (value > 1000) { return (value / 1000).toFixed(2) + "(千)" }
           return value.toFixed(2)
         }
       },
       name: '值',
       type: 'value',
       nameTextStyle: {
         color: 'rgba(255, 255, 255, 0.69)'
       }
     }],
     series: series
   });
 }

 export default __loadChartData
