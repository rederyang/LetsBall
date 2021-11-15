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

  if (event.openID == undefined) {

    result.errMsg = '未传必要参数，请重试'

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
        console.log('查询报名全部活动成功')
        console.log(res.data)
        if (length(res.data)>=2) {
          result.errMsg = '返回数量大于1！查一下错误'
          return result
        }
        data.taskid = res.data[0].RegisteredTasks
        result.data = data
        return result
      })
  }catch(e){
    result.errMsg = e
    return result

  }


}