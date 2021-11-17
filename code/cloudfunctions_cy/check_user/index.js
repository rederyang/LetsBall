// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {

    /**检测前端参数是否传达 start */

    if (event.openId == undefined) {
        //返回执行结果
        var result = {}
        result.errCode = 1
        result.errMsg = '未传必要参数，请重试'

        var data = {}
        result.data = data

        return result
    }
    /**检测前端参数是否传达 end */

    //实例化数据库
    const db = cloud.database()

    /**根据前端传入的openid判断用户信息是否在数据库中  start */
    var boolexist = 0;
    var user;
    await db.collection('User')
        .where({
            openId: event.openId
        })
        .get()
        .then(res => {
            console.log('获取用户信息操作成功')
            console.log(res)
            if (res.data.length == 0) {
                boolexist = 0
            } else {
                boolexist = 1
            }
        })
    /**根据前端传入的openid判断用户信息是否在数据库中  end */
    
    //返回执行结果
    var result = {}
    result.errCode = 0
    result.errMsg = '返回结果成功，1表示用户数据存在，0表示用户数据不存在'
    var data = {}
    data.boolexist = boolexist
    result.data = data
    return result
}