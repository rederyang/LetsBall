// pages/main/main.js

const app = getApp()

Page({
  data: {
    status: 0,
    images: [ 'cloud://cloud2-0g1qpznn8481602d.636c-cloud2-0g1qpznn8481602d-1307703676/images/test1.jpg', 'cloud://cloud2-0g1qpznn8481602d.636c-cloud2-0g1qpznn8481602d-1307703676/images/test2.jpg'],
    activities: []
  },

  // 点击函数部分
  // 点击最新活动
  onTapNew: function (event) {
    this.setData({
      status: 0
    })
  },

  // 点击热门活动
  onTapHot: function (event) {
    wx.showModal({
      title: '本功能开发中，敬请期待~',
      confirmText: "好吧",
      confirmColor: '#FE6559',
      showCancel: false,
    })
    return
    this.setData({
      status: 1
    })
  },

  // 点击进入详情页
  onTapDetail: function (event) {
    var taskId = event.currentTarget.dataset.taskid
    console.log("获取到任务id:" + String(taskId))
    
    // 如果没有登录，就直接进入报名者界面，正常显示满员与否
    // if (!app.globalData.logged) {
    //   wx.navigateTo({
    //     url: '../detail_sub/detail_sub?TaskId=' + TaskId,
    //   })
    // } else if (app.globalData.taskPub.includes(TaskId)) {  // 否则需要判断用户是否是该任务的发起者
    //   wx.navigateTo({
    //     url: '../detail_pub/detail_pub?TaskId=' + TaskId,
    //   })
    // }

    // 判断是报名者还是发布者进行页面跳转
    var publisherId

    wx.cloud.callFunction({
      
      name: "get_task_detail",
      data: {
        taskId: [taskId],
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log(res.result)
          publisherId=res.result.data.tasks[0].publisherId
          console.log(publisherId)
          console.log(app.globalData.openId)
          if(publisherId==app.globalData.openId){
            console.log('当前用户是发布者')
            wx.navigateTo({
              url: '../detail_pub/detail_pub?taskId=' + taskId,
            })
          }
          else{
            wx.navigateTo({
              url: '../detail_sub/detail_sub?taskId=' + taskId,
            })
          }
        } else if(res.data.errCode==1) {
          console.log('传参')
        } else{
          console.log('该任务不存在')
        }
      },
      fail:err=>{
        console.error('[云函数] [get_task_detail] 调用失败', err)
      }
    })

    // console.log(isPublisher)
    // if(isPublisher==0){
    // wx.navigateTo({
    //   url: '../detail_sub/detail_sub?taskId=' + taskId,
    // })}
    // else{
    //   wx.navigateTo({
    //     url: '../detail_pub/detail_pub?taskId=' + taskId,
    //   })
    // }
  },

  // 点击增加按钮
  onTapAdd: function (event) {
    var that = this
    console.log('点击增加按钮')
    // 判断用户是否登录
    if (!app.globalData.logged) {
      that._wechatSign()
    } else {
      wx.navigateTo({
        url: '../publish/publish',
      })
    }
  },

  // 点击更多按钮
  onTapMore: function(event) {
    console.log("点击更多按钮")
    wx.navigateTo({
      url: '/pages/main-more/main-more',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    var that = this   
    // 先获取openId
    that._silentSign()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    // 获取最新活动
    that._getLatestTask()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('用户下拉刷新')
    this._getLatestTask(
      () => wx.stopPullDownRefresh({
        success: (res) => {console.log('刷新完毕')},
      })
    )
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  // 下方为私有函数部分
  // 首次注册
  _wechatSign: function(callback) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '请先登录哦~',
      confirmColor: '#FE6559',
      cancelColor: '#81838F',
      cancelText: '取消',
      confirmText: '登录',
      success(res) {
        if (res.confirm) {
          console.log('用户确认登录。')
          wx.getUserProfile({
            desc: '用于更新和完善用户资料', 
            success: (res) => {
              console.log("获取用户信息成功")
              console.log(res.userInfo)
              app.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl
              app.globalData.userInfo.nickName = res.userInfo.nickName
              that._updateUser()
              wx.showModal({
                title: '登录成功！',
                confirmText: "好的",
                confirmColor: '#FE6559',
                showCancel: false,
              })
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 静默注册
  _silentSign: function(callback) {
    if (app.globalData.openId == undefined) {
      wx.cloud.callFunction({
        name: 'get_openid',
        data: {},
        success: res => {
          if (res.result.errCode == 0) {
            console.log('获取openId成功。')
            app.globalData.openId = res.result.data.openId
            console.log('openId: ', app.globalData.openId)
            
            // 静默注册
            wx.cloud.callFunction({
              name: 'check_user',
              data: {
                openId: app.globalData.openId,
              },
              success: res => {
                if (res.result.errCode == 0) {
                  if (res.result.data.boolexist == 1) {
                    console.log('查有此人。')
                    console.log('昵称：', res.result.data.user.nickName)
                    app.globalData.logged = true
                    app.globalData.user = res.result.data.user
                    app.globalData.userInfo.avatarUrl = app.globalData.user.userPic
                    app.globalData.userInfo.nickName = app.globalData.user.nickName
                    callback && callback()
                  } else {
                    console.log('查无此人。')
                    callback && callback()
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
          wx.showModal({
            confirmText: '小程序加载失败，请退出重试',
            showCancel: false,
          })
          console.error('获取openId失败，离谱。', err)
        }
      })
    } else {
      console.log('已经获得openid')
      callback && callback()
    }
  },

  // 获得最新任务
  _getLatestTask: function(callback) {
    var that = this
    wx.cloud.callFunction({
      name: 'get_latest_task',
      data: {},
      success: res => {
        console.log('查询最新任务成功，一共', res.result.data.tasks.length, '条。');
        if (res.result.errCode == 0) {
          let newActivities = res.result.data.tasks.map(
            item => {
              let startTime = new Date(item.startTime)
              let date = startTime.getFullYear() + '年' + (startTime.getMonth() + 1) + '月' + startTime.getDate() + '日'
              let time =  startTime.getHours() + '点' + startTime.getMinutes() + '分'
              let strTime = date + time + '开始'
              res = item
              res.startTime = strTime
              return res
            }
          )
          that.setData({
            newActivities: newActivities
          })
          callback && callback()
        } else {
          console.error('传参！')
          callback && callback()
        }
      },
      fail: err => {
        console.error('[云函数] [get_latest_task] 调用失败', err)
        wx.showModal({
          title: '获取最新活动失败，请刷新重试',
          content: err.result.errMsg,
          showCancel: false,
        })
        callback && callback()
      }
    })
  },

  // 根据时间进行筛选
  _filterByTime: function(activity) {
    let now = new Date()
    let startTime = new Date(Date.parse(activity.StartTime))
    if (now >= startTime) {
      return false
    }
    return true
  },

  // 添加用户进入数据库
  _updateUser: function() {
    // 调用云函数 TODO 这里输入参数不应该有openid和age，因为前端拿不到
    wx.cloud.callFunction({
      name: 'wechat_sign',
      data: {
        openId: app.globalData.openId,
        userPic: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName,
        gender: app.globalData.userInfo.gender,
        age: 18,
      },
      success: res => {
        console.log(res);
        if (res.result.errCode == 0) {
          console.log('注册完美成功！')
          app.globalData.logged = true
          app.globalData.user = res.result.data.user
        } else {
          console.error('传参错误！')
        }
      },
      fail: err => {
        console.error('[云函数] [wechat_sign] 调用失败', err)
      }
    })
  },
})
