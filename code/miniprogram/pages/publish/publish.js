// pages/publish/publish.js
import LibGenerateTestUserSig from '../../debug/lib-generate-test-usersig-es.min.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: "12:00",
    date: "2021-11-10",
    time_init: true,
    level_array: ['初学', '中级', '进阶'],
    level_idx: 0,
    sport_array: ['跑步', '游泳', '网球', '篮球', '足球', '羽毛球', '飞盘', '乒乓球', '台球', '棒球', '击剑', '橄榄球', '板球', '桥牌', '射击', '其他'],
    sport_idx: 0,
    intro: "",
    name: "",
    duration: "",
    other: "",
    place: "",
    place_idx: 0,
    tool_idx: 0,
    if_array: ['否', '是']
  },

  bindNameChange: function(e) {
    console.log('名称picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      name: e.detail.value
    })
    console.log(this.data.name)
  },

  bindDurationChange: function(e) {
    console.log('持续picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      duration: e.detail.value
    })
  },

  bindPlaceChange: function(e) {
    console.log('地点picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      place: e.detail.value
    })
  },

  bindDateChange: function(e) {
    console.log('日期picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange: function(e) {
    console.log('时间picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },

  bindSportChange: function(e) {
    console.log('运动picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sport_idx: e.detail.value
    })
  },

  bindLevelChange: function(e) {
    console.log('水平picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      level_idx: e.detail.value
    })
  },

  bindOtherChange: function(e) {
    console.log('其他picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      other: e.detail.value
    })
  },

  bindOfferPlace: function(e) {
    console.log('提供场地picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      place_idx: e.detail.value
    })
  },

  bindOfferTool: function(e) {
    console.log('提供场地picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      tool_idx: e.detail.value
    })
  },

  bindIntroChange: function(e) {
    console.log('介绍picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      intro: e.detail.value
    })
  },

  onPub: function(e) {
    var that = this
    if (!that.data.name) {
      wx.showModal({
        title: '提示',
        content: '请输入活动名称~',
        confirmText: "我知道了",
        confirmColor: '#FE6559',
        showCancel: false,
      })
      return
    } else if (that.data.name.length > 8) {
      wx.showModal({
        title: '提示',
        content: '活动名称太长啦~',
        confirmText: "我知道了",
        confirmColor: '#FE6559',
        showCancel: false,
      })
      return
    } else if (!that.data.place) {
      wx.showModal({
        title: '提示',
        content: '请输入活动地点~',
        confirmText: "我知道了",
        confirmColor: '#FE6559',
        showCancel: false,
      })
      return
    } else if (that.data.place.length > 12) {
      wx.showModal({
        title: '提示',
        content: '活动地点太长啦，最多十二字~',
        confirmText: "我知道了",
        confirmColor: '#FE6559',
        showCancel: false,
      })
      return
    } else if (!parseInt(that.data.duration) || parseInt(that.data.duration) < 30 || parseInt(that.data.duration) > 200) {
      wx.showModal({
        title: '提示',
        content: '请正确填写活动持续时长~',
        confirmText: "我知道了",
        confirmColor: '#FE6559',
        showCancel: false,
      })
      return
    } else {
      wx.showModal({
        title: '发布活动',
        content: '确定要发布这个活动了吗~',
        confirmColor: '#FE6559',
        cancelColor: '#81838F',
        cancelText: '再改改',
        confirmText: '发布',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.showLoading({
              title: '正在发布',
            })
            that.pubAct()
          }
        }
      })
    }
  },

  // 调用云函数进行活动发布
  pubAct: function(e) {
    console.log("发布任务")
    console.log(this.data)
    var that = this
    var startTime = that.data.date + ' ' + that.data.time + ' GMT+0800'
    // var startTime = that.data.date + ' ' + that.data.time

    console.log("传入的参数：")
    // 传入参数
    var submitData = {
      taskName: that.data.name,
      taskPic: "cloud://cloud2-0g1qpznn8481602d.636c-cloud2-0g1qpznn8481602d-1307703676/images/cover.jpg",
      publisher: app.globalData.userInfo.nickName,
      publisherId: app.globalData.openId,
      totalNum: 1,
      startTime: startTime,
      duration: Number(that.data.duration),
      place: that.data.place,
      level: that.data.level_array[that.data.level_idx],
      type: that.data.sport_array[that.data.sport_idx],
      details: that.data.intro,
      spaceProvided: that.data.place_idx == 1,
      equipmentProvided: that.data.tool_idx == 1, 
      signProvided: false,
      otherRequirements: that.data.other
    }
    console.log(submitData)
    var taskID;

    wx.cloud.callFunction({
      name: 'add_tasks',
      data: submitData,
      success: res => {
        console.log(res);
        if (res.result.errCode == 0) {
          taskID = res.result.data.taskId
          wx.hideLoading({
            success: () => {
              //在IM中注册账号
          const _SDKAPPID = 1400601709;
          const _SECRETKEY = 'a9e99edf47724b3f1d931709760e5288f0e826a752b5705f45e4cefe3546b15a';
          var EXPIRETIME = 604800;
          var SDKAPPID = _SDKAPPID;
          var SECRETKEY = _SECRETKEY;
          var userID = app.globalData.openId + '-' + taskID;
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
            setTimeout(() => {
              //拉取会话列表
              that.initRecentContactList()
            }, 1000);
          })
              wx.showModal({
                title: '发布成功!',
                confirmText: "我知道了",
                showCancel: false,
                confirmColor: '#FE6559',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    let promise = tim.logout();
                    promise.then(function (imResponse) {
                      console.log(imResponse.data); // 登出成功
                      app.globalData.isImLogin = false
                    }).catch(function (imError) {
                      console.warn('logout error:', imError);
                    });
                    wx.navigateBack({
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
              wx.showModal({
                title: '发布失败',
                content: res.result.errMsg,
                confirmText: "我知道了",
                showCancel: false,
              })
            },
          })
        }
      },
      fail: err => {
        wx.hideLoading({
          success: () => {
            console.error('[云函数] [wechat_sign] 调用失败', err)
            wx.showModal({
              title: '调用失败',
              content: '请检查云函数是否已部署',
              showCancel: false,
            })
          },
        })
      }
    })
  },

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
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (this.data.time_init) {
      var myDate = new Date()
      var hour = myDate.getHours()
      var minu = myDate.getMinutes()
      if (hour < 23) {
        hour += 1
      }
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
    }
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
    console.log(this.data)
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

  // 私有函数
})