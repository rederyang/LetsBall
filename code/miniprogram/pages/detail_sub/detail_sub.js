// pages/detail_sub/detail_sub.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: '',
    pubId: '',
    info_content: {},
    intro: "",
    chat_list: [],
    pub_info: {},
    confirmed: false,
    confirmedByUser: false,
  },

  // 用户报名之后的动作
  applyAct: function(e) {
    var that = this
    wx.cloud.callFunction({
      name: 'sign_up_for_task',
      data: {
        applicantId: app.globalData.openId,
        taskId: that.data.taskId,
        applicantGender: app.globalData.user.gender,
        applicantNickName: app.globalData.userInfo.nickName,
        applicantUserPic: app.globalData.userInfo.avatarUrl,
        applicantAge: app.globalData.user.age,
      },
      success: res => {
        console.log(res)
        if (res.result.errCode == 0) {
          wx.showModal({
            title: '报名成功',
            content: '请等待发起者的确认',
            confirmText: "我知道了",
            confirmColor: '#FE6559',
            showCancel: false,
          })
        } else if (res.result.errCode == 1) {
          console.log('传参，妈的')
        } else if (res.result.errCode == 2) {
          wx.showModal({
            title: '您已经报过名了',
            content: '请等待发起者的确认~',
            confirmText: "我知道了",
            confirmColor: '#FE6559',
            showCancel: false,
          })
        }
      },
      fail: err => {
        console.error('[云函数] [sign_up_for_task] 调用失败', err)
      }
    })
  },

  // 开启聊天（这里当作申请确认）
  onChat: function(e) {
    var that = this
    wx.showModal({
      title: '报名活动',
      content: '确定要报名这个活动吗~',
      confirmColor: '#FF0A6B',
      cancelColor: '#81838F',
      cancelText: '再想想',
      confirmText: '报名！',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.applyAct()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 调用云函数完成活动取消操作
  cancelAct: function(e) {
    var that = this

    wx.cloud.callFunction({
      name: "quit_commited_task",
      data: {
        taskId: that.data.taskId,
        applicantId: app.globalData.openId,
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log(res)
          wx.showModal({
            title: '已取消确认',
            content: res.result.errMsg,
            confirmText: "我知道了",
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.loadData()  // 需要重新加载页面数据
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
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
        wx.showModal({
          title: '取消成功',
          confirmText: "我知道了",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.loadData()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        console.error('[云函数] [quit_commited_task] 调用失败', err)
      }
    })
  },

  // 取消
  onCancel: function(e) {
    var that = this
    wx.showModal({
      title: '取消活动',
      content: '目前活动已确认，确认取消？',
      cancelColor: '#FE6559',
      confirmColor: '#81838F',
      cancelText: '再想想',
      confirmText: '要取消',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.cancelAct()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 获取关于活动的信息
  loadData: function () {
    var that = this

    // 这里需要调用云函数获取活动信息
    wx.cloud.callFunction({
      name: "get_task_detail",
      data: {
        taskId: [that.data.taskId],
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log(res)
          console.log("成功获取活动详情")
          that.setData({
            task: res.result.data.tasks[0]
          })

          // 修改时间
          let startTime = new Date(that.data.task.startTime)
          console.log(startTime)
          var date = startTime.getFullYear() + '-' + (startTime.getMonth() + 1) + '-' + startTime.getDate()
          var time =  startTime.getHours() + ':' + startTime.getMinutes()
          that.setData({
            date: date,
            time: time,
          })

          // 这里根据发布者id调用云函数获取参与者的个人信息
          wx.cloud.callFunction({
            name: 'get_user_detail',
            data: {
              openId: [that.data.task.publisherId],
            },
            success: res => {
              if (res.result.errCode == 0) {
                console.log()
                that.setData({
                  pubInfo: res.result.data.users[0],
                })
              } else {
                console.log('传参')
              }
            },
            fail: err => {
              console.error('[云函数] [get_user_detail] 调用失败', err)
            }
          })
        } else {
          console.log('传参')
        }
      },
      fail: err => {
        console.error('[云函数] [get_task_detail] 调用失败', err)
      }
    })

    // 这里需要调用云函数获取报名者信息
    wx.cloud.callFunction({
      name: "get_task_applicants",
      data: {
        taskId: [that.data.taskId]
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log(res)
          // 首先需要不是空的
          if (res.result.data.info.length > 0) {
            that.setData({
              applicantsInfo: res.result.data.info,
            })
            // 其次需要没有被确认
            if (that.data.applicantsInfo[0].isFull) {
              that.setData({
                confirmed: true
              })
              // 看是不是自己确认的
              for (let i = 0; i < that.data.applicantsInfo.length; i++) {
                if (that.data.applicantsInfo[i].applicantId == app.globalData.openId) {
                  that.setData({
                    confirmedByUser: true
                  })
                  break
                }
              }
            }
          }
        } else {
          console.log('传参')
        }
      },
      fail: err => {
        console.error('[云函数] [get_task_applicants] 调用失败', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    this.setData({
      taskId: parseInt(options.taskId)
    })
    console.log(this.data.taskId)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})