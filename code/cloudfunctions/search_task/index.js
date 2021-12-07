// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud2-0g1qpznn8481602d'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  if(event.keyWord==undefined){

    var result ={}
    result.errCode=1
    result.errMsg='未传必要参数，请重试'
    var data={}
    result.data=data
    return result
  }

  const db=cloud.database()
  await db.collection('CurrentTask')
  

}