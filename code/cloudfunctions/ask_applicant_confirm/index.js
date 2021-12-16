// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    if (event.taskId == undefined || event.applicantId == undefined) {
        var result = {}
        result.errCode = 1
        result.errMsg = '未传必要参数，请重试'
        var data = {}
        result.data = data
        return result
    }

    const db = cloud.database()
    const _ = db.command
    var applicant
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
              askedConfirm: true,
            }
        })
        .then(res => {
            console.log(res)
        })

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
            applicant = res.data[0]
        })
    if (applicant == undefined) {
        var result = {}
        result.errCode = 2
        result.errMsg = '没有找到对应的数据'
        var data = {}
        result.data = data
        return result
    }
    var result = {}
    result.errCode = 0
    result.errMsg = '更改报名者是否被请求进行最终确认状态成功'
    var data = {}
    data.applicant=applicant
    result.data=data
    return result
}