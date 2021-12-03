// pages/activity/activity.js

const app = getApp()

Page({
  data: {
    status: 0,
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
                app.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl
                app.globalData.userInfo.nickName = res.userInfo.nickName
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

  // 点击查看活动详情
  onTapDetail(event) {
    console.log("点击详情")
    var taskId = event.currentTarget.dataset.taskid
    console.log(taskId)
    if (this.data.pubTaskId.includes(taskId)) {  // 如果是当前用户发布的
      wx.navigateTo({
        url: '../detail_pub/detail_pub?taskId=' + taskId,
      })
    } else {
      wx.navigateTo({
        url: '../detail_sub/detail_sub?taskId=' + taskId,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status: 0
    })
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
    this._loadData()
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
    this._loadData(
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

  onShareAppMessage() {
  },

  // 下方为私有函数部分

  // 根据openId获取用户相关的活动信息
  _loadData: async function (callback) {
    var that = this

    // console.log(app.globalData.openId)

    console.time('获取用户发布和报名的所有活动')
    // 获取用户发布和报名的所有活动
    try {
      var userPubFunc = wx.cloud.callFunction({
        name: 'get_user_published_before_starttime',
        data: {
          openId: app.globalData.openId
        },
      })
      var userSubFunc = wx.cloud.callFunction({
        name: 'get_user_signed_before_starttime',
        data: {
          openId: app.globalData.openId
        }
      })

      var result = await Promise.all([userPubFunc, userSubFunc])
      var userPubRes = result[0]
      var userSubRes = result[1]

      console.log(userPubRes)
      
      // 处理userPubRes
      if (userPubRes.result.errCode == 0 || userPubRes.result.errCode == 2) {  // 2 表示当前用户不存在
        let taskPub = userPubRes.result.data.publishedTasks
        if (taskPub == undefined) {
          taskPub = []
        }
        that.setData({
          pubTaskId: taskPub
        })
      } else {
        wx.showModal({
          title: '抱歉，出错了呢~',
          content: userPubRes.result.errMsg,
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
      
      // 处理userSubRes
      if (userSubRes.result.errCode == 0 || userSubRes.result.errCode == 2) {  // 2 表示当前用户不存在
        let taskSub = userSubRes.result.data.registeredTasks
        if (taskSub == undefined) {
          taskSub = []
        }
        that.setData({
          subTaskId: taskSub
        })
      } else {
        wx.showModal({
          title: '抱歉，出错了呢~',
          content: userSubRes.result.errMsg,
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
    } catch (err) {
      console.log(err)
    }
    console.timeEnd('获取用户发布和报名的所有活动')

    console.time('根据taskID查询得到任务的详情信息和报名情况')
    // 根据taskID查询得到任务的详情信息和报名情况
    try {
      var taskDetailFunc = wx.cloud.callFunction({
        name: 'get_task_detail',
        data: {
          taskId: that.data.pubTaskId.concat(that.data.subTaskId)
        }})
      var taskAppFunc = wx.cloud.callFunction({
        name: 'get_task_applicants',
        data: {
          taskId: that.data.pubTaskId.concat(that.data.subTaskId)
        }})

      var result = await Promise.all([taskDetailFunc, taskAppFunc])

      var taskDetailRes = result[0]
      var taskAppRes = result[1]

      // 处理taskDetailRes
      if (taskDetailRes.result.errCode == 0) {
        let taskSub = taskDetailRes.result.data.tasks.filter(item => ((that.data.subTaskId.includes(item.taskId)) && (!item.publisherQuitStatus)))  // 筛选得到用户报名的活动，要求没有取消
        let taskPub = taskDetailRes.result.data.tasks.filter(item => ((that.data.pubTaskId.includes(item.taskId)) && (!item.publisherQuitStatus))) // 筛选得到用户发布的活动，要求没有取消
        that.setData({
          activitiesSubRaw: taskSub,
          activitiesPubRaw: taskPub
        })
      } else {
        wx.showModal({
          title: '抱歉，出错了呢~',
          content: taskDetailRes.result.errMsg,
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

      // 处理taskAppRes
      if (taskAppRes.result.errCode == 0) {
        let taskSubApplicants = taskAppRes.result.data.info.filter(item => that.data.subTaskId.includes(item.taskId))  // 筛选得到用户报名的活动
        let taskPubApplicants = taskAppRes.result.data.info.filter(item => that.data.pubTaskId.includes(item.taskId)) // 筛选得到用户发布的活动
        // 输出得到的任务报名情况
        // console.log(taskSubApplicants)
        this.setData({
          activitiesSubApplicants: taskSubApplicants,
          activitiesPubApplicants: taskPubApplicants
        })
      } else {
        wx.showModal({
          title: '抱歉，出错了呢~',
          content: taskAppRes.result.errMsg,
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
    } catch(err) {
      console.log(err)
    }
    console.timeEnd('根据taskID查询得到任务的详情信息和报名情况')

    console.time('构造显示列表')
    // 根据上述信息构造用于显示的列表对象，与任务详情相比，多了反应是否满员的字段，并对时间格式化
    try {
      var activitiesPub = this.data.activitiesPubRaw.map(item => ({...item, ...this.data.activitiesPubApplicants.filter(s => s.taskId === item.taskId)[0]}))
      activitiesPub = activitiesPub.map(
        item => {
          let startTime = new Date(item.startTime)
          let date = startTime.getFullYear() + '年' + (startTime.getMonth() + 1) + '月' + startTime.getDate() + '日'
          let time =  startTime.getHours() + '点' + startTime.getMinutes() + '分'
          let strTime = date + time + '开始'
          let res = item
          res.startTime = strTime
          return res
        }
      )
      var activitiesSub = this.data.activitiesSubRaw.map(item => ({...item, ...this.data.activitiesSubApplicants.filter(s => s.taskId === item.taskId)[0]}))
      activitiesSub = activitiesSub.map(
        item => {
          let startTime = new Date(item.startTime)
          let date = startTime.getFullYear() + '年' + (startTime.getMonth() + 1) + '月' + startTime.getDate() + '日'
          let time =  startTime.getHours() + '点' + startTime.getMinutes() + '分'
          let strTime = date + time + '开始'
          let res = item
          res.startTime = strTime
          return res
        }
      )
      activitiesPub = activitiesPub.reverse()
      activitiesSub = activitiesSub.reverse()
      this.setData({
        activitiesPub: activitiesPub,
        activitiesSub: activitiesSub
      })
      console.log("最终结果")
      console.log(that.data)
    } catch(err) {
      console.log(err)
    }
    console.timeEnd('构造显示列表')

    console.time('回调函数')
    // 调用回调函数
    if (callback != undefined) {
      callback()
    }
    console.timeEnd('回调函数')
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
      callback()
    }
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

  _gerUserSub: function() {

  }

})