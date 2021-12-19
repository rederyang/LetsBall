// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

//

// 云函数入口函数
exports.main = async (event, context) => {

    const wxContext = cloud.getWXContext()

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
    var exist = 1
    await db.collection('CurrentTask')
        .where({
            taskId: event.taskId
        })
        .get()
        .then(res => {
            if (res.data.length == 0) {
                exist = 0
            }
        })
    if (exist == 0) {
        var result = {}
        result.errCode = 2
        result.errMsg = '传入的taskId在CurrentTask表中不存在'
        var data = {}
        result.data = data
        return result
    }
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

    //删除info表中相应taskId处的记录
    await db.collection('CurrentTaskApplicantsInfo')
        .where({
            taskId: event.taskId
        })
        .remove()
        .then(res => {
            console.log('删除info表中的记录数')
            console.log(res.stats.removed)
        })

    //User表中增加违约信息
    var currentdefault
    await db.collection('User')
        .where({
            openId: wxContext.OPENID
        })
        .get()
        .then(res => {
            currentdefault = res.data[0].publisherDefaultedTasks
        })
    var newcurrentdefault = []
    for (let i = 0; i < currentdefault.length; i++) {
        if (currentdefault[i] != event.taskId) {
            newcurrentdefault.push(currentdefault[i])
        }
    }
    newcurrentdefault.push(event.taskId)
    await db.collection('User')
        .where({
            openId: wxContext.OPENID
        })
        .update({
            data: {
                publisherDefaultedTasks: newcurrentdefault
            }
        })
        .then(res => {
            console.log(res)
        })

    //从User表中publishedTask中删除对应的任务
    var publishtasks
    await db.collection('User')
        .where({
            openId: wxContext.OPENID
        })
        .get()
        .then(res => {
            console.log(res)
            publishtasks = res.data[0].publishedTasks
        })
    var newpublishtasks = []
    for (let i = 0; i < publishtasks.length; i++) {
        if (publishtasks[i] != event.taskId) {
            newpublishtasks.push(publishtasks[i])
        }
    }
    await db.collection('User')
        .where({
            openId: wxContext.OPENID
        })
        .update({
            data: {
                publishedTasks: newpublishtasks
            }
        })
        .then(res => {
            console.log(res)
        })

    var result = {}
    result.errCode = 0
    result.errMsg = '发布者取消任务成功'
    var data = {}
    data.task = task
    result.data = data
    return result
}