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

  if (event.taskId == undefined || event.applicantId == undefined) {

    result.errMsg = '未传必要参数，请重试'
    result.errCode = 1
    return result

  }

  // 实例化数据库连接
  const db = cloud.database()
  const _ = db.command
  try {
    await db.collection('CurrentTaskApplicantsInfo')
      .where(
        _.and([{
          applicantId: event.applicantId
        }, {
          taskId: event.taskId
        }])
      )
      .get()
      .then(res => {
        all_data = res.data
        query = res.data[0]
      })
    if (all_data.length > 1) {
      result.errCode = 3
      result.errMsg = '返回数量大于1！查一下错误'
    }
    if (query == undefined) {
      result.errCode = 2
      result.errMsg = "未查到该信息"
    } else {
      result.errCode = 0
      result.errMsg = "查询成功"
      result.data.applicantId = query.applicantId
      result.data.taskId = query.taskId
      result.data.applicantNickNameStatus = query.applicantNickNameStatus
      result.data.applicantStatus = query.applicantStatus
    }
  } catch (e) {
    result.errCode = 10086
    result.errMsg = e

  }
  return result

}