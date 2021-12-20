// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {

    /**检测前端参数是否传递 start */
    if (event.taskId == undefined) {
        //返回执行结果
        var result = {}
        result.errCode = 1
        result.errMsg = '前端参数未传，请重试'

        var data = {}
        result.data = data
        return result
    }
    /**检测前端参数是否传递 end */

    //实例化数据库
    const db = cloud.database()

    //判断该任务是否存在
    var taskexist=1
    /**根据前端传递的任务Id获取任务的起止时间 start */
    var task;
    await db.collection('CurrentTask')
        .where({
            taskId: event.taskId
        })
        .field({
            startTime: true,
            endTime: true
        })
        .get()
        .then(res => {
            if(res.data.length==0){
                taskexist=0
            }else{
            console.log('获取任务起止时间信息成功')
            console.log(res)
            task = res.data[0]
        }
        })
    /**根据前端传递的任务Id获取任务的起止时间 end */

    //返回执行结果
    if(taskexist==0){
        var result = {}
        result.errCode = 2
        result.errMsg = '该任务不存在'
        var data = {}
        result.data = data
        return result
    }
    
    var result = {}
    result.errCode=0
    result.errMsg='获取成功'
    var data = {}
    data.task = task
    result.data = data
    return result
}