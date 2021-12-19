// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})
//报名者取消报名（确认步骤已完成）扣除User表中的credit，删除info表中的记录

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    /**判断前端参数是否传递完整  start */
    if (event.taskId == undefined || event.applicantId == undefined) {
        var result = {}
        result.errCode = 1
        result.errMsg = '前端参数未传递正确，请重试'
        var data = {}
        result.data = data
        return result
    }
    /**判断前端参数是否传递完整  end */

    //实例化数据库连接
    const db = cloud.database()
    var credits
    var userexist = 1
    //User表中的credit值减1
    await db.collection('User')
        .where({
            openId: event.applicantId
        })
        .get()
        .then(res => {
            if (res.data.length == 0) {
                userexist = 0
            } else {
                credits = res.data[0].credit - 1
            }
        })
    if (userexist == 0) {
        var result = {}
        result.errCode = 2
        result.errMsg = '该用户不存在'
        var data = {}
        result.data = data
        return result
    }
    await db.collection('User')
        .where({
            openId: event.applicantId
        })
        .update({
            data: {
                credit: credits
            }
        })
        .then(res => {
            console.log(res)
        })

    //删除info表中的记录
    const _ = db.command
    var exist = 1
    await db.collection('CurrentTaskApplicantsInfo')
        .where(
            _.and([{
                applicantId: _.eq(event.applicantId)
            }, {
                taskId: _.eq(event.taskId)
            }])
        )
        .get()
        .then(res => {
            console.log(res)
            if (res.data.length == 0) {
                exist = 0
            }
        })
    if (exist == 0) {
        var result = {}
        result.errCode = 2
        result.errMsg = '该用户的报名信息不存在'
        var data = {}
        result.data = data
        return result
    }
    await db.collection('CurrentTaskApplicantsInfo')
        .where(
            _.and([{
                applicantId: _.eq(event.applicantId)
            }, {
                taskId: _.eq(event.taskId)
            }])
        )
        .remove()
        .then(res => {
            console.log(res)
        })

    //将info表中同一个任务id的其他记录中的isFull改为false
    await db.collection('CurrentTaskApplicantsInfo')
        .where({
            taskId: event.taskId
        })
        .update({
            data: {
                isFull: false
            }
        })
        .then(res => {
            console.log(res)
        })

    //维护User表中作为报名者已违约的任务
    var applicantDefaultedTask
    var newapplicantDefaultedTask=[]
    var user
    await db.collection('User')
        .where({
            openId: event.applicantId
        })
        .get()
        .then(res => {
            console.log(res)
            applicantDefaultedTask = res.data[0].applicantDefaultedTasks
        })
        var tasknum=applicantDefaultedTask.length
        for (let i = 0; i < tasknum; i++) {
            if (applicantDefaultedTask[i] != event.taskId) {
                newapplicantDefaultedTask.push(applicantDefaultedTask[i])
            }
        }
    newapplicantDefaultedTask.push(event.taskId)
    await db.collection('User')
        .where({
            openId: event.applicantId
        })
        .update({
            data: {
                applicantDefaultedTasks: newapplicantDefaultedTask
            }
        })
        .then(res => {
            console.log(res)
        })
    //维护User表中作为报名者已报名的任务
    var applicantRegisteredTask
    var user
    await db.collection('User')
        .where({
            openId: event.applicantId
        })
        .get()
        .then(res => {
            console.log(res)
            applicantRegisteredTask = res.data[0].registeredTasks
        })
    var num = applicantRegisteredTask.length
    registeredTasks = []
    for (let i = 0; i < num; i++) {
        if (applicantRegisteredTask[i] != event.taskId) {
            registeredTasks.push(applicantRegisteredTask[i])
        }
    }
    await db.collection('User')
        .where({
            openId: event.applicantId
        })
        .update({
            data: {
                registeredTasks: registeredTasks
            }
        })
        .then(res => {
            console.log(res)
        })

    await db.collection('User')
        .where({
            openId: event.applicantId
        })
        .get()
        .then(res => {
            console.log(res)
            user = res.data[0]
        })
    var result = {}
    result.errCode = 0
    result.errMsg = '报名者取消报名成功'
    var data = {}
    data.user = user
    result.data = data
    return result
}