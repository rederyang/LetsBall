// pages/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: "12:00",
    date: "2021-11-10",
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

  onEdit: function(e) {
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
        title: '确认修改？',
        confirmColor: '#FE6559',
        cancelColor: '#81838F',
        cancelText: '取消',
        confirmText: '确认',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '正在修改',
            })
            that.editAct()
          }
        }
      })
    }
  },

  editAct: function(e) {
    var that = this
    var startTime = that.data.date + ' ' + that.data.time + ' GMT+0800'

    console.log("发布任务，传入的参数：")
    // 传入参数
    var submitData = {
      taskId: Number(that.data.taskId),
      taskName: that.data.name,
      taskPic: "/images/cover.jpg",
      totalNum: 1,
      startTime: startTime,
      duration: that.data.duration,
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

    // 调用云函数修改
    wx.cloud.callFunction({
      name: 'modify_tasks',
      data: submitData,
      success: res => {
        console.log(res);
        if (res.result.errCode == 0) {
          console.log('调用成功')
          wx.hideLoading({
            success: () => {
              wx.navigateBack({
                delta: 1,
              })
            },
          })
        } else {
          wx.hideLoading({
            success: () => {
              wx.showModal({
                title: '修改失败，请重试或向开发者反馈',
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
            console.error('[云函数] [modify_tasks] 调用失败', err)
            wx.showModal({
              title: '修改失败',
              content: '可能存在网络问题',
              showCancel: false,
            })
          },
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options)

    // 获取任务的id，后面调用云函数需要
    this.setData({
      taskId: options.taskId
    })

    // 获取任务的原始值
    var infoContent = JSON.parse(options.info_content)

    console.log(infoContent)

    // 获取任务原本的时间
    var myDate = new Date(infoContent.startTime)
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

    // 获取任务原本的其他信息
    this.setData({
      level_idx: this.data.level_array.indexOf(infoContent.level),
      sport_idx: this.data.sport_array.indexOf(infoContent.type),
      intro: infoContent.details,
      name: infoContent.taskName,
      place: infoContent.place,
      duration: infoContent.duration,
      other: infoContent.otherRequirements,
      place_idx: infoContent.spaceProvided ? 1 : 0,
      tool_idx: infoContent.equipmentProvided ? 1 : 0,
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
    // console.log(this.data)
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