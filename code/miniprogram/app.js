//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'cloud2-0g1qpznn8481602d',
      })
    }

    this.globalData = {
      logged: false,
      userInfo: {
        avatarUrl: '/images/ano.png',
        nickName: '点击登录',
        gender: 1,
        age: 18,
      },
      user: {},
      taskSub: {},  // 当前用户报名的所有活动
      taskPub: {},  // 当前用户发布的所有活动
    }
    
    // 获取openId
    if (this.globalData.openId == undefined) {
      wx.cloud.callFunction({
        name: 'get_openid',
        data: {},
        success: res => {
          if (res.result.errCode == 0) {
            console.log('获取openId成功。')
            this.globalData.openId = res.result.data.openId
            console.log('openId: ', this.globalData.openId)
            
            // 静默注册
            wx.cloud.callFunction({
              name: 'check_user',
              data: {
                openId: this.globalData.openId,
              },
              success: res => {
                console.log(res)
                if (res.result.errCode == 0) {
                  if (res.result.data.boolexist == 1) {
                    console.log('查有此人。')
                    this.globalData.logged = true
                    this.globalData.user = res.result.data.user
                    this.globalData.userInfo.avatarUrl = this.globalData.user.userPic
                    this.globalData.userInfo.nickName = this.globalData.user.nickName
                  } else {
                    console.log('查无此人。')
                  }
                } else {
                  console.error('通过openid查用户失败。', err)
                }
              },
              fail: err => {
                console.error('查用户失败，离谱。', err)
              }
            })
          } else {
            console.log('获取openId失败，传参有问题。')
          }
        },
        fail: err => {
          console.error('获取openId失败，离谱。', err)
        }
      })
    } else {
      console.log('已经获得openid')
    }  
  }
})

