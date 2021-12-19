// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  /**判断前端参数是否传递正确 start */
  if (event.content == undefined) {
    var result = {}
    result.errCode = 1
    result.errMsg = '前端参数传递错误，请重试'
    var data = {}
    result.data = data
    return result
  }
  /**判断前端参数是否传递正确 end */
  var key = event.content.toString()
  const db = cloud.database()
  const MAX_LIMIT = 100
  const countResult = await db.collection('CurrentTask').count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / 100)
  var tasks = []
  var tasks_temp
  const _ = db.command
  // 实例化数据库连接
  console.log('.*' + key)
  for (let i = 0; i < batchTimes; i++) {
    await db.collection('CurrentTask')
      .skip(i * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .where(_.or([{
          details: db.RegExp({
            regexp: key
          })
        },
        {
          taskName: db.RegExp({
            regexp: key
          })
        },
        {
          type: db.RegExp({
            regexp: key
          })
        },
      ]).and([{
        startTime: _.gt(new Date(Date.now()))
      }]).and([{
        publisherQuitStatus:_.eq(false)
      }])
      )
      .get()
      .then(res => {
        tasks_temp=res.data
        tasks_temp.reverse()
        tasks=tasks.concat(tasks_temp)
      })
  }

  var result = {}
  result.errCode = 0
  result.errMsg = '查找完毕'
  var data = {}
  data.tasks = tasks
  result.data = data
  return result
}