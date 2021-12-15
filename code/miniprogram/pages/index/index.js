// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  main: function(e) {
    wx.switchTab({
      url: '../main/main',
    })
  },

  mine: function(e) {
    wx.switchTab({
      url: '../mine/mine',
    })
  },

  activity: function(e) {
    wx.switchTab({
      url: '../activity/activity',
    })
  },

  toDetail: function(e) {
    wx.navigateTo({
      url: '../detail_pub_1/detail_pub_1',
    })
  },

  toMainMore: function(e) {
    wx.navigateTo({
      url: '../main-more/main-more',
    })
  },

  toNewDetail: function(e) {
    wx.navigateTo({
      url: '../detail/detail',
    })
  },

  detail_pub: function(e) {
    wx.navigateTo({
      url: '../detail_pub/detail_pub',
    })
  },

  detail_sub: function(e) {
    wx.navigateTo({
      url: '../detail_sub/detail_sub',
    })
  },

  detail1: function(e) {
    wx.navigateTo({
      url: '../detail_pub_1/detail_pub_1',
    })
  },

  detail2: function(e) {
    wx.navigateTo({
      url: '../detail_pub_2/detail_pub_2',
    })
  },

  detail3: function(e) {
    wx.navigateTo({
      url: '../detail_sub_1/detail_sub_1',
    })
  },

  detail4: function(e) {
    wx.navigateTo({
      url: '../detail_sub_2/detail_sub_2',
    })
  },

  detail5: function(e) {
    wx.navigateTo({
      url: '../detail_sub_3/detail_sub_3',
    })
  },

  publish: function(e) {
    wx.navigateTo({
      url: '../publish/publish',
    })
  },

  edit: function(e) {
    wx.navigateTo({
      url: '../edit/edit',
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})