// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    /**检测参数是否传递 start */
    if (event.taskId == undefined || event.taskName == undefined || event.taskPic == undefined || event.publisher == undefined || event.totalNum == undefined || event.startTime == undefined || event.duration == undefined || event.place == undefined || event.type == undefined || event.details == undefined || event.spaceProvided == undefined || event.equipmentProvided == undefined || event.signProvided == undefined || event.otherRequirements == undefined || event.level == undefined) {
        //返回执行结果
        var result = {}
        result.errCode = 1
        result.errMsg = '未传必要参数，请重试'

        var data = {}
        result.data = data
        return result
    }
    /**检测参数是否传递 end */

    //计算结束时间
    var endtime

    //实例化数据库
    const db = cloud.database()
    var task;
    /**根据前端传递参数对后端数据库的任务信息进行更改 start */
    await db.collection('CurrentTask')
        .where({
            taskId: event.taskId
        })
        .update({
            data: {
                taskName: event.taskName,
                taskPic: event.taskPic,
                publisher: event.publisher,
                totalNum: event.totalNum,
                startTime: event.startTime,
                duration: event.duration,
                place: event.place,
                type: event.type,
                details: event.details,
                spaceProvided: event.spaceProvided,
                equipmentProvided: event.equipmentProvided,
                signProvided: event.signProvided,
                otherRequirements: event.otherRequirements,
                endTime: endtime,
                level:event.level
            }
        })
        .then(res => {
            console.log('更新成功')
            console.log(res)
        })

    await db.collection('CurrentTask')
        .where({
            taskId: event.taskId
        })
        .get()
        .then(res => {
            console.log(res)
            task = res.data[0]
        })
    /**根据前端传递参数对后端数据库的任务信息进行更改 end */

    //返回执行结果
    var result = {}
    result.errCode = 0
    result.errMsg = '修改成功'
    var data = {}
    data.task = task
    result.data = data
    return result
}