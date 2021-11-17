// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    /** 检测前端参数是否传递  start*/
    if (event.openId == undefined) {
        var result = {}
        result.errCode = 1
        result.errMsg = '参数未传递，请重试'
        var data = {}
        result.data = data
        return result
    }
    /** 检测前端参数是否传递  end*/
    var user
    const db = cloud.database()
    await db.collection('User')
        .where({
            openId:event.openId
        })
        .get()
        .then(res => {
            console.log(res)
            user = res.data[0]
        })

    var result = {}
    result.errMsg = '获取成功'
    result.errCode = 0
    var data = {}
    data.user = user
    result.data = data
    return result
}