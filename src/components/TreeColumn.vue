<template>
  <div class="chart-main">
    <div class="chart-content" style="border: 1px solid #ccc"></div>
  </div>
  </div>
  </div>
</template>
<script>
// import diskData from '@/components/test/DiskData.json'
import treeData from '@/components/test/TreeData.json'
import echarts from 'echarts'
import axios from 'axios'

export default {
  props: {

  },
  computed: {

  },

  data() {
    return {
      myChart: {}
    }
  }, // end data
  methods: {
    dealWithTreeData(treeData) {
      console.log('treeData')
      console.log(treeData)
      var first = treeData.first;
      var second = treeData.second;
      var third = treeData.third;

      var diskData = [];
      for (var key1 in first) {
        // first中的每一个对象
        var itemFirst = first[key1][0];
        var firstParentObj = {
          "value": itemFirst.endperioddebittotal,
          "name": itemFirst.accountcaptionname,
          "path": itemFirst.accountcaptionname,
          "children": []
        };
        for (var key2 in second) {
          // 表示second中的当前对象 属于一级对象中的该分类下面的子类
          if (key2.toString().indexOf(key1.toString()) >= 0) {
            var itemSecond = second[key2][0];
            var secondParentObj = {
              "value": itemSecond.endperioddebittotal,
              "name": itemSecond.accountcaptionname,
              "path": itemFirst.accountcaptionname + '/' + itemSecond.accountcaptionname,
              "children": []
            };
            for (var key3 in third) {
              if (key3.toString().indexOf(key2.toString()) >= 0) {
                var itemThird = third[key3][0];
                var thirdParentObj = {
                  "value": itemThird.endperioddebittotal,
                  "name": itemThird.accountcaptionname,
                  "path": itemFirst.accountcaptionname + '/' + itemSecond.accountcaptionname + '/' + itemThird.accountcaptionname,
                  "children": []
                };
                secondParentObj.children.push(thirdParentObj)
              } // end key3-if
            }
            firstParentObj.children.push(secondParentObj)
          } // end key2-if
        }

        diskData.push(firstParentObj)
      }
      console.log('diskData---------------')
      console.log(diskData)
      // console.log(JSON.stringify(diskData))
      return diskData;

    } // end dealData
  },
  mounted() {
    // console.log(treeData)
    var diskData = this.dealWithTreeData(treeData)
    this.myChart = echarts.init(document.querySelector('.chart-main .chart-content'));

    function colorMappingChange(value) {
      var levelOption = getLevelOption(value);
      this.chart.setOption({
        series: [{
          levels: levelOption
        }]
      });
    }

    var formatUtil = echarts.format;

    function getLevelOption() {
      return [{
          itemStyle: {
            normal: {
              borderWidth: 0,
              gapWidth: 5
            }
          }
        },
        {
          itemStyle: {
            normal: {
              gapWidth: 1
            }
          }
        },
        {
          colorSaturation: [0.35, 0.5],
          itemStyle: {
            normal: {
              gapWidth: 1,
              borderColorSaturation: 0.6
            }
          }
        }
      ];
    }

    this.myChart.setOption({

      title: {
        text: 'Disk Usage',
        left: 'center'
      },

      tooltip: {
        formatter: function(info) {
          var value = info.value;
          var treePathInfo = info.treePathInfo;
          var treePath = [];

          for (var i = 1; i < treePathInfo.length; i++) {
            treePath.push(treePathInfo[i].name);
          }

          return [
            '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
            'Disk Usage: ' + formatUtil.addCommas(value),
          ].join('');
        }
      },

      series: [{
        name: 'Disk Usage',
        type: 'treemap',
        visibleMin: 300,
        label: {
          show: true,
          formatter: '{b}'
        },
        itemStyle: {
          normal: {
            borderColor: '#fff'
          }
        },
        levels: getLevelOption(),
        data: diskData
      }]
    });

  },
  components: {}, // end components
}

</script>
<style scoped>
.chart-content {
  width: 100%;
  height: 600px;
  margin: 20px auto;
}

</style>
