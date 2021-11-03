// pages/detail_pub_2/detail_pub_2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info_content: {},
    intro: "",
    chat_list: [],
    subs_info: {},
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
      subs_info: {
        name: "杨昆达",
        avatar: "/images/kunda.png",
        intro: "男；医学院；大四；",
        sport: "足球",
        fame: "一般用户"
      }
    }

    that.setData({
      info_content: data.info_content,
      intro: data.intro,
      chat_list: data.chat_list,
      subs_info: data.subs_info,
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