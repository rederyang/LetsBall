// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

//获取最新活动，传入参数为获取的数目，版本一判断是否过期，返回最后几个记录
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    // /**判断前端参数是否传递正确  start */
    // if (event.num == undefined) {
    //     var result = {}
    //     result.errCode = 1
    //     result.errMsg = '前端参数传递错误，请重试'
    //     var data = {}
    //     result.data = data
    //     return result
    // }
    // /**判断前端参数是否传递正确  end */
    var tasks = []
    var Num
    const db = cloud.database()
    const MAX_LIMIT = 100
    const _ = db.command
    var dataNum = await db.collection('CurrentTask').count()
    const total = dataNum.total
    var tasks_temp
    const batchTimes = Math.ceil(total / MAX_LIMIT)
    console.log(batchTimes)
    for (let i = batchTimes-1; i >= 0; i--) {
        await db.collection('CurrentTask')
            .skip(i * MAX_LIMIT)
            .limit(MAX_LIMIT)
            .where({
                startTime: _.gt(new Date(Date.now()))
            })
            .get()
            .then(res => {
                console.log(res)
                tasks_temp = res.data
                tasks_temp.reverse()
                tasks=tasks.concat(tasks_temp)
            })
    }
    /*    await db.collection('CurrentTask')
            .skip(dataNum.total - event.num)
            .get()
            .then(res => {
                console.log(res)
                tasks = res.data
            })
    */
    var result = {}
    result.errCode = 0
    result.errMsg = '获取数据成功'
    var data = {}
    data.tasks = tasks
    result.data = data
    return result

}