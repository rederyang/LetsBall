// pages/detail_sub/detail_sub.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info_content: {},
    intro: "",
    chat_list: [],
    pub_info: {},
    confirmed: false,
    confirmedByUser: false,
  },

  // 用户报名之后的动作
  applyAct: function(e) {
    console.log('用户点击报名')
    wx.showModal({
      title: '报名成功',
      content: '请等待发起者的确认',
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
  },

  // 开启聊天（这里当作确认）
  onChat: function(e) {
    var that = this
    wx.showModal({
      title: '报名活动',
      content: '确定要报名这个活动吗~',
      confirmColor: '#FF0A6B',
      cancelColor: '#81838F',
      cancelText: '再想想',
      confirmText: '报名！',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.applyAct()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 调用云函数进行取消
  cancelAct: function(e) {
    console.log('cancelAct')
  },

  // 取消
  onCancel: function(e) {
    var that = this
    wx.showModal({
      title: '取消活动',
      content: '目前活动已确认，直接取消会记违约一次，确认取消？',
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
          avatar: "/images/kunda.png",
          history: "约吗",
          noti: 3,
          time: "今天9:30",
        },
        {
          name: "张泽",
          avatar: "/images/avatar.png",
          history: "想你的夜",
          noti: 5,
          time: "昨天11:30",
        },
      ],
      pub_info: {
        name: "张泽",
        avatar: "/images/avatar.png",
        intro: "男；医学院；大四；",
        sport: "足球",
        fame: "优质用户"
      }
    }

    that.setData({
      info_content: data.info_content,
      intro: data.intro,
      chat_list: data.chat_list,
      pub_info: data.pub_info,
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