// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud2-0g1qpznn8481602d'
})

//获取最新活动，传入参数为获取的数目，版本一不判断是否过期，返回最后几个记录
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    /**判断前端参数是否传递正确  start */
    if (event.num1 == undefined || event.num2 == undefined) {
        var result = {}
        result.errCode = 1
        result.errMsg = '前端参数传递错误，请重试'
        var data = {}
        result.data = data
        return result
    }
    /**判断前端参数是否传递正确  end */
    var num1 = event.num1
    var num2 = event.num2
    const db = cloud.database()
    var validData
    var validDataLength
    const _ = db.command
    await db.collection('CurrentTask')
        .where(
            _.and([{
                publisherQuitStatus:false
            }, {
              startTime: _.gt(new Date(Date.now()))
            }])
          )

        
      .get()
      .then(res=>{
          console.log(res.data)
          validData = res.data
          validDataLength = res.data.length
      })
      if (event.num2 > validDataLength) {
        var result = {}
        result.errCode = 2
        result.errMsg = '你太贪心了，没那么多数据，妈的'
        var data = {}
        data.tasks = validData.reverse()
        return result
    }
    if (event.num1 >= event.num2) {
        var result = {}
        result.errCode = 3
        result.errMsg = '参数传反了 小傻瓜'
        var data = {}
        data.tasks = validData.reverse()
        return result
    }
    var result = {}
    result.errCode = 0
    result.errMsg = '成了！'
    var data = {}
    data.tasks = validData.reverse().slice(num1,num2)
    result.data = data
//     var dataNum = await db.collection('CurrentTask').count()
//     console.log(dataNum)
//     console.log(event.num)
//     if (dataNum.total < event.num) {
//         Num = dataNum.total
//     } else {
//         Num = event.num
//     }
//     console.log(Num)
//     var j=0
//     for(let i=1;i<=dataNum.total;i++){
//         await db.collection('CurrentTask')
//         .skip(dataNum.total-i)
//         .limit(1)
//         .get()
//         .then(res=>{
//             console.log(res)
//             if(res.data[0].publisherQuitStatus==false){
//                 console.log(res)
//                 tasks.push(res.data[0])
//                 j++
//             }
//         })
//         if(j==Num){
//             break
//         }
//     }
// /*    await db.collection('CurrentTask')
//         .skip(dataNum.total - event.num)
//         .get()
//         .then(res => {
//             console.log(res)
//             tasks = res.data
//         })
// */
//     var result = {}
//     result.errCode = 0
//     result.errMsg = '获取数据成功'
//     var data = {}
//     data.tasks = tasks
//     result.data = data
    return result

}