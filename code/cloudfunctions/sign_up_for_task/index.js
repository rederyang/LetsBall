// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    /**前端参数是否传递  start */
    if (event.applicantId == undefined || event.taskId == undefined || event.applicantGender == undefined || event.applicantNickName == undefined || event.applicantUserPic == undefined || event.applicantAge == undefined) {
        //返回执行结果
        var result = {}
        result.errCode = 1
        result.errMsg = '未传必要参数，请重试'

        var data = {}
        result.data = data

        return result
    }
    /**前端参数是否传递  end */

    const db = cloud.database()
    const _ = db.command

    //检测要报名的任务是否存在
    var taskexist = 1
    await db.collection('CurrentTask')
        .where({
            taskId: event.taskId
        })
        .get()
        .then(res => {
            if (res.data.length == 0) {
                taskexist = 0
            }
        })
    if (taskexist == 0) {
        var result = {}
        result.errCode = 3
        result.errMsg = '该任务不存在'
        var data = {}
        result.data = data
        return result
    }

    //检测这个报名者信息是否存在
    var userexist = 1
    await db.collection('User')
        .where({
            openId: event.applicantId
        })
        .get()
        .then(res => {
            if (res.data.length == 0) {
                userexist = 0
            }
        })
    if (userexist == 0) {
        var result = {}
        result.errCode = 3
        result.errMsg = '该用户信息不存在'
        var data = {}
        result.data = data
        return result
    }

    //检测这个任务是否已经被取消
    var isCancel = 0
    await db.collection('CurrentTask')
        .where({
            taskId: event.taskId
        })
        .get()
        .then(res => {
            if (res.data.publisherQuitStatus == true) {
                isCancel = 1
            }
        })
    if (isCancel == 1) {
        //该任务已经被取消
        var result = {}
        result.errCode = 4
        result.errMsg = '该任务已经被取消'
        var data = {}
        result.data = data
        return result
    }

    //检测这个报名信息是否已经存在
    var flag = 0
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
            console.log('该用户信息')
            console.log(res)
            console.log(res.data.length)
            if (res.data.length > 0) {
                console.log('111111111')
                flag = 1
            }
        })

    if (flag == 1) {
        var result = {}
        result.errCode = 2
        result.errMsg = '该用户已报名该任务'
        var data = {}
        result.data = data
        return result
    }

    //报名活动：在对应的user表字段中将任务id加入
    var task;
    await db.collection('User')
        .where({
            openId: event.applicantId
        })
        .field({
            registeredTasks: true
        })
        .get()
        .then(res => {
            console.log('获取到当前用户已报名的活动')
            console.log(res)
            task = res.data[0].registeredTasks
        })
    task.push(event.taskId)

    var user;
    await db.collection('User')
        .where({
            openId: event.applicantId
        })
        .update({
            data: {
                registeredTasks: task
            }
        })
        .then(res => {
            console.log('在用户表中新增当前用户成功')
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

    //更新info表

    add_info = {
        taskId: event.taskId,
        applicantId: event.applicantId,
        applicantNickNameStatus: false,
        applicantStatus: false,
        isFull: false,
        currentNum: 0,
        totalNum: 0,
        applicantNickName: event.applicantNickName,
        applicantUserPic: event.applicantUserPic,
        applicantAge: event.applicantAge,
        applicantGender: event.applicantGender,
        askedConfirm: false,
        askedCancelAnonymity: false
    }

    db.collection('CurrentTaskApplicantsInfo')
        .add({
            data: add_info
        })
        .then(res => {
            console.log(res)
        })

    var result = {}
    result.errCode = 0
    result.errMsg = '报名成功'
    var data = {}
    data.user = user
    result.data = data
    return result
}