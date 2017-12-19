// var data = require('./dailyData')
const numFixed = 2;
function getFive(timestamps) {
  var today = new Date(timestamps)
  var five = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  five.setHours(5)
  return five.getTime();
}

// 一天的时间戳
const oneDay = 24 * 60 * 60 * 1000;

function getMaxOfArray(array) {
  return Math.max.apply(null, array)
}

// 处理一条线的数据 即 var seriesItem = data.series[index];
function dealAllItem(seriesItem) {

  // 表示的一条线的数据
  // var seriesItem = data.series[0];

  // 获取数据的第一项的时间戳
  var firstTime = seriesItem.data[0][0]

  // 获取起始点早上五点钟的时间戳
  var fiveTimestamps = getFive(firstTime);

  // 给定的时间是20:00 则 所需要的数据是  20:00 - 05:00 中的 数据的最大的那一个
  // 第一天的时间起点索引
  var startIndex = 0;
  // 从这个索引开始 因为三个小时一个间隔 可以直接取8个点(24小时)  取其中最大值

  if (firstTime >= fiveTimestamps) { // 当前时间是 08:00 那么起始索引就是第一个时间戳的下一天的05:00
    var nextDayFive = getFive(firstTime + oneDay); // 下一天五点钟的时间戳
    startIndex = seriesItem.data.findIndex(item => item[0] == nextDayFive)
    // console.log('Choose: nextDay Five')
  } else { // 如果当前的时间是 04:00 那么寻找到05:00时间戳的那个索引 就是Index1
    startIndex = seriesItem.data.findIndex(item => item[0] == fiveTimestamps)
    // console.log('Choose: Today Five')
  }

  // -------- 存储30天中的每天数据最大值  最终结果---------------------
  const thirtyData = [];
  // --------------------------
  // 上面可以保证startIndx > 0
  // console.log('the startIndex : ', startIndex)

  // 第一个数据不是平均的8项   去data(0~startIndex) 的最大值
  // 截取data的前startIndex项  然后把其中的数据获取出来
  var res_data1 = getMaxOfArray(seriesItem.data.slice(0, startIndex + 1).map(item => item[1] ? item[1] : 0))
  // console.log('Today Data: ' + Object.prototype.toString.call(res_data1).slice(-8, -1))
  thirtyData.push(res_data1.toFixed(numFixed))

  // 从第二个数据开始到最后可以保证平均
  // 3个小时一个点, 8个点里面肯定有第二天的时间  所以这里取8
  for (let i = startIndex + 1; i < seriesItem.data.length; i += 8) {
    // slice的 end如果大于data.length  则会end=data.length
    let aDayArr = seriesItem.data.slice(i, i + 8).map(item => item[1] ? item[1] : 0)
    let maxValue = getMaxOfArray(aDayArr);
    // console.log('Today Data: ' + Object.prototype.toString.call(maxValue).slice(-8, -1))
    thirtyData.push(maxValue.toFixed(numFixed));
    // console.log(i)
  }
  // console.log('该条serieItem的一个月的数据')
  // console.log(thirtyData)
  return thirtyData;
}


/*
 A Serie Item Test  测试一条线的数据

 dealAllItem(data.series[0])
 */


// 处理的逻辑循环 === 需要暴露出去的接口
// 循环处理data.seres.length的数据  即多条线的数据
function getResult(data) {
  // console.log(data.series.length)
  let resultArr = [];
  // data.series 表示多根线的数据
  for (let i = 0; i < data.series.length; i++) {
    let seriesItem = data.series[i];
    resultArr.push({
      lineName: seriesItem.name,
      data: dealAllItem(seriesItem)
    })
  }
  return resultArr;
}

// module.exports = getResult

// getResult 传递的数据  就是网络上的原始数据
// 取每天五点钟的数据
// 取的是一个月的数据
export default getResult
