// pages/detail_pub/detail_pub.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: '',
    info_content: {},
    intro: "",
    chat_list: [],
    sub_info: {},
    confirmed: false,
  },

  // 确认报名者
  onPickSub: function(e) {
    var openid = e.currentTarget.dataset.openid
    var that = this
    wx.showModal({
      title: '确认活动',
      content: '您确定要让该用户参加您的活动吗？',
      confirmColor: '#FE6559',
      cancelColor: '#81838F',
      cancelText: '取消',
      confirmText: '确认',
      success(res) {
        if (res.confirm) {
          console.log('用户确认活动')
          that.confirmAct({
            openid: openid,
          })
        } else if (res.cancel) {
        }
      }
    })
  },

  // 调用云函数完成确认环节
  confirmAct: function(e) {
    var that = this
    console.log(e.openid)
    wx.cloud.callFunction({
      name: 'accept_registration',
      data: {
        applicantOpenId: e.openid,
        taskId: that.data.task_id
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log("成功完成单向确认")
          wx.showModal({
            title: '确认成功！',
            content: res.result.errMsg,
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

  // 跳转至编辑界面
  onEdit: function(e) {
    console.log("点击编辑键")
    var info_content= JSON.stringify(this.data.info_content);
    wx.navigateTo({
      url: '../publish/publish?info_content=' + info_content,
    })
  },

  // 取消活动
  onCancel: function(e) {
    var that = this
    wx.showModal({
      title: '取消活动',
      content: that.data.confirmed ? '目前活动已满员，确认取消？' : '您确定要取消这次活动吗？',
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

  // 调用云函数完成活动取消操作
  cancelAct: function(e) {
    var that = this

    // 根据目前是否确认选择不同的取消函数
    var funcName = ""
    if (that.data.confirmed) {
      funcName = 'delete_uncommitted_task'
    } else {
      funcName = 'delete_task'
    }    

    wx.cloud.callFunction({
      name: funcName,
      data: {
        taskId: that.data.taskId
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log("成功取消活动")
          wx.showModal({
            title: '活动已取消',
            content: res.result.errMsg,
            confirmText: "我知道了",
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateBack({  // 返回上一级
                  delta: 1,
                })
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
    } else {  // 如果已经有确认的报名者，则该活动处于已经确认的状态，并获取该用户的头像昵称等信息
      this.setData({
        confirmed: true
      })
      // 这里调用云函数获取参与者的个人信息
      wx.cloud.callFunction({
        name: 'get_user_detail',
        data: {
          openId: this.data.applicantsInfo.applicantsId[sub_index]
        },
        success: res => {
          if (res.result.errCode == 0) {
            console.log("成功获取参与者的信息")
            that.setData({
              sub_info: res.result.data.user
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
        sub_info: {
          nickName: "测试参与者",
          openId: "testParticipent",
          gender: 1,
          userPic: "/images/kunda.png"       
        }
      })

    }
  
    // 根据报名者信息构造显示的聊天列表对象
    var chat_list = this.data.applicantsInfo.applicantsId.map(
      applicantId => {
        return {
          name: "匿名用户",
          avatar: "/images/ano.png",
          history: "报名",
          noti: 1,
          time: "最近",
          openId: applicantId
        }
      }
    )

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
      chat_list: chat_list,
    })

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