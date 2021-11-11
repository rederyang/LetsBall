// pages/activity/activity.js

const app = getApp()

Page({
  data: {
    status: 0,
    images: [ '/images/test1.jpg', '/images/test2.jpg'],
    tabs: [
      {
        title: '最新活动'
      },
      {
        title: '热门活动'
      }],
    activities: []
  },

  // 点击我发布的
  onTapPub: function (event) {
    this.setData({
      status: 0
    })
  },

  // 点击我订阅的
  onTapSub: function (event) {
    this.setData({
      status: 1
    })
  },

  // 点击增加按钮
  onTapAdd: function (event) {
    console.log('点击增加按钮')
    // 判断用户是否登录
    if (!app.globalData.logged) {
      wx.showModal({
        title: '提示',
        content: '请先登录哦~',
        cancelText: '取消',
        confirmText: '登录',
        showCancel: true,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            var that = this
            wx.getUserProfile({
              desc: '用于更新和完善用户资料', 
              success: (res) => {
                console.log("获取用户信息成功")
                console.log(res.userInfo)
                app.globalData.userInfo = res.userInfo
                that.onUpdateUserInfo()
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

  // 点击查看活动详情
  onTapDetail(event) {
    console.log("点击详情")
    var taskId = event.currentTarget.dataset.taskid
    var confirmed = event.currentTarget.dataset.confirmed
    console.log(taskId)
    console.log(app.globalData)
    // 如果是当前用户发布的
    if (app.globalData.taskPub.includes(taskId)) {
      wx.navigateTo({
        url: '../detail_pub_1/detail_pub_1?taskId=' + taskId,
      })
    } else {
      wx.navigateTo({
        url: '../detail_sub_1/detail_sub_1?taskId=' + taskId,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        // TODO 根据用户报名和发布的任务id获取任务信息
        var that = this
        // 获取最新活动并按照时间筛选
        wx.cloud.callFunction({
          name: 'get_latest_task',
          data: {
            num: 30,
          },
          success: res => {
            console.log(res);
            if (res.result.errCode == 0) {
              let activities = res.result.data.activities
              // 根据时间筛选          
              activities = activities.filter(this.filterByTime)
              that.setData({
                newActivities: activities
              })
            } else {
              wx.showModal({
                title: '抱歉，出错了呢~',
                content: res.result.errMsg,
                confirmText: "我知道了",
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
    
        // 获取热门活动并按照时间筛选
        wx.cloud.callFunction({
          name: 'get_hot_task',
          data: {
            num: 30,
          },
          success: res => {
            console.log(res);
            if (res.result.errCode == 0) {
              let activities = res.result.data.activities
              // 根据时间筛选          
              activities = activities.filter(this.filterByTime)
              that.setData({
                hotActivities: activities
              })
            } else {
              wx.showModal({
                title: '抱歉，出错了呢~',
                content: res.result.errMsg,
                confirmText: "我知道了",
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
    
        // 获取用户发布的所有活动
        wx.cloud.callFunction({
          name: 'get_user_published',
          data: {},
          success: res => {
            console.log(res);
            if (res.result.errCode == 0) {
              let taskPub = res.result.data.taskId
              app.globalData.taskPub = taskPub
            } else {
              wx.showModal({
                title: '抱歉，出错了呢~',
                content: res.result.errMsg,
                confirmText: "我知道了",
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
    
        // 获取用户报名的所有活动
        wx.cloud.callFunction({
          name: 'get_user_signed',
          data: {},
          success: res => {
            console.log(res);
            if (res.result.errCode == 0) {
              let taskSub = res.result.data.taskId
              app.globalData.taskSub = taskSub
            } else {
              wx.showModal({
                title: '抱歉，出错了呢~',
                content: res.result.errMsg,
                confirmText: "我知道了",
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
        
        // some dummy data
        var activitiesSub =  [
          {
            picture_url: "/images/test3.jpg",
            title: '足球运动',
            loc: "氣膜館",
            time: "10月1日",
            leader: "令狐沖",
            TaskId: "1",
            confirmed: false,
          },
          {
            picture_url: "/images/test3.jpg",
            title: '足球运动',
            loc: "氣膜館",
            time: "10月1日",
            leader: "令狐沖",
            TaskId: "2",
            confirmed: false,
          },
          {
            picture_url: "/images/test3.jpg",
            title: '足球运动',
            loc: "氣膜館",
            time: "10月1日",
            leader: "令狐沖",
            TaskId: "3",
            confirmed: true,
          },
        ]
        var activitiesPub =  [
          {
            picture_url: "/images/test3.jpg",
            title: '足球运动',
            loc: "氣膜館",
            time: "10月1日",
            leader: "令狐沖",
            TaskId: "4",
            confirmed: false,
          },
          {
            picture_url: "/images/test2.jpg",
            title: '足球运动',
            loc: "氣膜館",
            time: "10月1日",
            leader: "令狐沖",
            TaskId: "5",
            confirmed: true,
          },
          {
            picture_url: "/images/test2.jpg",
            title: '足球运动',
            loc: "氣膜館",
            time: "10月1日",
            leader: "令狐沖",
            TaskId: "6",
            confirmed: false,
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
          activitiesSub: activitiesSub,
          activitiesPub: activitiesPub,
        })
        app.globalData.taskSub = taskSub
        app.globalData.taskPub = taskPub
        app.globalData.logged = true
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

  onTabClick(e) {
    const index = e.detail.index
    this.setData({ 
      activeTab: index 
    })

    console.log(index)
  },

  onChange(e) {
    const index = e.detail.index
    this.setData({ 
      activeTab: index 
    })
  },
  handleClick(e) {
    wx.navigateTo({
      url: './webview',
    })
  },

  onShareAppMessage() {
  }

})