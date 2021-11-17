// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

//发布者确认报名者报名成功

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    /**前端是否传参数 start */
    if(event.applicantOpenId == undefined || event.taskId == undefined){
        //返回执行结果
        var result={}
        result.errCode=1
        result.errMsg ='未传必要参数，请重试'

        var data={}
        result.data=data
        return result
    }
    /**前端是否传参数 end */

    var applicants
    var nickNameStatus
    var quitStatus
    var cancelcount

    const db=cloud.database()
    db.collection('CurrentTaskApplicantsInfo')
    .where({
        taskId:event.taskId
    })
    .get()
    .then(res=>{
        console.log('获取任务的报名信息成功')
        console.log(res)
        applicants=res.data[0].applicantsId
        nickNameStatus=res.data[0].applicantNickNameStatus
        quitStatus=res.data[0].applicantStatus
        cancelcount=res.data[0].cancelTimes
    })
    applicants.push(event.applicantOpenId)
    nickNameStatus.push(false)
    quitStatus.push()

}