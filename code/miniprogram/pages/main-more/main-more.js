// pages/main-more/main-more.js
Page({
  data: {
    keyWordSent: false,
    searchWord: ""
  },

  bindInputChange: function(e) {
    console.log(e)
    console.log('关键词输入', e.detail.value)
    this.setData({
      searchWord: e.detail.value
    })
    console.log(this.data.searchWord)
  },

  onTapSearch: function(event) {
    var that = this
    //TODO
    // 调用云函数进行搜索

    console.log("点击搜索按钮")

    // 检查搜索关键字是否为空
    if (!that.data.searchWord) {
      wx.showModal({
        title: '提示',
        content: '请输入搜索关键字~',
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
    // that._search(that.data.searchWord)

    // FAKE DATA
    that.setData({
      result: [
        {}
      ],
    }
    )

    // 变更状态，显示取消键
    that.setData({
      keyWordSent: true  
    })
  },

  onTapCancel: function(evnet) {
    // 改变状态不显示取消按钮
    this.setData({
      keyWordSent: false
    })
    // 清空已有的搜索结果
    this.setData({
      result: []
    })
    // 清空输入框的内容
    this.setData({
      searchWord: ""
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("test")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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

  _search: async function(keyWord) {
    // 获取搜索到的活动
    try {
      res = await wx.cloud.callFunction({
        name: 'TODO',
        data: {
          // TODO keyWord
        },
      })
      if (res.result.errCode == 0) { 
        // TODO
        let taskPub = res.result.data.publishedTasks
        if (taskPub == undefined) {
          taskPub = []
        }
        that.setData({
          // TODO
        })
      } else {
        wx.showModal({
          title: '抱歉，出错了呢~',
          content: res.result.errMsg,
          confirmText: "我知道了",
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
    } catch (err) {
      console.log(err)
    }
  },
})