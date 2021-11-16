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
    wx.cloud.callFunction({
      name: 'sign_up_for_task',
      data: {
        applicantOpenId: app.globalData.userInfo.OPENID,
        taskId: that.data.taskId
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log("成功完成申请")
          wx.showModal({
            title: '报名成功',
            content: '请等待发起者的确认',
            confirmText: "我知道了",
            confirmColor: '#FE6559',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
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
        console.error('[云函数] [get_hot_words] 调用失败', err)
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
        applicantOpenId: app.globalData.userInfo.OPENID
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log("成功取消确认")
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
        console.error('[云函数] [get_hot_words] 调用失败', err)
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
    // FAKE action
    that.loadData()
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
        taskId: that.data.taskId
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log("成功获取活动详情")
          that.setData({
            task: res.result.data.task
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
        console.error('[云函数] [get_hot_words] 调用失败', err)
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

    // FAKE data
    var task = {
      details: "xiangqing",
      duration: "shichang",
      equipmentProvided: false,
      level: "初学",
      otherRequirements: "qitayaoqiu",
      place: "didian",
      publisher: "testPublisher",
      signProvided: false,
      spaceProvided: false,
      startTime: "Mon Nov 15 2021 11:47:00",
      taskName: "mingcheng",
      taskPic: "/images/cover.jpg",
      totalNum: 1,
      type: "跑步"
    }

    that.setData({
      task: task
    })

    // 这里调用云函数获取发布者id
    wx.cloud.callFunction({
      name: "TODO",
      data: {
        //TODO
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log("成功获取活动发布者信息")
          that.setData({
            // TODO
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
        console.error('[云函数] [get_hot_words] 调用失败', err)
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

    // 这里根据发布者id调用云函数获取参与者的个人信息
    wx.cloud.callFunction({
      name: 'get_user_detail',
      data: {
        openId: this.data.pubId
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log("成功获取发布者的信息")
          that.setData({
            pub_info: res.result.data.user
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
        console.error('[云函数] [get_hot_words] 调用失败', err)
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

    // FAKE data
    this.setData({
      pub_info: {
        nickName: "测试发布者",
        openId: "testPublisher",
        gender: 1,
        userPic: "/images/avatar.png"       
      }
    })

    // 这里需要调用云函数获取报名者信息
    wx.cloud.callFunction({
      name: "get_task_applicants",
      data: {
        taskId: that.data.taskId
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log("成功获取活动报名情况")
          that.setData({
            applicantsInfo: res.result.data.applicantsInfo  // TODO这里的数据返回格式还需要确定
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
        console.error('[云函数] [get_hot_words] 调用失败', err)
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

    // FAKE data
    var applicantsInfo = {
      taskId: 'testTask1',
      applicantsId: ['testUser1', 'testUser2', 'testUser3'], // 测试openId
      applicantNickNameStatus: [true, false, false], // 是否取匿
      applicantStatus: [false, false, false], // 是否确认
      cancelTimes: [0, 0, 0],  // 取消次数
    }

    this.setData({
      applicantsInfo: applicantsInfo
    })

    // 根据报名者信息提取参与者信息
    var sub_index = this.data.applicantsInfo.applicantStatus.findIndex(value=>value)

    if (sub_index == -1) {  // 如果没有确认的报名者，则该活动处于尚未确认的状态
      this.setData({
        confirmed: false
      })
    } else {  // 如果已经有确认的报名者，则该活动处于已经确认的状态，并进一步判断参与者是否是当前用户
      this.setData({
        confirmed: true
      })

      // 判断参与者是否是当前用户
      if (that.data.applicantsInfo.applicantsId.indexOf(app.globalData.userInfo.openId) > -1) {
        that.setData({
          confirmedByUser: true
        })
      }
      
      // FAKE action
      this.setData({
        confirmedByUser: true
      })
    }

    // 从后端返回的时间字符串解析分别得到日期和时间
    var startTime = new Date(task.startTime)
    console.log(startTime)
    var date = startTime.getFullYear() + '-' + (startTime.getMonth() + 1) + '-' + startTime.getDate()
    var time =  startTime.getHours() + ':' + startTime.getMinutes()

    that.setData({
      date: date,
      time: time,
      info_content: task,
      intro: task.details,
    })

    console.log(that.data.info_content)

    console.log('执行load')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    this.setData({
      taskId: options.taskId
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