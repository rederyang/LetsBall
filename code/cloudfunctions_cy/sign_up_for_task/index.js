// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    /**前端参数是否传递  start */
    if (event.applicantOpenId == undefined || event.taskId == undefined) {
        //返回执行结果
        var result = {}
        result.errCode = 1
        result.errMsg = '未传必要参数，请重试'

        var data = {}
        result.data = data

        return result
    }
    /**前端参数是否传递  end */

    //报名活动：在对应的user表字段中将任务id加入
    const db = cloud.database()
    var task;
    await db.collection('User')
        .where({
            openId: event.applicantOpenId
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
            openId: event.applicantOpenId
        })
        .update({
            data:{
                registeredTasks: task
            }
        })
        .then(res => {
            console.log('在用户表中新增当前用户成功')
            console.log(res)
        })
    await db.collection('User')
        .where({
            openId: event.applicantOpenId
        })
        .get()
        .then(res => {
            console.log(res)
            user = res.data[0]
        })

    //更新info表
    var applicants
    var nickNameStatus
    var confirmStatus
    var cancelcount

    const db=cloud.database()
    db.collection('CurrentTaskApplicantsInfo')
    .where({
        taskId:event.taskId
    })
    .get()
    .then(res=>{
        console.log('获取任务的报名信息成功')
        console.log(res)
        applicants=res.data[0].applicantsId
        nickNameStatus=res.data[0].applicantNickNameStatus
        confirmStatus=res.data[0].applicantStatus
        cancelcount=res.data[0].cancelTimes
    })
    applicants.push(event.applicantOpenId)
    nickNameStatus.push(false)
    confirmStatus.push(false)
    cancelcount.push(0)

    db.collection('CurrentTaskApplicantsInfo')
    .where({
        taskId:event.taskId
    })
    .update({
        data:{
            applicantsId:applicants,
            applicantNickNameStatus:nickNameStatus,
            applicantStatus:confirmStatus,
            cancelTimes:cancelcount
        }
    })
    .then(res=>{
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