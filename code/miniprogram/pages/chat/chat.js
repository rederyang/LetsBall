import TIM from 'tim-wx-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
import {
  Event
} from '../../utils/event.js'
import LibGenerateTestUserSig from '../../debug/lib-generate-test-usersig-es.min.js'
const app = getApp()

// pages/chat/chat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '', //发送的文字消息内容
    myMessages: [], //消息
    height: '',
    complete: 0, //默认为有历史记录可以拉取
    is_lock: true, //发送消息锁
    tim: '',
    userSig: '',
    userID: '', //自己的id
    conversationID: '',
    msgList: app.globalData.msgList,
    friendAvatarUrl: '',
    friendNickname: '',
    myAvatarUrl: '',
    isCompleted: false,
    nextReqMessageID: '',
    more_text: '下拉查看更多历史信息',
    isSuperSend: false,
    isDetail: false,
    inputHeight: 0,
    inputShow: true,
    focus: false,
    adjust: true,
    asPub: false,  // 当前用户是否是发布者
    applicantNickNameStatus: false,  // 报名者是否取匿
  },

  accept() {
    // 确认报名者
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
          wx.showLoading({
            title: '正在确认',
          })
          that.confirmAct()
        }
      }
    })
  },

  confirmAct: function (e) {
    // 调用云函数完成确认环节
    var that = this
    console.log(that.data.applicantId)
    wx.cloud.callFunction({
      name: 'accept_registration',
      data: {
        applicantId: that.data.applicantId,
        taskId: that.data.taskId,
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log("成功完成单向确认")
          wx.hideLoading({
            success: () => {
              console.log("成功完成单向确认")
              wx.showModal({
                title: '确认成功！',
                confirmColor: '#FE6559',
                confirmText: "我知道了",
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
            },
          })
        } else {
          wx.hideLoading({
            success: () => {
              console.error('传参')
            },
          })
        }
      },
      fail: err => {
        wx.hideLoading({
          success: () => {
        wx.showModal({
          title: '确认失败！',
          confirmText: "我知道了",
          confirmColor: '#FE6559',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateBack({ // 返回上一级
                delta: 1,
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
    })
        console.error('[accept_registration] 调用失败', err)
      }
    })
    // FAKE action
    //that.loadData()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.event = new Event()
    var that = this
    wx.showLoading({
      title: '加载中...',
      icon: 'none'
    })

    // 用于显示对方头像、对方昵称和当前用户头像
    var friendAvatarUrl = ''
    var friendNickname = ''
    var myAvatarUrl = ''

    // 根据前一个页面判断当前用户是否是发布者
    let pages = getCurrentPages(); //页面对象
    let prevpage = pages[pages.length - 2]; //上一个页面对象
    console.log(prevpage.route) //上一个页面路由地址
    if (prevpage.route === 'pages/detail_pub/detail_pub') {
      this.setData({
        asPub: true
      })
    }

    console.log(options)

    // 不论当前用户是报名者还是发布者，总要查询报名者是否取匿，因此先获得报名者的openId
    var subOpenId = ''
    if (this.data.asPub) {
      subOpenId = options.openId
    } else {
      subOpenId = app.globalData.openId
    }

    // 接下来调用云函数查询这个报名者是否取匿
    try {
      var res = await wx.cloud.callFunction({
        name: "get_applicant_status",
        data: {
          taskId: Number(options.taskId),
          applicantId: subOpenId
      }})
      
      if (res.result.errCode == 0) {
        console.log(res)
        that.setData({
          applicantNickNameStatus: res.result.data.applicantNickNameStatus
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
    } catch (err) {
      console.log(err)
    }

    // 根据：报名者是否取匿、当前用户是否发布者, 确定当前用户头像、对方头像、对方昵称
    if (this.data.asPub) { // 如果当前用户是发布者
      myAvatarUrl = app.globalData.userInfo.avatarUrl  // 发布者总是要显示真实头像
      if (this.data.applicantNickNameStatus) {  // 报名者已经取匿
        friendNickname = options.name
        friendAvatarUrl = options.avatar
      } else {  // 报名者未取匿
        friendNickname = '匿名用户'
        friendAvatarUrl = 'cloud://cloud2-0g1qpznn8481602d.636c-cloud2-0g1qpznn8481602d-1307703676/images/avatar.png'        
      }
    } else {  // 如果当前用户是报名者
      friendAvatarUrl = options.avatar  // 发布者总是要显示真实头像
      friendNickname = options.name  // 并显示真实昵称
      if (this.data.applicantNickNameStatus) {  // 报名者已经取匿
        myAvatarUrl = this.globalData.userInfo.avatarUrl
      } else {
        myAvatarUrl = 'cloud://cloud2-0g1qpznn8481602d.636c-cloud2-0g1qpznn8481602d-1307703676/images/avatar.png'
      }
    }

    that.setData({
      conversationID: options.conversationID,
      friendAvatarUrl: friendAvatarUrl,
      friendNickname: friendNickname,
      myAvatarUrl: myAvatarUrl,
      height: wx.getSystemInfoSync().windowHeight,
      isDetail: true,
      status: options.status == 'true',
      applicantId: options.applicantId,
      taskId: parseInt(options.taskId)
    })

    console.log(this.data)

    // 设置title，显示对方昵称
    wx.setNavigationBarTitle({
      title: friendNickname
    })

    that.pageScrollToBottom()
    
    wx.event.on('testFunc', (e, newMsgForm) => {
      console.log('testFunc')
      if ((newMsgForm === options.conversationID) && app.globalData.isDetail) {
        var newmsg = app.globalData.myMessages[that.data.conversationID]
        if (newmsg) {
          newmsg.forEach(e => {
            if (e.type == 'TIMCustomElem') {
              if (typeof (e.payload.data) == 'string' && e.payload.data) {
                var new_data = JSON.parse(e.payload.data)
                e.payload.data = new_data
              }
            }
            if (!e.isRead) {
              that.setData({
                myMessages: that.data.myMessages.concat(newmsg)
              })
            }
          })
        }
        // console.log(that.data.myMessages)
        that.setMessageRead()
        that.pageScrollToBottom()
      }
    })
    setTimeout(() => {
      //拉取会话列表
      that.getMsgList()
    }, 1000);
  },
  watch: {
    myMessages: function (newVal, oldVal) {
      // console.log(newVal, oldVal)
    }
  },
  inputFocus(e) {
    // console.log(e)
    var inputHeight = 0
    if (e.detail.height) {
      inputHeight = e.detail.height
    }
    this.setData({
      inputHeight: inputHeight
    })
    this.pageScrollToBottom()
  },
  inputBlur(e) {
    this.setData({
      inputHeight: 0,
    })
  },
  /*getPassword() {
    var that = this
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
    promise.then(res => {
      console.log(res)
      console.log('登录IM成功')
      wx.setStorageSync('isImlogin', true)
      app.globalData.isImLogin = true
      setTimeout(() => {
        //拉取会话列表
        that.getMsgList()
      }, 1000);
    })
  },*/

  getMsgList() {
    console.log('获取会话列表')
    var that = this
    var tim = app.globalData.tim
    // 拉取会话列表
    var params = {
      conversationID: that.data.conversationID,
      count: 15,
      nextReqMessageID: that.data.nextReqMessageID
    }
    let promise = tim.getMessageList(params);
    promise.then(function (imResponse) {
      console.log('会话列表')
      const messageList = imResponse.data.messageList; // 消息列表。
      // 处理自定义的消息
      messageList.forEach(e => {
        if (e.type == 'TIMCustomElem') {
          if (typeof (e.payload.data) == 'string' && e.payload.data) {
            var new_data = JSON.parse(e.payload.data)
            e.payload.data = new_data
          }
        }
      })
      const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
      const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
      // 将某会话下所有未读消息已读上报
      that.setMessageRead()
      that.setData({
        myMessages: messageList,
        isCompleted: isCompleted,
        nextReqMessageID: nextReqMessageID,
        more_text: isCompleted ? '没有更多了' : '下拉查看更多历史信息'
      })
      wx.hideLoading()
      that.pageScrollToBottom()
    }).catch(function (imError) {
      console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
    });
  },

  getMoreMsgList() {
    wx.hideLoading()
    // console.log('获取会话列表')
    var tim = app.globalData.tim
    var that = this
    // 拉取会话列表
    var params = {
      conversationID: that.data.conversationID,
      count: 15,
      nextReqMessageID: that.data.nextReqMessageID
    }
    let promise = tim.getMessageList(params);
    promise.then(function (imResponse) {
      // console.log('下拉获取会话列表')
      // 处理自定义的消息
      imResponse.data.messageList.forEach(e => {
        if (e.type == 'TIMCustomElem') {
          if (e.payload.data) {
            var new_data = JSON.parse(e.payload.data)
            e.payload.data = new_data
          }
        }
      })
      const messageList = imResponse.data.messageList.concat(that.data.myMessages); // 消息列表。
      const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
      const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
      that.setData({
        myMessages: messageList,
        isCompleted: isCompleted,
        nextReqMessageID: nextReqMessageID,
        more_text: isCompleted ? '没有更多了' : '下拉查看更多历史信息'
      })
    }).catch(function (imError) {
      console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
    });
  },
  // 设置已读上报
  setMessageRead() {
    var tim = app.globalData.tim
    var that = this
    let promise = tim.setMessageRead({
      conversationID: that.data.conversationID
    })
    promise.then(function (imResponse) {
      // 已读上报成功
      var noready = 0
      that.data.myMessages.forEach(e => {
        if (!e.isRead) {
          noready++
        }
      })
      var number = wx.getStorageSync('number_msg')
      var newNumber = number - noready
      wx.setStorageSync('number_msg', newNumber)
    }).catch(function (imError) {
      // 已读上报失败
      console.warn('setMessageRead error:', imError);
    })
  },
  bindKeyInput(e) {
    var that = this;
    that.setData({
      inputValue: e.detail.value,
    })
  },
  bindfocus() {
    var that = this;
    that.setData({
      inputShow: false,
      focus: true,
      adjust: true
    })
  },
  bindblur() {
    var that = this;
    if (that.data.inputValue) {
      that.setData({
        inputShow: false,
        focus: false
      })
    } else {
      that.setData({
        inputShow: true,
        focus: false
      })
    }
    // 键盘消失
    wx.hideKeyboard()
    // this.setData({
    //   adjust: false
    // })
  },
  // 发送普通文本消息
  bindConfirm(e) {
    var that = this;
    if (that.data.is_lock) {
      that.setData({
        is_lock: false
      })
      if (that.data.inputValue.length == 0) {
        wx.showToast({
          title: '消息不能为空!',
          icon: 'none'
        })
        that.setData({
          is_lock: true
        })
        return;
      }
      var content = {
        text: that.data.inputValue
      };
      var tim = app.globalData.tim
      var options = {
        to: that.data.conversationID.slice(3), // 消息的接收方
        conversationType: TIM.TYPES.CONV_C2C, // 会话类型取值TIM.TYPES.CONV_C2C或TIM.TYPES.CONV_GROUP
        payload: content // 消息内容的容器
      }
      // // 发送文本消息，Web 端与小程序端相同
      // 1. 创建消息实例，接口返回的实例可以上屏
      let message = tim.createTextMessage(options)
      // 2. 发送消息
      let promise = tim.sendMessage(message)
      promise.then(function (imResponse) {
        // 发送成功
        var messageList = that.data.myMessages
        messageList.push(imResponse.data.message)
        that.setData({
          is_lock: true,
          myMessages: messageList
        })
        that.pageScrollToBottom()
        that.clearInput()
      }).catch(function (imError) {
        // 发送失败
        console.warn('sendMessage error:', imError);
      })
    }
  },
  // 清除输入框
  clearInput(e) {
    this.setData({
      inputValue: ''
    })
  },

  pageScrollToBottom() {
    wx.createSelectorQuery().select('#chat').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        selector: '#chat',
        scrollTop: rect ? rect.height : 0,
        duration: 0
      })
    }).exec()
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
    app.globalData.isDetail = true
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.hideKeyboard()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 关闭聊天界面的时候需要把当前聊天界面的监听器关闭 否则会一直监听着 在其他页面出现调用多次的问题
    wx.event.off("testFunc")
    // 键盘消失
    wx.hideKeyboard()
    var tim = app.globalData.tim
    let promise = tim.logout();
    promise.then(function (imResponse) {
      // console.log(imResponse.data); // 登出成功
    }).catch(function (imError) {
      console.warn('logout error:', imError);
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    if (!that.data.isCompleted) {
      wx.showLoading({
        title: '加载历史记录中...',
        icon: 'none'
      })
      that.getMoreMsgList()
    } else {
      wx.showToast({
        title: '没有更多历史记录了',
        icon: 'none'
      })
    }
    setTimeout(() => {
      wx.stopPullDownRefresh(true)
    }, 300);
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

  _getSubStatus: async function (taskId, applicantId) {

    var that = this
    }
  },
)