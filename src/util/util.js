import axios from 'axios'
var cheerio = require('cheerio')

const DATE_HOURS = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

function getLineId(url) {
  return new Promise((resolve, reject) => {
    axios.get('/screen/12', {
        params: {
          access_user: 'observer'
        }
      })
      .then(function(response) {
        // console.log(response);
        const $ = cheerio.load(response.data);
        // <div class="panel panel-default chart-container" data-u="/chart/k?id=4869&amp;start=-86400&amp;cf=">
        // console.log($('div.panel.panel-default.chart-container')[0].attribs['data-u'])
        const dataU = $('div.panel.panel-default.chart-container')[0].attribs['data-u'];
        // alert(dataU) //   /chart/k?id= 4869&start=-86400&cf=
        const id = dataU.split('id=')[1].split('&')[0];
        // alert('id='+id)
        resolve(id);
      })
      .catch(function(error) {
        console.log(error)
        reject(error);
        // console.log(error);
      });
  })
}

function getColumnIds() {
  return new Promise((resolve, reject) => {
    axios.get('/screen/11', {
        params: {
          access_user: 'observer'
        }
      })
      .then(response => {
        const $ = cheerio.load(response.data);
        const dataU = $('div.panel.panel-default.chart-container')[0].attribs['data-u'];
        var divs = $('div.panel.panel-default.chart-container');
        const dataIds = [];
        for (let i = 0; i < divs.length; i++) {
          let dataU = divs[i].attribs['data-u'];
          let id = dataU.split('id=')[1].split('&')[0];
          dataIds.push(id)
        }
        // console.log(dataIds)
        resolve(dataIds)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
  })
}

function getDailyIds() {
  return new Promise((resolve, reject) => {
    axios.get('/screen/13', {
        params: {
          access_user: 'observer'
        }
      })
      .then(response => {
        const $ = cheerio.load(response.data);
        const dataU = $('div.panel.panel-default.chart-container')[0].attribs['data-u'];
        var divs = $('div.panel.panel-default.chart-container');
        const dataIds = [];
        for (let i = 0; i < divs.length; i++) {
          let dataU = divs[i].attribs['data-u'];
          let id = dataU.split('id=')[1].split('&')[0];
          dataIds.push(id)
        }
        // console.log(dataIds)
        resolve(dataIds)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
  })
}

// 返回当天五点钟的时间戳  如果没有传递参数表示获取当天五点钟的时间戳
function getFive(date = Date.now()) {
  var today = new Date(date)
  // fvie 表示的是当前五点钟的时间
  var five = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  five.setHours(5)
  return five.getTime();
}

const msgReflect = new Map([
  ['user.login/type=tcp', '登录'],

  ['user.recive', '接收'],
  ['user.recive/type=discuz', '讨论组接收'],
  ['user.recive/type=group', '群聊接收'],
  ['user.recive/type=private', '私聊接收'],

  ['user.send', '发送'],
  ['user.send/type=discuz', '讨论组发送'],
  ['user.send/type=group', '群聊发送'],
  ['user.send/type=private', '私聊发送'],

  ['user.syncchat', '同步(老)'],
  ['user.syncchatmsg', '同步消息'],
  ['user.syncchatv2', '同步'],

  ['user.alive', '日活'],
  ['user.api.home', '首页日活'],

  ['mean.msg.recive/type=private', '私聊接收'],
  ['mean.msg.send/type=discuz', '讨论组发送'],
  ['mean.msg.send/type=group', '群聊发送'],
  ['mean.msg.send/type=private', '私聊发送'],

])

const currentMsgMap = new Map(
  [
    ['mean.msg.send/type=private', '单聊人均上行消息数'],
    ['msg.send/type=private', '单聊上行消息数'],
    ['mean.msg.recive/type=private', '单聊人均下行消息数'],
    ['msg.recive/type=private', '单聊下行消息数'],
    ['msg.distribute/type=private', '单聊分发消息数'],
    ['msg.push/type=private', '单聊Push消息数'],

    ['msg.send/type=group', '群聊上行消息数'],
    ['mean.msg.send/type=group', '群聊平均上行消息数'],
    ['msg.distribute/type=group', '群聊分发消息数'],
    ['msg.recive/type=group', '群聊下行消息数'],
    ['mean.msg.recive/type=group', '群聊人均下行消息数'],
    ['msg.push/type=group', '群聊 Push 消息数'],

    ['msg.send/type=discuz', '讨论组上行消息数'],
    ['mean.msg.send/type=discuz', '讨论组平均上行消息数'],
    ['msg.distribute/type=discuz', '讨论组分发消息数'],
    ['msg.recive/type=discuz', '讨论组下行消息数'],
    ['mean.msg.recive/type=discuz', '讨论组人均下行消息数'],
    ['msg.push/type=discuz', '讨论组 Push 消息数']

  ]
)
const ONE_DAY = 24 * 60 * 60 * 1000

/**
 * [getIds description] 获取网页中的id项
 * @param  {String} url             [description]
 * @param  {Number} start_timestamp [description] 开始的时间戳 -259200 = (30 * 24 * 60 * 60) 一个月的秒数
 *                                  1h = - 60 * 60 = -3600   3h = -10800    6h = -21600  12h = 43200  1d = -96400
 *                                  3d = -259200    7d=-604800   1m = -259200
 * @return {[type]}                 [description] 返回数组 包含id的字符创
 */
function getIds(url, start_timestamp = -259200) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
        params: {
          access_user: 'observer',
          // start: start_timestamp
        }
      })
      .then(response => {
        const $ = cheerio.load(response.data);
        const dataU = $('div.panel.panel-default.chart-container')[0].attribs['data-u'];
        var divs = $('div.panel.panel-default.chart-container');
        const dataIds = [];
        for (let i = 0; i < divs.length; i++) {
          let dataU = divs[i].attribs['data-u'];
          let id = dataU.split('id=')[1].split('&')[0];
          dataIds.push(id)
        }
        // console.log(dataIds)
        resolve(dataIds)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
  })
}

function getIdPromise(url) {
  return axios.get(url, {
    params: {
      access_user: 'observer'
    }
  }).then(response => response.data).catch(error => { console.log(error) })
}


export {
  DATE_HOURS,
  getLineId,
  getColumnIds,
  getDailyIds,
  msgReflect,
  currentMsgMap,
  getFive,
  ONE_DAY,
  getIds,
}
