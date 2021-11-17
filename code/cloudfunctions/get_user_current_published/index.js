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

  if (event.taskId == undefined || event.applicantId== undefined) {
    
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
      .update({
        data:{
          applicantNickNameStatus:db.command.mul(-1).inc(1)
        }
      })
      .then(res => {
        result.errcode = 0
        result.errcode = "更新取匿成功"
        result.data = res.data
        return result
      })
  }catch(e){
    result.errcode = 10086
    result.errMsg = e
    return result

  }


}