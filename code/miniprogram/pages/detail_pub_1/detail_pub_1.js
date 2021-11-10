// pages/detail_pub_1/detail_pub_1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info_content: {},
    intro: "",
    chat_list: [],
    actid: "",
  },

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

  confirmAct: function(e) {
    console.log(e.openid)
    return
    wx.cloud.callFunction({
      name: 'get_hot_words',
      data: {
        openid: e.openid,
      },
      success: res => {
        if (res.result.errCode == 0) {
        } else {
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
  },

  onEdit: function(e) {
    return
    wx.navigateTo({
      url: '../publish/publish',
    })
  },

  cancelAct: function(e) {
    console.log('cancelAct')
  },

  // cancel activity
  onCancel: function(e) {
    var that = this
    wx.showModal({
      title: '取消活动',
      content: '您确定要取消这次活动吗？',
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      actid: options.actid,
    })
    console.log(this.data.actid)
    var that = this
    var data = {
      info_content: {
        day: '2021年9月10日',
        time: '11:00 - 13:00',
        place: '清华大学气膜馆',
        type: '击剑',
        level: '高手',
        offer_place: '是',
        offer_tool: '否',
        other: '男生优先；本科生优先',
      },
      intro: "这是一个面向高手开展的击剑活动，欢迎大家来找我练剑。",
      chat_list: [
        {
          name: "杨昆达",
          avatar: "/images/avatar.png",
          history: "想你的夜",
          noti: 3,
          time: "昨天11:30",
          openid: "123454321ykd",
        },
        {
          name: "张泽",
          avatar: "/images/avatar.png",
          history: "想你的夜",
          noti: 5,
          time: "昨天11:30",
          openid: "543212345zz",
        },
      ],
    }

    that.setData({
      info_content: data.info_content,
      intro: data.intro,
      chat_list: data.chat_list,
    })
    console.log(that.data.chat_list)
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