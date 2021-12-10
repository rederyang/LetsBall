// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: 'oxLgv45CH6C0OGbacZpkXfeBcWds',
  },

  _callFunc: function(name, data) {
    wx.cloud.callFunction({
      name: name,
      data: data,
      success: res => {
        console.log(res)
      },
    })
  },

  checkUser: function(e) {
    let name = 'check_user'
    let data = {
      openId: this.data.openId,
    }
    this._callFunc(name, data)
  },

  wechatSign: function(e) {
    var name = 'wechat_sign'
    var data = {
      nickName: 'modifyTest',
      openId: 'test',
      userPic: 'changePic',
      gender: 0,
      age: 29,
    }
    this._callFunc(name, data)
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