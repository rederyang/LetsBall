// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

//发布者接受报名者的申请（适用于版本一）
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    /**判断前端参数是否传递正确 start */
    if (event.taskId == undefined || event.applicantId == undefined) {
        var result = {}
        result.errCode = 1
        result.errMsg = '前端参数传递错误，请重试'
        var data = {}
        result.data = data
        return result
    }
    /**判断前端参数是否传递正确 end */

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
        .update({
            data: {
                applicantStatus: true,
            }
        })
        .then(res => {
            console.log(res)
        })
    await db.collection('CurrentTaskApplicantsInfo')
        .where({
            taskId: event.taskId
        })
        .update({
            data: {
                isFull: true
            }
        })
        .then(res => {
            console.log(res)
        })
    var result = {}
    result.errCode = 0
    result.errMsg = '发布者接收报名者成功'
    var data = {}
    data.applicant = event.applicantId
    result.data = data
    return result
}