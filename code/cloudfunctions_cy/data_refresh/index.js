// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env:'cloud2-0g1qpznn8481602d'
})

//11.23做了一些修改，但是没好，没测
// 云函数入口函数
exports.main = async (event, context) => {

    //获取当前时间
    console.log('当前时间')
    var currentTime=new Date(Date.now())
    console.log(currentTime)

    //实例化数据库连接
    const db = cloud.database()
    const currentcount = await db.collection('CurrentTask').count() //获取当前CurrentTask数据表中的数据个数

    //逐个遍历，与前端传入的时间比较，如果过期，将数据库中的IsExpired更新为true，后面二次遍历时进行数据的迁移
    for (let i = 0; i < currentcount; i++) {
        var needUpdate = false
        var updateId
        await db.collection('CurrentTask')
            .skip(i)
            .limit(1)
            .get()
            .then(res => {
                let outdate = res.data[0].endTime - currentTime
                needUpdate = outdate > 0 ? true : false //判断是否过期
                updateId = res.data[0].taskId
            })
        if (needUpdate) {
            await db.collection('CurrentTask')
                .skip(i)
                .limit(1)
                /*.where({
                    Taskid:updateId
                })*/
                .update({
                    data:{
                        isExpired: true
                    }
                })
                .then(res=>{
                    console.log(res)
                })
        }
    }
    var moveNum = 0
    //数据迁移
    for (let i = currentcount - 1; i >= 0; i--) {

        var task;
        await db.collection('CurrentTask')
            .skip(i)
            .limit(1)
            .get()
            .then(res => {
                task = res.data[0]
            })
        if (task.isExpired) {
            //将数据加入Old表
            await db.collection('OldTask')
                .add({
                    data: task
                })
                .then(res => {
                    console.log('Old表中新增数据成功')
                    console.log(res)
                })
            //删除current表中的数据
            await db.collection('CurrentTask')
                .skip(i)
                .limit(1)
                .remove()
                .then(res => {
                    console.log('从current表中删除成功')
                    console.log(res)
                    moveNum++
                })
        }
    }
    var result = {}
    var data = {}
    data.moveNum = moveNum
    result.data = data

    return result
}