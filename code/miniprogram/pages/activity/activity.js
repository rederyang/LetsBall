// pages/activity/activity.js
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
    activities: []
  },

  // 点击我发布的
  onTapPub: function (event) {
    this.setData({
      status: 0
    })
  },

  // 点击我订阅的
  onTapSub: function (event) {
    this.setData({
      status: 1
    })
  },

  // 点击增加按钮
  onTapAdd: function (event) {
    console.log('点击增加按钮')
    // TODO
    // wx.navigateTo({
    //   url: 'addPage',
    //   events: {
    //     // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
    //     acceptDataFromOpenedPage: function(data) {
    //       console.log(data)
    //     },
    //   },
    //   success: function(res) {
    //     // 通过eventChannel向被打开页面传送数据
    //     res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
    //   }
    // })
  },

  onTapDetail(event) {
    console.log("点击详情")
    var actid = event.currentTarget.dataset.actid
    var confirmed = event.currentTarget.dataset.confirmed
    if (this.data.status == 0 && !confirmed) {
      wx.navigateTo({
        url: '../detail_sub_1/detail_sub_1?actid=' + actid,
      })
    } else if (this.data.status == 0 && confirmed){
      wx.navigateTo({
        url: '../detail_sub_2/detail_sub_2?actid=' + actid,
      })
    } else if (this.data.status == 1 && !confirmed){
      wx.navigateTo({
        url: '../detail_pub_1/detail_pub_1?actid=' + actid,
      }) }else {
      wx.navigateTo({
        url: '../detail_pub_2/detail_pub_2?actid=' + actid,
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 这里将调用云函数获得最新和最热活动
    var activitiesSub =  [
      {
        picture_url: "/images/test3.jpg",
        title: '足球运动',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
        confirmed: true,
        actid: "1234567",
      },
      {
        picture_url: "/images/test3.jpg",
        title: '足球运动',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
        confirmed: true,
        actid: "1234567",
      },
      {
        picture_url: "/images/test3.jpg",
        title: '足球运动',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
        confirmed: false,
        actid: "1234567",
      },
      {
        picture_url: "/images/test3.jpg",
        title: '足球运动',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
        confirmed: false,
        actid: "1234567",
      },
      {
        picture_url: "/images/test2.jpg",
        title: '足球运动',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
        confirmed: false,
        actid: "1234567",
      },
    ]
    var activitiesPub =  [
      {
        picture_url: "/images/test4.jpg",
        title: '击剑',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
        confirmed: false,
        actid: "1234567",
      },
      {
        picture_url: "/images/test3.jpg",
        title: '击剑',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
        confirmed: false,
        actid: "1234567",
      },
      {
        picture_url: "/images/test4.jpg",
        title: '击剑',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
        confirmed: false,
        actid: "1234567",
      },
      {
        picture_url: "/images/test4.jpg",
        title: '击剑',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
        confirmed: true,
        actid: "1234567",
      },
      {
        picture_url: "/images/test2.jpg",
        title: '击剑',
        loc: "氣膜館",
        time: "10月1日",
        leader: "令狐沖",
        confirmed: true,
        actid: "1234567",
      },
    ]
    this.setData({
      status: 0,
      activitiesPub: activitiesPub,
      activitiesSub: activitiesSub,
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
    if (this.data.status == 0) {
      this.setData({
        activities: this.data.newActivities
      })
      console.log("当前状态是0")
    } else {
      this.setData({
        activities: this.data.hotActivities
      })
      console.log("当前状态是1")
    }
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