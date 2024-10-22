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
    asPub: false, // 当前用户是否是发布者
    applicantNickNameStatus: false, // 报名者是否取匿
    waitForConfirm: false, // 是否正在等待报名者确认参加
    waitForFace: false, // 是否正在等待报名者取匿
    firstApply:'',//是否是第一次点进聊天页面
  },

  // 发布者请求对方最终确认
  onRequestConfirm: function () {
    var that = this
    wx.showModal({
      title: '请求确认',
      content: '请求对方进行最终确认?',
      cancelColor: '#81838F',
      confirmColor: '#FE6559',
      cancelText: '再想想',
      confirmText: '请求',
      success(res) {
        if (res.confirm) {
          //如果报名者没有取匿，提醒发布者要不要请求对方取匿
          if(that.data.applicantNickNameStatus==false){
            wx.showModal({
              title:'是否继续请求确认',
              content:'对方没有取匿，直接请求对方最终确认可能会有风险，是否继续',
              confirmText:'继续请求',
              cancelText:'再想想',
              cancelColor: '#81838F',
              confirmColor: '#FE6559',
              success(res){
                if(res.confirm){
                  wx.showLoading({
                    title: '请稍等',
                  })
                  wx.cloud.callFunction({
                    name: 'ask_applicant_confirm',
                    data: {
                      taskId: that.data.taskId,
                      applicantId: that.data.applicantId
                    },
                    success: res => {
                      if (res.result.errCode == 0) {
                        console.log("成功发起请求：最终确认")
                        wx.showModal({
                          title: '请求成功！',
                          content: '成功发起请求',
                          confirmText: "我知道了",
                          showCancel: false,
                          //点击“我知道了”
                          success(res) {
                            if (res.confirm) {
                              //向报名者发送一条消息
                              that.setData({
                                is_lock: false
                              })
                              var content = {
                                text: "请您确认是否参加"
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
                              }).catch(function (imError) {
                                // 发送失败
                                console.warn('sendMessage error:', imError);
                              })
                            }
                          }
                        })
                      } else {
                        console.error('传参')
                      }
                    },
                    fail: err => {
                      wx.showModal({
                        title: '云函数调用失败',
                        confirmText: "我知道了",
                        showCancel: false,
                      })
                      console.error('云函数调用失败', err)
                    },
                    complete: () => {
                      wx.hideLoading()
                    }
                  })
                }
              }
            })
          }
          else{
          wx.showLoading({
            title: '请稍等',
          })
          wx.cloud.callFunction({
            name: 'ask_applicant_confirm',
            data: {
              taskId: that.data.taskId,
              applicantId: that.data.applicantId
            },
            success: res => {
              if (res.result.errCode == 0) {
                console.log("成功发起请求：最终确认")
                wx.showModal({
                  title: '请求成功！',
                  content: '成功发起请求',
                  confirmText: "我知道了",
                  showCancel: false,
                  //点击“我知道了”
                  success(res) {
                    if (res.confirm) {
                      //向报名者发送一条消息
                      that.setData({
                        is_lock: false
                      })
                      var content = {
                        text: "请您确认是否参加"
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
                      }).catch(function (imError) {
                        // 发送失败
                        console.warn('sendMessage error:', imError);
                      })
                    }
                  }
                })
              } else {
                console.error('传参')
              }
            },
            fail: err => {
              wx.showModal({
                title: '云函数调用失败',
                confirmText: "我知道了",
                showCancel: false,
              })
              console.error('云函数调用失败', err)
            },
            complete: () => {
              wx.hideLoading()
            }
          })
        }
      }
      }
    })
  },

  // 发布者请求对方取匿
  onRequestFace: function () {
    var that = this
    wx.showModal({
      title: '请求匿名',
      content: '请求对方取消匿名?',
      cancelColor: '#81838F',
      confirmColor: '#FE6559',
      cancelText: '再想想',
      confirmText: '请求',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍等',
          })
          wx.cloud.callFunction({
            name: 'ask_cancel_anonymity',
            data: {
              taskId: that.data.taskId,
              applicantId: that.data.applicantId
            },
            success: res => {
              if (res.result.errCode == 0) {
                console.log("成功发起请求：最终确认")
                wx.showModal({
                  title: '请求成功！',
                  content: '成功发起请求',
                  confirmText: "我知道了",
                  showCancel: false,
                  //点击“我知道了”
                  success(res) {
                    if (res.confirm) {
                      //向报名者发送一条消息
                      that.setData({
                        is_lock: false
                      })
                      var content = {
                        text: "请您取消匿名"
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
                      }).catch(function (imError) {
                        // 发送失败
                        console.warn('sendMessage error:', imError);
                      })
                    }
                  }
                })
              } else {
                console.error('传参')
              }
            },
            fail: err => {
              wx.showModal({
                title: '云函数调用失败',
                confirmText: "我知道了",
                showCancel: false,
              })
              console.error('云函数调用失败', err)
            },
            complete: () => {
              wx.hideLoading()
            }
          })
        }
      }
    })
  },

  // 报名者拒绝最终确认
  onRefuseJoin: async function () {
    var that = this
    try {
      wx.showLoading({
        title: '请稍等',
      })
      var res = await wx.cloud.callFunction({
        name: 'accept_registration',
        data: {
          taskId: this.data.taskId,
          applicantId: this.data.applicantId,
          status: false
        },
      })
      wx.hideLoading()
      if (res.result.errCode == 0) {
        wx.showModal({
          title: '已拒绝',
          content: '您已拒绝确认参加活动',
          confirmText: "我知道了",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              //向发布者发送一条消息
              that.setData({
                is_lock: false
              })
              var content = {
                text: "抱歉，我拒绝参加"
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
              }).catch(function (imError) {
                // 发送失败
                console.warn('sendMessage error:', imError);
              })
              console.log('用户点击确定')
              that.setData({
                waitForConfirm: false
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
    } catch (err) {
      console.log(err)
    }
  },

  // 报名者同意最终确认
  onConfirmJoin: async function () {
    var that = this
    // 报名者确认参加活动
    try {
      wx.showLoading({
        title: '请稍等',
      })
      var res = await wx.cloud.callFunction({
        name: 'accept_registration',
        data: {
          taskId: this.data.taskId,
          applicantId: this.data.applicantId,
          status: true
        },
      })
      wx.hideLoading()
      if (res.result.errCode == 0) {
        wx.showModal({
          title: '确认成功',
          content: '您已成功确认参加活动',
          confirmText: "我知道了",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              //向发布者发送一条消息
              that.setData({
                is_lock: false
              })
              var content = {
                text: "好的，我确认参加"
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
              }).catch(function (imError) {
                // 发送失败
                console.warn('sendMessage error:', imError);
              })
              console.log('用户点击确定')
              that.setData({
                waitForConfirm: false
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
    } catch (err) {
      console.log(err)
    }
  },

  // 报名者拒绝取匿
  onRefuseFace: async function () {
    var that = this
    try {
      wx.showLoading({
        title: '请稍等',
      })
      var res = await wx.cloud.callFunction({
        name: 'cancel_anonymity',
        data: {
          taskId: this.data.taskId,
          applicantId: this.data.applicantId,
          status: false
        },
      })
      wx.hideLoading()
      if (res.result.errCode == 0) {
        wx.showModal({
          title: '已拒绝',
          content: '您已拒绝取消匿名',
          confirmText: "我知道了",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              //向发布者发送一条消息
              that.setData({
                is_lock: false
              })
              var content = {
                text: "抱歉，我拒绝取消匿名"
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
              }).catch(function (imError) {
                // 发送失败
                console.warn('sendMessage error:', imError);
              })
              console.log('用户点击确定')
              that.setData({
                waitForFace: false
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
    } catch (err) {
      console.log(err)
    }
  },

  // 报名者同意取匿
  onConfirmFace: async function () {
    var that = this
    // 报名者确认取匿
    try {
      wx.showLoading({
        title: '请稍等',
      })
      var res = await wx.cloud.callFunction({
        name: 'cancel_anonymity',
        data: {
          taskId: this.data.taskId,
          applicantId: this.data.applicantId,
          status: true
        },
      })
      wx.hideLoading()
      if (res.result.errCode == 0) {
        wx.showModal({
          title: '确认成功',
          content: '您已取消匿名',
          confirmText: "我知道了",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              //向发布者发送一条消息
              that.setData({
                is_lock: false
              })
              var content = {
                text: "好的，我已取消匿名"
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
              }).catch(function (imError) {
                // 发送失败
                console.warn('sendMessage error:', imError);
              })
              console.log('用户点击确定')
              that.setData({
                waitForFace: false,
                myAvatarUrl: app.globalData.userInfo.avatarUrl
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
    } catch (err) {
      console.log(err)
    }
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

    let tmp = options.conversationID.split('-')
    options.taskId = tmp[tmp.length - 1]

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
      subOpenId = options.applicantId
    } else {
      subOpenId = app.globalData.openId
    }

    // 接下来调用云函数查询这个报名者是否取匿、是否等待确认取匿、是否等待最终确认
    try {
      var res = await wx.cloud.callFunction({
        name: "get_applicant_status",
        data: {
          taskId: Number(options.taskId),
          applicantId: subOpenId
        }
      })
      console.log(Number(options.taskId))
      console.log(subOpenId)

      console.log(res)

      if (res.result.errCode == 0) {
        console.log(res)
        that.setData({
          applicantNickNameStatus: res.result.data.applicantNickNameStatus,
        })
        if (!this.data.asPub) {
          this.setData({
            waitForFace: res.result.data.askedCancelAnonymity,
            waitForConfirm: res.result.data.askedConfirm
          })
        }
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
      myAvatarUrl = app.globalData.userInfo.avatarUrl // 发布者总是要显示真实头像
      if (this.data.applicantNickNameStatus) { // 报名者已经取匿
        friendNickname = options.name
        friendAvatarUrl = options.avatar
      } else { // 报名者未取匿
        friendNickname = '匿名用户'
        friendAvatarUrl = 'cloud://cloud2-0g1qpznn8481602d.636c-cloud2-0g1qpznn8481602d-1307703676/images/ano.jpeg'
      }
    } else { // 如果当前用户是报名者
      friendAvatarUrl = options.avatar // 发布者总是要显示真实头像
      friendNickname = options.name // 并显示真实昵称
      if (this.data.applicantNickNameStatus) { // 报名者已经取匿
        myAvatarUrl = app.globalData.userInfo.avatarUrl
      } else {
        myAvatarUrl = 'cloud://cloud2-0g1qpznn8481602d.636c-cloud2-0g1qpznn8481602d-1307703676/images/ano.jpeg'
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
      applicantId: subOpenId,
      taskId: parseInt(options.taskId),
      firstApply:options.firstApply,
    })

    console.log(this.data)

    // 设置title，显示对方昵称
    wx.setNavigationBarTitle({
      title: friendNickname
    })

    that.pageScrollToBottom()
    
    //报名者报名时候给发布者发一条消息
    console.log(that.data)

    if(that.data.asPub==false && that.data.firstApply=='yes'){
      that.setData({
        firstApply:'no'
      })
      that.setData({
        is_lock: false
      })
      var content = {
        text: "您好，我想报名这个活动"
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
      }).catch(function (imError) {
        // 发送失败
        console.warn('sendMessage error:', imError);
      })
    }

    wx.event.on('testFunc', (e, newMsgForm) => {
      console.log('testFunc')
      var newMessage = app.globalData.newMsg[0]
      console.log(newMessage)
      if (that.data.asPub == false) {
        if (newMessage.payload.text == '请您取消匿名') {
          that.setData({
            waitForFace: true
          })
        }
        if (newMessage.payload.text == '请您确认是否参加') {
          that.setData({
            waitForConfirm: true
          })
        }
      }
      if (that.data.asPub == true) {
        if (newMessage.payload.text == '好的，我已取消匿名') {
          that.setData({
            applicantNickNameStatus: true,
            friendNickname: options.name,
            friendAvatarUrl: options.avatar
          })
          wx.setNavigationBarTitle({
            title: that.data.friendNickname
          })
        }
      }
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
    console.log(that.data.myMessages)
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
}, )