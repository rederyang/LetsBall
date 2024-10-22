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

  deleteTask: function(e) {
    let name = 'delete_task'
    let data = {
      taskId: 19,
    }
    this._callFunc(name, data)
  },

  signUpForTask: function(e) {
    let name = 'sign_up_for_task'
    let data = {
      taskId: 80,
      applicantId: this.data.openId,
      applicantGender: 0,
      applicantNickName: 'Hippo',
      applicantUserPic: 'test',
      applicantAge: 18,
    }
    this._callFunc(name, data)
  },

  quitCommitedTask: function(e) {
    let name = 'quit_commited_task'
    let data = {
      taskId: 19,
      applicantId: this.data.openId,
    }
    this._callFunc(name, data)
  },
  
  acceptRegistration: function(e) {
    let name = 'accept_registration'
    let data = {
      taskId: 19,
      applicantId: this.data.openId,
    }
    this._callFunc(name, data)
  },

  getCurrentTaskTime: function(e) {
    let name = 'get_current_task_time'
    let data = {
      taskId: 100,
    }
    this._callFunc(name, data)
  },

  getTaskDetail: function(e) {
    let name = 'get_task_detail'
    let data = {
      taskId: [19, 100],
    }
    this._callFunc(name, data)
  },

  getLatestTask: function(e) {
    let name = 'get_latest_task'
    let data = {
      
    }
    this._callFunc(name, data)
  },

  getApplicantStatus: function(e) {
    let name = 'get_applicant_status'
    let data = {
      taskId: 100,
      applicantId: this.data.openId,
    }
    this._callFunc(name, data)
  },

  cancelAnonymity: function(e) {
    let name = 'cancel_anonymity'
    let data = {
      taskId: 69,
      applicantId: this.data.openId,
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