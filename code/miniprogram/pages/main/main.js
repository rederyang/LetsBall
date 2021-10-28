// pages/main/main.js
Page({
  data: {
    status: 0,
    images: [ '/images/test1.jpg', '/images/test2.jpg'],
    tabs: [
      {
        title: '最新活动'
      },
      {
        title: '热门活动'
      }],
    activeTab: 0,
    activities: [
      {
        picture_url: "/images/test3.jpg",
        title: '足球运动',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
      },
      {
        picture_url: "/images/test3.jpg",
        title: '足球运动',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
      },
      {
        picture_url: "/images/test3.jpg",
        title: '足球运动',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
      },
      {
        picture_url: "/images/test3.jpg",
        title: '足球运动',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
      },
      {
        picture_url: "/images/test2.jpg",
        title: '足球运动',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  onTabClick(e) {
    const index = e.detail.index
    this.setData({ 
      activeTab: index 
    })

    console.log(index)
  },

  onChange(e) {
    const index = e.detail.index
    this.setData({ 
      activeTab: index 
    })
  },
  handleClick(e) {
    wx.navigateTo({
      url: './webview',
    })
  },

  onShareAppMessage() {
  }

})