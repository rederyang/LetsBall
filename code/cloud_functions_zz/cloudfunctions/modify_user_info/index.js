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

  if (event.openId == undefined || (event.gender == undefined && event.age == undefined && event.tips == undefined)) {

    result.errMsg = '未传必要参数，请重试'
    result.errCode = 1
    return result

  }

  // 实例化数据库连接
  const db = cloud.database()
  update_data = {}
  if (event.gender != undefined) {
    update_data.gender = event.gender
  }
  if (event.age != undefined) {
    update_data.age = event.age
  }
  if (event.tips != undefined) {
    update_data.tips = event.tips
  }
  try {
    await db.collection('User')
      .where({
        openId: event.openId
      })
      .get()
      .then(res => {
        query = res.data
      })
    if (query.length == 1) {
      await db.collection('User')
        .where({
          openId: event.openId
        })
        .update({
          data:update_data
        })
        .then(res => {
          result.errCode = 0
          result.errMsg = '更新成功'
        })
    } else {
      result.errCode = 2
      result.errMsg = "未找到该数据或该数据不止一条"
    }
  } catch (e) {
    result.errMsg = 10086
    result.errMsg = e


  }
return result

}