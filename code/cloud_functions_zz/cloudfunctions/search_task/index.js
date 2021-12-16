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

  if (event.content == undefined) {

    result.errMsg = '未传必要参数，请重试'
    result.errCode = 1
    return result

  }
  console.log(event)
  var key = event.content.toString()
  const db = cloud.database()
  const _ = db.command
  // 实例化数据库连接
  console.log('.*'+key)
  db.collection('CurrentTask').where(_.or([{
    details: db.RegExp({
      regexp: '.*'+key
    })
  },
  {
    taskName: db.RegExp({
      regexp: '.*'+key
    })
  },
  {
    type: db.RegExp({
      regexp: '.*'+key
    })
  },
]).and([{
  startTime: _.gt(new Date(Date.now()))
}])).get()
.then(res => {
  var tasks = res.data
  data.tasks = tasks
  result.errMsg = "查完了"
  result.errCode = 0
})

  return result

}