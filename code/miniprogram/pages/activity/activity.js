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
                app.globalData.logged = true
                that.onUpdateUserInfo()  // TODO 更新用户信息
              },
              })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      console.log("已经登录")
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

  loadData: async function () {
    var that = this

    console.log(app.globalData.openId)

    // 获取用户发布的所有活动
    try {
      res = await wx.cloud.callFunction({
        name: 'get_user_published',
        data: {
          openId: app.globalData.openId
        },
      })
      if (res.result.errCode == 0) {
        let taskPub = res.result.data.tasks.publishedTasks
        that.setData({
          pubTaskId: taskPub
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
    } catch (err) {
      console.log(err)
    }

    // 获取用户报名的所有活动
    try {
      res = await wx.cloud.callFunction({
        name: 'get_user_signed',
        data: {
          openId: app.globalData.openId
        }
      })
      if (res.result.errCode == 0) {
        let taskSub = res.result.data.registeredTasks
        that.setData({
          subTaskId: taskSub
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
    } catch (err) {
      console.log(err)
    }

    console.log("测试获取taskId")
    console.log(that.data)

    console.log("测试拼接")
    console.log(that.data.pubTaskId.concat(that.data.subTaskId))

    // 根据taskID查询得到任务的详情信息
    try {
      var res = await wx.cloud.callFunction({
        name: 'get_task_detail',
        data: {
          taskId: that.data.pubTaskId.concat(that.data.subTaskId)
        }})
      if (res.result.errCode == 0) {
        console.log(res)
        let taskSub = res.result.data.tasks.filter(item => that.data.subTaskId.includes(item.taskId))  // 筛选得到用户报名的活动
        let taskPub = res.result.data.tasks.filter(item => that.data.pubTaskId.includes(item.taskId)) // 筛选得到用户发布的活动
        that.setData({
          activitiesSub: taskSub,
          activitiesPub: taskPub
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
    } catch(err) {
      console.log(err)
    }

    // 根据taskID查询得到任务的报名情况
    try {
      var res = await wx.cloud.callFunction({
        name: 'get_task_applicants',
        data: {
          taskId: that.data.pubTaskId.concat(that.data.subTaskId)
        }})
      if (res.result.errCode == 0) {
        let taskSubApplicants = res.result.data.tasks.filter(item => that.data.taskPub.includes(item.taskId))  // 筛选得到用户报名的活动
        let taskPubApplicants = res.result.data.tasks.filter(item => that.data.taskSub.includes(item.taskId)) // 筛选得到用户发布的活动
        this.setData({
          activitiesSubApplicants: taskSubApplicants,
          activitiesPubApplicants: taskPubApplicants
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
    } catch(err) {
      console.log(err)
    }

    console.log("测试输出")
    console.log(this.data)

    // 根据上述信息构造用于显示的列表对象，具体形式待定，与任务详情相比，多了confirmed字段
    try {
      var activitiesPub = this.data.activitiesPub.map(item => ({...item, ...this.data.activitiesPubApplicants.filter(s => s.taskId === item.taskId)[0]}))
      var activitiesSub = this.data.activitiesSub.map(item => ({...item, ...this.data.activitiesSubApplicants.filter(s => s.taskId === item.taskId)[0]}))
      this.setData({
        activitiesPub: activitiesPub,
        activitiesSub: activitiesSub
      })
    } catch(err) {
      console.log(err)
    }

    // FAKE data 假设已经构造好了
    // var subTaskId = [
    //   'testTask1', 'testTask2', 'testTask3'
    // ]
    // var pubTaskId = [
    //   'testTask4', 'testTask5', 'testTask6'
    // ]
    // var activitiesSub =  [
    //   {
    //     details: "xiangqing",
    //     duration: "shichang",
    //     equipmentProvided: false,
    //     level: "初学",
    //     otherRequirements: "qitayaoqiu",
    //     place: "didian",
    //     publisher: 'testPublisher',
    //     signProvided: false,
    //     spaceProvided: false,
    //     startTime: "Mon Nov 15 2021 11:47:00",
    //     taskName: "mingcheng",
    //     taskPic: "/images/cover.jpg",
    //     totalNum: 1,
    //     type: "跑步",
    //     taskId: 'testTask1',
    //     confirmed: true
    //   },
    //   {
    //     details: "xiangqing",
    //     duration: "shichang",
    //     equipmentProvided: false,
    //     level: "初学",
    //     otherRequirements: "qitayaoqiu",
    //     place: "didian",
    //     publisher: 'testPublisher',
    //     signProvided: false,
    //     spaceProvided: false,
    //     startTime: "Mon Nov 15 2021 11:47:00",
    //     taskName: "mingcheng",
    //     taskPic: "/images/cover.jpg",
    //     totalNum: 1,
    //     type: "跑步",
    //     taskId: "testTask2",
    //     confirmed: true
    //   },
    //   {
    //     details: "xiangqing",
    //     duration: "shichang",
    //     equipmentProvided: false,
    //     level: "初学",
    //     otherRequirements: "qitayaoqiu",
    //     place: "didian",
    //     publisher: 'testPublisher',
    //     signProvided: false,
    //     spaceProvided: false,
    //     startTime: "Mon Nov 15 2021 11:47:00",
    //     taskName: "mingcheng",
    //     taskPic: "/images/cover.jpg",
    //     totalNum: 1,
    //     type: "跑步",
    //     taskId: "testTask3",
    //     confirmed: false
    //   }
    // ]
    // var activitiesPub =  [{
    //   details: "xiangqing",
    //   duration: "shichang",
    //   equipmentProvided: false,
    //   level: "初学",
    //   otherRequirements: "qitayaoqiu",
    //   place: "didian",
    //   publisher: 'testPublisher',
    //   signProvided: false,
    //   spaceProvided: false,
    //   startTime: "Mon Nov 15 2021 11:47:00",
    //   taskName: "mingcheng",
    //   taskPic: "/images/cover.jpg",
    //   totalNum: 1,
    //   type: "跑步",
    //   taskId: "testTask4",
    //   confirmed: false
    // },
    // {
    //   details: "xiangqing",
    //   duration: "shichang",
    //   equipmentProvided: false,
    //   level: "初学",
    //   otherRequirements: "qitayaoqiu",
    //   place: "didian",
    //   publisher: 'testPublisher',
    //   signProvided: false,
    //   spaceProvided: false,
    //   startTime: "Mon Nov 15 2021 11:47:00",
    //   taskName: "mingcheng",
    //   taskPic: "/images/cover.jpg",
    //   totalNum: 1,
    //   type: "跑步",
    //   taskId: "testTask5",
    //   confirmed: true
    // },
    // {
    //   details: "xiangqing",
    //   duration: "shichang",
    //   equipmentProvided: false,
    //   level: "初学",
    //   otherRequirements: "qitayaoqiu",
    //   place: "didian",
    //   publisher: 'testPublisher',
    //   signProvided: false,
    //   spaceProvided: false,
    //   startTime: "Mon Nov 15 2021 11:47:00",
    //   taskName: "mingcheng",
    //   taskPic: "/images/cover.jpg",
    //   totalNum: 1,
    //   type: "跑步",
    //   taskId: "testTask6",
    //   confirmed: true
    // }]

    that.setData({
      status: 0,
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
    this.loadData()
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

  onShareAppMessage() {
  }

})