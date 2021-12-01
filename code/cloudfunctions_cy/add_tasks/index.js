// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    /**检测前端是否传了参数 start */
    if (event.taskName == undefined || event.details == undefined || event.taskPic == undefined || event.publisher == undefined || event.totalNum == undefined || event.startTime == undefined || event.duration == undefined || event.place == undefined || event.type == undefined || event.spaceProvided == undefined || event.equipmentProvided == undefined || event.signProvided == undefined || event.otherRequirements == undefined || event.level == undefined || event.publisherId == undefined ) {
        //返回执行结果
        var result = {}
        result.errCode = 1
        result.errMsg = '未传必要参数或参数不完整，请重试'

        var data = {}
        result.data = data
        return result
    }
    /**检测前端是否传了参数 end */

    //实例化数据库
    const db = cloud.database()

    /**计算新加入的任务的id start */
    var taskid = 0
    var oldmax = 0
    var currentmax = 0
    var ctold = await db.collection('OldTask').count()
    if (ctold.total > 0) {
        await db.collection('OldTask')
            .skip(ctold.total - 1)
            .get()
            .then(res => {
                console.log('获取OldTask中最大id成功')
                console.log(res.data)
                oldmax = res.data[0].maxTaskId
            })
    }
    var ctcurrent = await db.collection('CurrentTask').count()
    console.log("CurrentTask元素个数为")
    console.log(ctcurrent.total)
    if (ctcurrent.total > 0) {
        await db.collection('CurrentTask')
            .skip(ctcurrent.total - 1)
            .get()
            .then(res => {
                console.log('获取CurrentTask中最大id成功')
                console.log(res.data)
                currentmax = res.data[0].maxTaskId
            })
    }
    if (oldmax > currentmax) {
        taskid = oldmax + 1
    } else {
        taskid = currentmax + 1
    }
    /**计算新加入的任务的id end */
    /**计算end time */
    var startTime = new Date(event.startTime)
    endTime = new Date(startTime.getTime()+event.duration*60*1000)
    console.log(endTime)
    /**计算endtime end */
    //构造要添加的数据
    add_data = {
        taskName: event.taskName,
        maxTaskId: taskid,
        taskId: taskid,
        taskPic: event.taskPic,
        publisherQuitStatus:false,
        publisher: event.publisher,
        publisherId: event.publisherId,
        totalNum: event.totalNum,
        startTime: startTime,
        duration: event.duration,
        endTime:endTime,
        place: event.place,
        type: event.type,
        details: event.details,
        spaceProvided: event.spaceProvided,
        equipmentProvided: event.equipmentProvided,
        signProvided: event.signProvided,
        otherRequirements: event.otherRequirements,
        clickNum:0,
        isExpired: false,
        level:event.level
    }
    console.log('新构造的任务数据')
    console.log(add_data)

    var task;
    await db.collection('CurrentTask')
        .add({
            data: add_data
        })
        .then(res => {
            console.log('新增任务成功')
            console.log(res)
        })
  
    await db.collection('CurrentTask')
        .where({
            taskId:taskid
        })
        .get()
        .then(res=>{
            console.log(res)
            task=res.data[0]
        })
    
    //在User表中维护已发布的任务的taskId
    var publishedtasks
    await db.collection('User')
    .where({
        openId:event.publisherId
    })
    .field({
        publishedTasks:true
    })
    .get()
    .then(res=>{
        console.log('加油')
        console.log(res.data)
        publishedtasks=res.data[0].publishedTasks
    })
    publishedtasks.push(taskid)
    console.log(publishedtasks)

    await db.collection('User')
    .where({
        openId:event.publisherId
    })
    .update({
        data:{
            publishedTasks:publishedtasks
        }
    })
    .then(res=>{
        console.log(res)
    })

    // //在CurrentTaskApplicantsInfo表中添加相关记录
    // add_info={
    //     taskId:taskid,
    //     applicantsId:,
    //     applicantNickNameStatus:[],
    //     applicantStatus:[],
    //     canceltimes:[]
    // }
    // await db.collection('CurrentTaskApplicantsInfo')
    // .add({
    //     data:add_info
    // })
    // .then(res=>{
    //     console.log('新增任务报名信息成功')
    //     console.log(res)
    // })
    // await db.collection('CurrentTaskApplicantsInfo')
    // .where({
    //     taskId:taskid
    // })
    // .get()
    // .then(res=>{
    //     console.log(res)
    // })

    var result = {}
    result.errCode = 0
    result.errMsg = '新增任务成功'
    var data = {}
    data.task = task
    result.data = add_data
    return result
}