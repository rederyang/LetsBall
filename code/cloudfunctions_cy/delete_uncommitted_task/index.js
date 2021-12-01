// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    if (event.taskId == undefined) {
        var result = {}
        result.errCode = 1
        result.errMsg = '前端参数问题'
        var data = {}
        result.data = data
        return result
    }

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
            console.log(res)
        })
    var task
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
    result.errMsg = '发布者取消未报名成功的任务'
    var data = {}
    data.task = task
    result.data = data
    return result
}