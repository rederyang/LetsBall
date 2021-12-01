// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env:'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    /**检测前端参数是否传递正确 start */
    if(event.taskId==undefined){
        var result={}
        result.errCode=1
        result.errMsg='前端参数传递错误，请重试'
        var data={}
        result.data=data
        return result
    }
    /**检测前端参数是否传递正确 end */

    var clicknum
    var task
    const db=cloud.database()
    await db.collection('CurrentTask')
    .where({
        taskId:event.taskId
    })
    .get()
    .then(res=>{
        console.log(res)
        cicknum=res.data[0].clickNum+1
    })
    await db.collection('CurrentTask')
    .where({
        taskId:event.taskId
    })
    .update({
        data:{
            clickNum:clicknum
        }
    })
    .then(res=>{
        console.log(res)
    })
    await db.collection('CurrentTask')
    .where({
        taskId:event.taskId
    })
    .get()
    .then(res=>{
        console.log(res)
        task=res.data[0]
    })

    var result={}
    result.errCode=0
    result.errMsg='增加点击量成功'
    var data={}
    data.task=task
    result.data=data
    return result
}