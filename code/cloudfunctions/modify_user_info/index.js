// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  var result = {}
  result.errMsg = ""
  var data = {}
  result.data = data
  /** 传递必要的参数 start */

  if (event.openId == undefined ||(event.gender == undefined && event.age == undefined && event.tips == undefined)) {

    result.errMsg = '未传必要参数，请重试'
    result.errcode = 1
    return result

  }

  // 实例化数据库连接
  const db = cloud.database()
  var data
  if (event.gender != undefined) {
    data.gender = event.gender
  }
  if (event.age != undefined) {
    data.age = event.age
  }
  if (event.tips != undefined) {
    data.tips = tips
  }
  try {
    await db.collection('User')
      .where({
        openId: event.openId
      })
      .updata({data})
      .then(res => {
        result.errcode = 0
        result.errMsg = '更新成功'
        result.data = res.data
        return result
      })
  } catch (e) {
    result.errMsg = 10086
    result.errMsg = e
    return result

  }


}