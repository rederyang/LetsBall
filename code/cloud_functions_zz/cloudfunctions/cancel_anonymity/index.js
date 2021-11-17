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
    result.errcode = 1
    return result

  }

  // 实例化数据库连接
  const db = cloud.database()
  try {
    await db.collection('CurrentTaskApplicantsInfo')
      .where({
        applicantId: event.applicantId,
        taskId: event.taskId
      })
      .get()
      .then(res => {
        query = res.data
      })

    if (query.length > 0) {
      await db.collection('CurrentTaskApplicantsInfo')
        .where({
          applicantId: event.applicantId,
          taskId: event.taskId
        })
        .update({
          data: {
            applicantNickNameStatus: true
          }
        })
        .then(res => {
          result.errcode = 0
          result.errMsg = "更新取匿成功"

        })
    } else {
      result.errcode = 2
      result.errMsg = "未找到该数据"
    }

  } catch (e) {
    result.errcode = 10086
    result.errMsg = e


  }
  return result

}