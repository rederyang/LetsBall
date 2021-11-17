// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

//未完成

// 云函数入口函数
exports.main = async (event, context) => {
    /**检测前端是否传递了必要参数 start */
    if (event.taskId == undefined) {
        //返回执行结果
        var result = {}
        result.errCode = 1
        result.errMsg = '未传必要参数，请重试'

        var data = {}
        result.data = data
        return result
    }
    /**检测前端是否传递了必要参数 end */

    var task;
    //实例化数据库连接
    const db = cloud.database()
    await db.collection('CurrentTask')
        .where({
            taskId: event.taskId
        })
        .update({
            data: {
                publisherQuitStatus: true
            }
        })
        .then(res => {
            console.log('更改取消状态成功')
            console.log(res)
        })
    await db.collection('CurrentTask')
        .where({
            taskId: event.taskId
        })
        .get()
        .then(res => {
            task = res.data[0]
        })

    var result = {}
    result.errCode = 0
    result.errMsg = '发布者取消任务成功'
    var data = {}
    data.task = task
    result.data = data
    return result
}