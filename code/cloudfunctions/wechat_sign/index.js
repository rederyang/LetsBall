// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {

    /**检测前端是否传参 start */
    if (event.nickName == undefined || event.openId == undefined || event.userPic == undefined || event.gender == undefined || event.age == undefined) { // || event.Tips == undefined) {
        var result = {}
        result.errCode = 1
        result.errMsg = '未传必要参数，请重试'

        var data = {}
        result.data = data
        return result

    }

    /**检测前端是否传参 end */
    //实例化数据库
    const db = cloud.database()

    //先查找前端传入的openId有没有在数据表中存在
    var needAdd = 0
    await db.collection('User')
        .where({
            openId: event.openId
        })
        .get()
        .then(res => {
            if (res.data.length == 0) {
                needAdd = 1
            }
        })

    //构造要添加的数据
    add_data = {
        nickName: event.nickName,
        openId: event.openId,
        userPic: event.userPic,
        gender: event.gender,
        age: event.age,
        publishedTasks: [],
        registeredTasks: [],
        confirmedTasks: [],
        publisherDefaultedTasks: [],
        applicantDefaultedTasks: [],
        credit: 100,
        tips: {}
        //Tips: event.Tips
    }
    var data = {}

    if (needAdd == 1) {
        console.log('新构造的用户数据')
        console.log(add_data)

        var add_result

        await db.collection('User')
            .add({
                data: add_data
            })
            .then(res => {
                console.log('新增用户成功')
                console.log(res)
                data = add_data
            })
    } else {
        await db.collection('User')
            .where({
                openId: event.openId
            })
            .update({
                data: {
                    nickName: event.nickName,
                    userPic: event.userPic,
                    gender: event.gender,
                    age: event.age
                }
            })
            .then(res => {
                console.log(res)
            })
        await db.collection('User')
            .where({
                openId: event.openId
            })
            .get()
            .then(res => {
                data = res.data[0]
            })
    }

    var result = {}
    result.errCode = 0
    result.errMsg = '新增用户成功'
    result.data = data
    return result
}