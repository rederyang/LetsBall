// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {

  var result = {}
  result.errMsg = ""
  var data = {}
  result.data = data
  /** 传递必要的参数 start */

  if (event.openId == undefined) {

    result.errMsg = '未传必要参数，请重试'
    result.errCode = 1
    return result

  }

  // 实例化数据库连接
  const db = cloud.database()
  const _ = db.command
  var registeredTasks
  try {
    await db.collection('User')
      .where({
        openId: event.openId
      })
      .get()
      .then(res => {
        all_data = res.data
        query = res.data[0]
        console.log(all_data)
        console.log(query)
      })
    if (all_data.length > 1) {
      result.errCode = 3
      result.errMsg = '查询得到的用户数大于1！查一下错误'
    }
    if (query == undefined) {
      result.errCode = 2
      result.errMsg = "未查到该用户信息"
    } else {
      registeredTasks = query.registeredTasks
    }
  } catch (e) {
    result.errCode = 10086
    result.errMsg = e

  }
  if (registeredTasks == undefined) {
    return result
  } else {
    console.log('当前时间')
    console.log(new Date(Date.now()))
    try {
      await db.collection('CurrentTask')
        .where(
          _.and([{
            taskId: _.in(registeredTasks)
          }, {
            startTime: _.gt(new Date(Date.now()))
          }])
        )
        .field({
          taskId: true
        })
        .get()
        .then(res => {
          all_data = res.data
          console.log(all_data)
          taskIdArray = []
          for (let i = 0; i < all_data.length; i++) {
            taskIdArray.push(all_data[i].taskId)
          }
          result.errCode = 0
          result.errMsg = "查询成功"
          data.registeredTasks = taskIdArray
        })

    } catch (e) {
      result.errCode = 10086
      result.errMsg = e

    }

    return result
  }
}