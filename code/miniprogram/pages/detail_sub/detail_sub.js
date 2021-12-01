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
    appliedByUser: false,
  },

  // 用户报名之后的动作
  applyAct: function(e) {
    var that = this
    wx.cloud.callFunction({
      name: 'sign_up_for_task',
      data: {
        applicantId: app.globalData.openId,
        taskId: that.data.taskId,
        applicantGender: app.globalData.userInfo.gender,
        applicantNickName: app.globalData.userInfo.nickName,
        applicantUserPic: app.globalData.userInfo.avatarUrl,
        applicantAge: app.globalData.userInfo.age,
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
            success(res) {
              if (res.confirm) {
                that.setData({
                  appliedByUser: true,
                })
                that.loadData()
              }
            }
          })
        } else if (res.result.errCode == 1) {
          console.log('传参，妈的')
        } else if (res.result.errCode == 2) {
          wx.showModal({
            title: '您已经报过名了',
            content: '请等待发起者的确认',
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
    if (!app.globalData.logged) {
      that._wechatSign()
    } else {
      wx.showModal({
        title: '报名活动',
        content: '确定要报名这个活动吗~',
        confirmColor: '#FE6559',
        cancelColor: '#81838F',
        cancelText: '再想想',
        confirmText: '报名',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.applyAct()
          }
        }
      })
    }
  },

  // 调用云函数完成活动取消操作
  cancelAct: function(cancelDetail) {
    var that = this
    wx.cloud.callFunction({
      name: cancelDetail.func,
      data: {
        taskId: that.data.taskId,
        applicantId: app.globalData.openId,
      },
      success: res => {
        console.log(res)
        wx.hideLoading({
          success: () => {
            if (res.result.errCode == 0) {
              wx.showModal({
                title: '取消成功',
                confirmText: "我知道了",
                confirmColor: '#FE6559',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1,
                    })
                  }
                }
              })
            } else {
              wx.showModal({
                title: '抱歉，出错了呢~',
                content: res.result.errMsg,
                confirmText: "我知道了",
                confirmColor: '#FE6559',
                showCancel: false,
              })
            }
          },
        })
      },
      fail: err => {
        wx.hideLoading({
          success: () => {
            wx.showModal({
              title: '取消成功',
              confirmText: "我知道了",
              confirmColor: '#FE6559',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1,
                  })
                }
              }
            })
          },
        })
        console.error('[云函数] [quit_commited_task] 调用失败', err)
      }
    })
  },

  // 取消
  onCancel: function(e) {
    var that = this
    if (that.data.confirmedByUser) {
      var title = '取消活动'
      var content = '目前活动已确认，确认取消？'
      var func = 'quit_commited_task'
    } else {
      var title = '取消报名'
      var content = '确认取消报名？'
      var func = 'quit_task'
    }
    wx.showModal({
      title: title,
      content: content,
      cancelColor: '#FE6559',
      confirmColor: '#81838F',
      cancelText: '再想想',
      confirmText: '要取消',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: title,
          })
          var cancelDetail = {
            title: title,
            content: content,
            func: func,
          }
          that.cancelAct(cancelDetail)
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
          let myDate = new Date(that.data.task.startTime)
          let hour = myDate.getHours()
          let minu = myDate.getMinutes()
          if (hour < 10) {
            var str_hour = '0' + hour
          } else {
            var str_hour = hour
          }
          if (minu < 10) {
            var str_minu = '0' + minu
          } else {
            var str_minu = minu
          }
          this.setData({
            time: str_hour + ':' + str_minu,
            date: myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
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
        } else if (res.result.errCode == 1) {
          console.log('传参')
        } else if (res.result.errCode == 2) {
          console.log(res)
          wx.showModal({
            title: '查找活动失败，活动可能已被取消',
            showCancel: false,
            confirmText: '好的',
            confirmColor: '#FE6559',
          })
        }
      },
      fail: err => {
        console.error('[云函数]' + cancelDetail.func + '调用失败', err)
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
            // 看看有没有被确认
            if (that.data.applicantsInfo[0].isFull) {
              that.setData({
                confirmed: true
              })
            }
            // 看看有没有报过名，也看看是不是自己确认的
            for (let i = 0; i < that.data.applicantsInfo.length; i++) {
              if (that.data.applicantsInfo[i].applicantId == app.globalData.openId) {
                that.setData({
                  appliedByUser: true
                })
                console.log('我报名了！')
                if (that.data.applicantsInfo[i].applicantStatus) {
                  that.setData({
                    confirmedByUser: true
                  })
                  console.log('确认的人是我自己！')
                }
                break
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

  },

  // 私有函数部分
  // 主动登录
  _wechatSign: function(callback) {
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