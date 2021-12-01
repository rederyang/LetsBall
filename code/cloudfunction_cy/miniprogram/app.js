import TIM from './static/tim-wx'
import TIMUploadPlugin from './static/tim-upload-plugin'
import logger from './utils/logger'
import { SDKAPPID } from './debug/GenerateTestUserSig'
App({
  onLaunch: function () {
    wx.setStorageSync('islogin', false)
    wx.$TUIKit = TIM.create({ SDKAppID: SDKAPPID })
    wx.$TUIKit.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })
    wx.$TUIKitTIM = TIM
    wx.$TUIKitEvent = TIM.EVENT
    wx.$TUIKitVersion = TIM.VERSION
    wx.$TUIKitTypes = TIM.TYPES
    // 监听系统级事件
    wx.$TUIKit.on(wx.$TUIKitEvent.SDK_NOT_READY, this.onSdkNotReady)
    wx.$TUIKit.on(wx.$TUIKitEvent.KICKED_OUT, this.onKickedOut)
    wx.$TUIKit.on(wx.$TUIKitEvent.ERROR, this.onTIMError)
    wx.$TUIKit.on(wx.$TUIKitEvent.NET_STATE_CHANGE, this.onNetStateChange)
    wx.$TUIKit.on(wx.$TUIKitEvent.SDK_RELOAD, this.onSDKReload)
    wx.$TUIKit.on(wx.$TUIKitEvent.SDK_READY, this.onSDKReady)
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'cloud2-0g1qpznn8481602d',
      })
    }

    this.globalData = {
      logged: false,
      userInfo: {
        avatarUrl: '/images/ano.png',
        nickName: '点击登录',
        gender: 1,
        age: 18,
      },
      user: {},
      taskSub: {},  // 当前用户报名的所有活动
      taskPub: {},  // 当前用户发布的所有活动
      SDKAppID:SDKAPPID
    }
    
    // 获取openId
    if (this.globalData.openId == undefined) {
      wx.cloud.callFunction({
        name: 'get_openid',
        data: {},
        success: res => {
          if (res.result.errCode == 0) {
            console.log('获取openId成功。')
            this.globalData.openId = res.result.data.openId
            console.log('openId: ', this.globalData.openId)
            
            // 静默注册
            wx.cloud.callFunction({
              name: 'check_user',
              data: {
                openId: this.globalData.openId,
              },
              success: res => {
                console.log(res)
                if (res.result.errCode == 0) {
                  if (res.result.data.boolexist == 1) {
                    console.log('查有此人。')
                    this.globalData.logged = true
                    this.globalData.user = res.result.data.user
                    this.globalData.userInfo.avatarUrl = this.globalData.user.userPic
                    this.globalData.userInfo.nickName = this.globalData.user.nickName
                  } else {
                    console.log('查无此人。')
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
    }  
  },
  onSDKReady() {

  },
  onSdkNotReady() {

  },

  onKickedOut() {
    wx.showToast({
      title: '您被踢下线',
      icon: 'error',
    })
    wx.navigateTo({
      url: './pages/TUI-Login/login',
    })
  },

  onTIMError() {
  },

  onNetStateChange() {

  },

  onSDKReload() {

  },





})

