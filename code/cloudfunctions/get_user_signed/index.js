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

  if (event.openID == undefined) {

    result.errMsg = '未传必要参数，请重试'
    result.errcode = 1
    return result

  }

  // 实例化数据库连接
  const db = cloud.database()

  try {
    await db.collection('User')
      .where({
        Openid: event.openID
      })
      .get()
      .then(res => {
        if (length(res.data)>=2) {
          result.errcode = 2
          result.errMsg = '返回数量大于1！查一下错误'
          return result
        }
        data.taskIdArray= res.data[0].registeredTasks
        result.errcode = 0
        result.errMsg = '查询报名全部活动成功'
        result.data = data
        return result
      })
  }catch(e){
    result.errMsg = 10086
    result.errMsg = e
    return result

  }


}