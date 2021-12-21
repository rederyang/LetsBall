// pages/detail_pub/detail_pub.js
import LibGenerateTestUserSig from '../../debug/lib-generate-test-usersig-es.min.js'
import TIM from 'tim-wx-sdk';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: '',
    intro: "",
    chatList: [],
    subInfo: {},
    confirmed: false,
    applied: false,
    msg: [],
    status: 'false',
  },
  IMlogin: function (e) {
    console.log(app.globalData.isImLogin)
    var that = this
    if (app.globalData.isImLogin == true){
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
      app.globalData.tim.on(TIM.EVENT.SDK_READY, function (event) {
        that.initRecentContactList()
      });
      app.globalData.tim.on(TIM.EVENT.SDK_READY, function (event) {
        app.globalData.tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
          that.initRecentContactList()
        })
      })
    })


  },
  // 确认报名者
  onPickSub: function (e) {
    var that = this
    var openid = e.currentTarget.dataset.openid
    var conversationid = 'C2C' + openid + '-' + that.data.taskId;
    console.log(conversationid)
    console.log('输出申请者信息')
    console.log(that.data.applicantsInfo)
    var number = that.data.applicantsInfo.length
    for (let i = 0; i < number; i++) {
      if (that.data.applicantsInfo[i].applicantId == openid) {
        var avatar = that.data.applicantsInfo[i].applicantUserPic
        var name = that.data.applicantsInfo[i].applicantNickName
        var status = that.data.status
        var taskId = that.data.taskId
        break
      }
    }
    wx.navigateTo({
      url: '../chat/chat?conversationID=' + conversationid + '&avatar=' + avatar + '&name=' + name + '&status=' + status + '&applicantId=' + openid + '&taskId=' + String(taskId),
    })
  },

  // 调用云函数完成确认环节
  confirmAct: function (e) {
    var that = this
    console.log(e.openid)
    wx.cloud.callFunction({
      name: 'accept_registration',
      data: {
        applicantId: e.openid,
        taskId: that.data.taskId,
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
          console.error('传参')
        }
      },
      fail: err => {
        wx.showModal({
          title: '确认成功！',
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
        console.error('[accept_registration] 调用失败', err)
      }
    })
    // FAKE action
    that.loadData()
  },

  // 跳转至编辑界面
  onEdit: function (e) {
    var that = this
    console.log("点击编辑键")
    var task = JSON.stringify(that.data.task);
    wx.navigateTo({
      url: '../edit/edit?info_content=' + task + "&taskId=" + that.data.taskId,
    })
  },

  // 取消活动
  onCancel: function (e) {
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
          wx.showLoading({
            title: '取消活动',
          })
          that.cancelAct()
        }
      }
    })
  },

  // 调用云函数完成活动取消操作
  cancelAct: function (e) {
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
        wx.hideLoading({
          success: () => {
            if (res.result.errCode == 0) {
              console.log("成功取消活动")
              wx.showModal({
                title: '活动已取消',
                confirmText: "我知道了",
                confirmColor: '#FE6559',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateBack({ // 返回上一级
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
        })
      },
      fail: err => {
        wx.hideLoading({
          success: () => {},
        })
        console.error('[云函数] [get_hot_words] 调用失败', err)
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
      that.setData({
        msg: conversationList
      })
      console.log(conversationList.length)
      var number = conversationList.length
      var chatList = that.data.chatList
      var number_conversation = chatList.length
      console.log(that.data.chatList)
      console.log(conversationList)
      for (let i = 0; i < number;i++){
        console.log(conversationList[i])
        for (let j = 0; j < number_conversation;j++){
          console.log(chatList[j].openId)
          console.log(conversationList[i].userProfile.userID.split('-').slice(0,-1).join('-'))
          if (conversationList[i].userProfile.userID.split('-').slice(0,-1).join('-') == chatList[j].openId)
          {
            console.log('yes')
            chatList[j].history =  conversationList[i].lastMessage.payload.text,
            chatList[j].noti =  conversationList[i].unreadCount, 
            chatList[j].time = new Date(conversationList[i].lastMessage.lastTime*1000).toTimeString().split(' ')[0]
          }
        }
      }
      console.log(chatList)
      that.setData({
        chatList:chatList
      })
        
    
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
              applied: true,
              applicantsInfo: res.result.data.info,
            })
            let chatList = that.data.applicantsInfo.map(
              item => {
                return {
                  name: item.applicantNickName,
                  avatar: item.applicantUserPic,
                  history: "",
                  noti: NaN, 
                  time: "",
                  openId: item.applicantId,
                }
              }
            )
            console.log(chatList)
            that.setData({
              chatList: chatList,
            })
            // 其次需要没有被确认
            if (that.data.applicantsInfo[0].isFull) {
              that.setData({
                confirmed: true
              })
              // 看看确认的人
              for (let i = 0; i < that.data.applicantsInfo.length; i++) {
                if (that.data.applicantsInfo[i].applicantStatus) {
                  that.setData({
                    subInfo: {
                      nickName: that.data.applicantsInfo[i].applicantNickName,
                      openId: that.data.applicantsInfo[i].applicantId,
                      gender: 1,
                      userPic: that.data.applicantsInfo[i].applicantUserPic,
                    }
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
  onShareAppMessage: function (res) {
    return {
      title: '活动邀请！',
      path: '/pages/detail_sub/detail_sub?taskId=' + this.data.taskId,
    }
  },

  // onShareTimeline: function(e) {
  //   return {
  //     title: '活动邀请',
  //     query: 'taskId=' + this.data.taskId,
  //   }
  // },
})