// pages/main-more/main-more.js
Page({
  data: {
    keyWordSent: false,
    searchWord: "",
    step: 6,  // 每次刷新拉取任务数
    result: [],
    latestTasks: [],
    numLatestTask: 0
  },

  bindInputChange: function(e) {
    console.log(e)
    console.log('关键词输入', e.detail.value)
    this.setData({
      searchWord: e.detail.value
    })
    console.log(this.data.searchWord)
  },

  onTapDetail: function(event) {
    var taskId = event.currentTarget.dataset.taskid
    console.log("获取到任务id:" + String(taskId))

    // 默认以报名者身份跳转
    wx.navigateTo({
      url: '../detail_sub/detail_sub?taskId=' + taskId,
    })
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
        {
          test: 12
        },
        {
          test: 12
        },
        {
          test: 12
        },
        {
          test: 12
        },
        {},
        {},
        {},
        {},
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
    var that = this
    that._getLatestTask()
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
    console.log("已经到底了")
    // 搜索状态下不分页拉取
    if (this.data.keyWordSent) {
      return
    }
    // 非搜索状态下
    this._getLatestTask(this.data.numLatestTask, this.data.numLatestTask + this.data.step)
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

  // 获得最新任务
  _getLatestTask: async function (num1=0, num2=6) {  // 初始状态下拉取10个
    var that = this

    // 调用云函数
    try {
      var res = await wx.cloud.callFunction({
        name: 'get_latest_task_v2',
        data: {
          num1: num1,
          num2: num2
        },
      })
      if (res.result.errCode == 0) {  
        let latestTasks = res.result.data.tasks
        console.log(latestTasks)
        if (latestTasks == undefined) {
          latestTasks = []
        }
        latestTasks = latestTasks.map(
          item => {
            let startTime = new Date(item.startTime)
            let date = startTime.getFullYear() + '年' + (startTime.getMonth() + 1) + '月' + startTime.getDate() + '日'
            let time =  startTime.getHours() + '点' + startTime.getMinutes() + '分'
            let strTime = date + time + '开始'
            res = item
            res.startTime = strTime
            return res
          }
        )
        that.setData({
          latestTasks: that.data.latestTasks.concat(latestTasks),
          numLatestTask: that.data.numLatestTask + latestTasks.length
        })
      } else if (res.result.errCode == 2){
        console.log("已经没有更多活动了")
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