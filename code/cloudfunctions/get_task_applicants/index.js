// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env:'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    /**判断前端是否传入正确的参数 start */
    if(event.taskId==undefined){
        var result={}
        result.errCode=1
        result.errMsg='前端传入参数错误，请重试'
        var data={}
        result.data=data
        return result
    }

    /**判断前端是否传入正确的参数 end */
    
    //判断任务是否存在
    var taskexist=1
    await db.collection('CurrentTask')
    .where({
        taskId:db.command.in(event.taskId)
    })
    .get()
    .then(res=>{
        if(res.data.length==0){
            taskexist=0
        }
    })
    if(taskexist==0){
        var result={}
        result.errCode=2
        result.errMsg='该任务不存在'
        var data={}
        result.data=data
        return result
    }

    var data={}
    var info
    const db=cloud.database()
    await db.collection('CurrentTaskApplicantsInfo')
    .where({
        taskId:db.command.in(event.taskId)
    })
    .get()
    .then(res=>{
        console.log(res)
        info=res.data
    })

    var result={}
    result.errCode=0
    result.errMsg='获取任务的报名情况成功'
    data.info=info
    result.data=data
    return result
}