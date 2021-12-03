// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

//
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    /**检测前端参数是否传递  start */
    if (event.taskId == undefined || event.applicantId == undefined) {
        var result = {}
        result.errCode = 1
        result.errMsg = '前端参数传递错误，请重试'
        var data = {}
        result.data = data
        return result
    }
    /**检测前端参数是否传递  end */

    const db = cloud.database()
    const _ = db.command
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
    //在user表中将自己报名的任务的任务id删除
    var signtasks
    await db.collection('User')
        .where({
            openId: event.applicantId
        })
        .get()
        .then(res => {
            console.log(res)
            signtasks = res.data[0].registeredTasks
        })
    var newsigntasks = []
    for (let i = 0; i < signtasks.length; i++) {
        if (signtasks[i] != event.taskId) {
            newsigntasks.push(signtasks[i])
        }
    }
    await db.collection('User')
        .where({
            openId: event.applicantId
        })
        .update({
            data: {
                registeredTasks: newsigntasks
            }
        })
        .then(res => {
            console.log(res)
        })
    var result = {}
    result.errCode = 0
    result.errMsg = '退出成功'
    var data = {}
    result.data = data
    return result

}