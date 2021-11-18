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
  }
})

