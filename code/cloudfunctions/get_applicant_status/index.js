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

  if (event.TaskId == undefined || event.ApplicantopenId == undefined) {

    result.errMsg = '未传必要参数，请重试'

    return result

  }

  // 实例化数据库连接
  const db = cloud.database()
  try {
    await db.collection('CurrentTaskApplicantsInfo')
      .where({
        Applicantsid: event.ApplicantopenId,
        Taskid:event.Taskid
      })
      .get()
      .then(res => {
        console.log('查询applicantsinfo成功')
        data.Taskid = res.TaskId
        data.ApplicantopenId = res.Applicantsid
        data.ApplicantNickNameStatus =  res.ApplicantNickNameStatus
        data.ApplicantStatus = res.ApplicantStatus
        data.CancelTimes = res.CancelTimes
        result.data = data
        return result
      })
  }catch(e){
    result.errMsg = e
    return result

  }


}