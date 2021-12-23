// pages/detail_sub/detail_sub.js

//用户登录IM系统
import LibGenerateTestUserSig from '../../debug/lib-generate-test-usersig-es.min.js'
import TIM from 'tim-wx-sdk';
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
    msg: [],
    status: 'true',
    IMuserID: '',
    IMUserSig: '',
    unreadCount: 0
  },
  IMlogin: function (e) {
    var that = this
    if (app.globalData.isImLogin == true) {
      that.initRecentContactList();
      app.globalData.tim.on(TIM.EVENT.SDK_READY, function (event) {
        app.globalData.tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
          that.initRecentContactList()
        })
      })
      return;
    }
    const _SDKAPPID = 1400601709;
    const _SECRETKEY = 'a9e99edf47724b3f1d931709760e5288f0e826a752b5705f45e4cefe3546b15a';
    var EXPIRETIME = 604800;
    var SDKAPPID = _SDKAPPID;
    var SECRETKEY = _SECRETKEY;
    var userID = app.globalData.openId + '-' + that.data.taskId;
    var generator = new LibGenerateTestUserSig(SDKAPPID, SECRETKEY, EXPIRETIME);
    var userSig = generator.genTestUserSig(userID);
    console.log('IM userID')
    console.log(userID)
    console.log('IM userSig')
    console.log(userSig)
    this.setData({
      IMuserID: userID,
      IMUserSig: userSig
    })
    app.globalData.accountTid = userID
    var tim = app.globalData.tim
    let promise = tim.login({
      userID: userID,
      userSig: userSig
    });
    promise.then(function (imResponse) {
      console.log(imResponse)
      console.log('登录IM成功')
      wx.setStorageSync('isImlogin', true)
      app.globalData.isImLogin = true
      setTimeout(function () {
        that.initRecentContactList()
      }, 1000);
      app.globalData.tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
        that.initRecentContactList()
      });
      // app.globalData.tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
      //   that.initRecentContactList()
      // })
    })
  },
  // 用户报名之后的动作
  applyAct: function (e) {
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
          that.setData({
            appliedByUser: true,
          })
          that.loadData()
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
        } else if (res.result.errCode == 4) {
          wx.showModal({
            title: '抱歉',
            content: '该活动已被发起者取消',
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

  // 开启聊天
  onChat: function (e) {
    if (!app.globalData.logged) {
      this._wechatSign()
      return;
    }
    var that = this
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
          }
        }
      }
    })
    var exist = 0; //是否报过名
    var firstApply = 'yes'; //是否报过名，传入聊天页面
    if (that.data.applicantsInfo != undefined && that.data.applicantsInfo.length > 0) {
      console.log('打印报名信息')
      console.log(that.data.applicantsInfo)
      var num = that.data.applicantsInfo.length
      for (let i = 0; i < num; i++) {
        if (that.data.applicantsInfo[i].applicantId == app.globalData.openId) {
          exist = 1;
          break;
        }
      }
    }
    if (exist == 0) { 
      var continueSignUP =1
      //没有报过名，判断该活动是否满员
      if (that.data.applicantsInfo != undefined && that.data.applicantsInfo.length > 0) {
        if (that.data.applicantsInfo[0].isFull) {
          continueSignUP = 0
          wx.showModal({
            title: '无法报名，该活动已满员',
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
        }
      }
      if(continueSignUP==1){
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
            console.log('打印e')
            console.log(e)
            console.log(that.data)
            var conversationid = 'C2C' + that.data.pubInfo.openId + '-' + that.data.taskId;
            console.log(conversationid)
            var avatar = that.data.pubInfo.userPic
            var name = that.data.pubInfo.nickName
            var status = that.data.status
            console.log(status)
            wx.navigateTo({
              url: '../chat/chat?conversationID=' + conversationid + '&avatar=' + avatar + '&name=' + name + '&status=' + status + '&userID=' + that.data.IMuserID + '&userSig' + that.data.IMuserSig + '&firstApply=' + firstApply,
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  } else {
      firstApply = 'no'
      var conversationid = 'C2C' + that.data.pubInfo.openId + '-' + that.data.taskId;
      console.log(conversationid)
      var avatar = that.data.pubInfo.userPic
      var name = that.data.pubInfo.nickName
      var status = that.data.status

      wx.navigateTo({
        url: '../chat/chat?conversationID=' + conversationid + '&avatar=' + avatar + '&name=' + name + '&status=' + status + '&userID=' + that.data.IMuserID + '&userSig' + that.data.IMuserSig + '&firstApply=' + firstApply,
      })
    }
  },

  // 调用云函数完成活动取消操作
  cancelAct: function (cancelDetail) {
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
                    that.loadData()
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
                  that.loadData()
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
  onCancel: function (e) {
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

  //获取会话列表
  initRecentContactList() {
    var that = this
    //拉取会话列表
    var tim = app.globalData.tim
    let promise = tim.getConversationList();
    if (!promise) {
      console.log('获取会话列表出错，SDK not ready')
      return
    }
    promise.then(function (imResponse) {
      console.log('会话列表')
      console.log(imResponse)
      const conversationList = imResponse.data.conversationList;
      if (conversationList.length > 0) {
        that.setData({
          msg: conversationList,
          unreadCount: conversationList[0].unreadCount
        })
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
    this.setData({
      taskId: parseInt(options.taskId)
    })
    this.loadData()
    this.IMlogin()
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
    var tim = app.globalData.tim
    let promise = tim.logout();
    promise.then(function (imResponse) {
      console.log(imResponse.data); // 登出成功
      app.globalData.isImLogin = false
    }).catch(function (imError) {
      console.warn('logout error:', imError);
    });
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
  _wechatSign: function (callback) {
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
  _updateUser: function () {
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