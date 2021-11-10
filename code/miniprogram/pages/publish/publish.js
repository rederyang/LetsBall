// pages/publish/publish.js
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
    sport_array: ['跑步', '网球', '篮球', '网球', '游泳', '击剑', '其他'],
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
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    if (!that.data.duration) {
      wx.showModal({
        title: '提示',
        content: '请输入活动时长~',
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
      return
    }
    if (!that.data.place) {
      wx.showModal({
        title: '提示',
        content: '请输入活动地点~',
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
      return
    }
    wx.showModal({
      title: '发布活动',
      content: '确定要发布这个活动了吗~',
      confirmColor: '#FF0A6B',
      cancelColor: '#81838F',
      cancelText: '再改改',
      confirmText: '发布！',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.pubAct()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  pubAct: function(e) {
    console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (this.data.time_init) {
      var myDate = new Date()
      var hour = myDate.getHours()
      var minu = myDate.getMinutes()
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

  }
})