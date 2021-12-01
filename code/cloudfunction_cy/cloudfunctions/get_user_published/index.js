// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    /**检测前端参数是否传递完成 start */
    if(event.openId==undefined){
        var result={}
        result.errCode=1
        result.errMsg='前端参数未传递，请重试'
        var data={}
        result.data=data
        return result
    }
    /**检测前端参数是否传递完成 end */
    
    var tasks
    //实例化数据库连接
    const db=cloud.database()

    await db.collection('User')
    .where({
        openId:event.openId
    })
    .field({
        publishedTasks:true
    })
    .get()
    .then(res=>{
        console.log('获取到的数据为')
        console.log(res)
        tasks=res.data[0]
    })

    var result={}
    result.errCode=0
    result.errMsg='获取用户发布的所有任务成功'
    var data={}
    data.tasks=tasks
    result.data=data
    return result
}