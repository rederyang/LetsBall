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
    if (event.openId == undefined) {
    
      result.errMsg = '未传必要参数，请重试'
      result.errcode = 1
      return result
    }
    const db = cloud.database()
    time1 = db.serverDate()
    time2 = Date()
    console.log(time1)
    console.log(time2)
    console.log()
}