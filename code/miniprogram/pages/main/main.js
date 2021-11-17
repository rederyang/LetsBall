// pages/main/main.js

const app = getApp()

Page({
  data: {
    status: 0,
    images: [ '/images/test1.jpg', '/images/test2.jpg'],
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
    this.setData({
      status: 1
    })
  },

  // 点击进入详情页
  onTapDetail: function (event) {
    var TaskId = event.currentTarget.dataset.taskid
    console.log("获取到任务id:" + String(TaskId))
    
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

    // 默认以报名者身份跳转
    wx.navigateTo({
      url: '../detail_sub/detail_sub?TaskId=' + TaskId,
    })
  },

  // 点击增加按钮
  onTapAdd: function (event) {
    console.log('点击增加按钮')
    // 判断用户是否登录
    if (!app.globalData.logged) {
      var that = this
      wx.showModal({
        title: '提示',
        content: '请先登录哦~',
        confirmColor: '#FF0A6B',
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
                app.globalData.userInfo = res.userInfo
                that._updateUser()
              },
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
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
    // 先获取openId
    that._silentSign(
      () => {
        // 获取最新活动并按照时间筛选
        wx.cloud.callFunction({
          name: 'get_latest_task',
          data: {
            num: 2,
          },
          success: res => {
            console.log(res);
            if (res.result.errCode == 0) {
              let tasks = res.result.data.tasks
              // 根据时间筛选
              // activities = activities.filter(that._filterByTime)
              that.setData({
                newActivities: tasks
              })
            } else {
              wx.showModal({
                title: '抱歉，出错了呢~',
                content: res.result.errMsg,
                confirmText: "我知道了",
                showCancel: false,
              })
            }
          },
          fail: err => {
            console.error('[云函数] [get_latest_task] 调用失败', err)
            wx.showModal({
              title: '[get_latest_task] 调用失败',
              content: '请检查云函数是否已部署',
              showCancel: false,
            })
          }
        })

        // 获取热门活动并按照时间筛选
        // wx.cloud.callFunction({
        //   name: 'get_hot_task',
        //   data: {
        //     num: 30,
        //   },
        //   success: res => {
        //     console.log(res);
        //     if (res.result.errCode == 0) {
        //       let activities = res.result.data.activities
        //       // 根据时间筛选          
        //       activities = activities.filter(this._filterByTime)
        //       that.setData({
        //         hotActivities: activities
        //       })
        //     } else {
        //       wx.showModal({
        //         title: '抱歉，出错了呢~',
        //         content: res.result.errMsg,
        //         confirmText: "我知道了",
        //         showCancel: false,
        //       })
        //     }
        //   },
        //   fail: err => {
        //     console.error('[云函数] [wechat_sign] 调用失败', err)
        //     wx.showModal({
        //       title: '调用失败',
        //       content: '请检查云函数是否已部署',
        //       showCancel: false,
        //     })
        //   }
        // })

        // wx.cloud.callFunction({
        //   name: 'get_user_published',
        //   data: {
        //     openId: app.globalData.openId,
        //   },
        //   success: res => {
        //     console.log(res);
        //     if (res.result.errCode == 0) {
        //       let taskPub = res.result.data.taskId
        //       app.globalData.taskPub = taskPub
        //       console.log(taskPub)
        //     } else {
        //       wx.showModal({
        //         title: 'get_user_published',
        //         content: res.result.errMsg,
        //         confirmText: "我知道了",
        //         showCancel: false,
        //       })
        //     }
        //   },
        //   fail: err => {
        //     console.error('[云函数] [get_user_published] 调用失败', err)
        //     wx.showModal({
        //       title: '[get_user_published]调用失败',
        //       content: '请检查云函数是否已部署',
        //       showCancel: false,
        //     })
        //   }
        // })
    
        // // 获取用户报名的所有活动
        // wx.cloud.callFunction({
        //   name: 'get_user_signed',
        //   data: {},
        //   success: res => {
        //     console.log(res);
        //     if (res.result.errCode == 0) {
        //       let taskSub = res.result.data.taskId
        //       app.globalData.taskSub = taskSub
        //     } else {
        //       wx.showModal({
        //         title: '抱歉，出错了呢~',
        //         content: res.result.errMsg,
        //         confirmText: "我知道了",
        //         showCancel: false,
        //       })
        //     }
        //   },
        //   fail: err => {
        //     console.error('[get_user_signed] 调用失败', err)
        //     wx.showModal({
        //       title: '调用失败',
        //       content: '请检查云函数是否已部署',
        //       showCancel: false,
        //     })
        //   }
        // })
      }
    )
    
    // some dummy data
    // var newActivities =  [
    //   {
    //     picture_url: "/images/test3.jpg",
    //     title: '足球运动',
    //     loc: "氣膜館",
    //     time: "10月1日",
    //     leader: "令狐沖",
    //     TaskId: "1",
    //   },
    //   {
    //     picture_url: "/images/test3.jpg",
    //     title: '足球运动',
    //     loc: "氣膜館",
    //     time: "10月1日",
    //     leader: "令狐沖",
    //     TaskId: "2",
    //   },
    //   {
    //     picture_url: "/images/test3.jpg",
    //     title: '足球运动',
    //     loc: "氣膜館",
    //     time: "10月1日",
    //     leader: "令狐沖",
    //     TaskId: "3",
    //   },
    //   {
    //     picture_url: "/images/test3.jpg",
    //     title: '足球运动',
    //     loc: "氣膜館",
    //     time: "10月1日",
    //     leader: "令狐沖",
    //     TaskId: "4",
    //   },
    //   {
    //     picture_url: "/images/test2.jpg",
    //     title: '足球运动',
    //     loc: "氣膜館",
    //     time: "10月1日",
    //     leader: "令狐沖",
    //     TaskId: "5",
    //   },
    // ]
    var hotActivities =  [
      {
        picture_url: "/images/test4.jpg",
        title: '击剑',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
        TaskId: "1234567",
      },
      {
        picture_url: "/images/test3.jpg",
        title: '击剑',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
        TaskId: "1234567",
      },
      {
        picture_url: "/images/test4.jpg",
        title: '击剑',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
        TaskId: "1234567",
      },
      {
        picture_url: "/images/test4.jpg",
        title: '击剑',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
        TaskId: "1234567",
      },
      {
        picture_url: "/images/test2.jpg",
        title: '击剑',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
        TaskId: "1234567",
      },
    ]
    var taskSub = [
      '1', '2', '3'
    ]
    var taskPub = [
      '4', '5', '6'
    ]
    this.setData({
      status: 0,
      hotActivities: hotActivities,
    })
    app.globalData.taskSub = taskSub
    app.globalData.taskPub = taskPub
    // app.globalData.logged = true

    if (this.data.status == 0) {
      this.setData({
        activities: this.data.newActivities
      })
      console.log("当前状态是0")
    } else {
      this.setData({
        activities: this.data.hotActivities
      })
      console.log("当前状态是1")
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  // 下方为私有函数部分
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
                console.log(res)
                if (res.result.errCode == 0) {
                  if (res.result.data.boolexist == 1) {
                    console.log('查有此人。')
                    app.globalData.logged = true
                    app.globalData.user = res.result.data.user
                    app.globalData.userInfo.avatarUrl = app.globalData.user.userPic
                    app.globalData.userInfo.nickName = app.globalData.user.nickName
                    callback()
                  } else {
                    console.log('查无此人。')
                    callback()
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
    var that = this
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
          wx.showModal({
            title: '抱歉，出错了呢~',
            content: res.result.errMsg,
            confirmText: "我知道了",
            showCancel: false,
          })
        }
      },
      fail: err => {
        console.error('[云函数] [wechat_sign] 调用失败', err)
        wx.showModal({
          title: '调用失败',
          content: '请检查云函数是否已部署',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
})