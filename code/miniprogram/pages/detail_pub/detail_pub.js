// pages/detail_pub/detail_pub.js
import { setTokenStorage } from '../../utils/token'
import logger from '../../utils/logger'
import { genTestUserSig } from '../../debug/GenerateTestUserSig'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: '',
    info_content: {},
    intro: "",
    chatList: [],
    subInfo: {},
    confirmed: false,
    applied: false,
    chatId: '',
  },
  // 确认报名者
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

  // 调用云函数完成确认环节
  confirmAct: function(e) {
    var that = this
    console.log(e.openid)
    wx.cloud.callFunction({
      name: 'accept_registration',
      data: {
        applicantId: e.openid,
        taskId: that.data.taskId,
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log("成功完成单向确认")
          wx.showModal({
            title: '确认成功！',
            content: res.result.errMsg,
            confirmText: "我知道了",
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.loadData()
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          console.error('传参')
        }
      },
      fail: err => {
        wx.showModal({
          title: '确认成功！',
          confirmText: "我知道了",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.loadData()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        console.error('[accept_registration] 调用失败', err)
      }
    })
    // FAKE action
    that.loadData()
  },

  // 跳转至编辑界面
  onEdit: function(e) {
    wx.showModal({
      title: '本功能开发中，敬请期待~',
      confirmText: "好吧",
      showCancel: false,
    })

    return
    console.log("点击编辑键")
    var info_content= JSON.stringify(this.data.info_content);
    wx.navigateTo({
      url: '../edit/edit?info_content=' + info_content + "&taskId=" + this.data.taskId,
    })
  },

  // 取消活动
  onCancel: function(e) {
    var that = this
    wx.showModal({
      title: '取消活动',
      content: that.data.confirmed ? '目前活动已满员，确认取消？' : '您确定要取消这次活动吗？',
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

  // 调用云函数完成活动取消操作
  cancelAct: function(e) {
    var that = this

    // 根据目前是否确认选择不同的取消函数
    var funcName = ""
    if (that.data.confirmed) {
      funcName = 'delete_uncommitted_task'
    } else {
      funcName = 'delete_task'
    }    

    wx.cloud.callFunction({
      name: funcName,
      data: {
        taskId: that.data.taskId
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log("成功取消活动")
          wx.showModal({
            title: '活动已取消',
            confirmText: "我知道了",
            confirmColor: '#FE6559',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateBack({  // 返回上一级
                  delta: 1,
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
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
      },
      fail: err => {
        console.error('[云函数] [get_hot_words] 调用失败', err)
      }
    })
  },

  // 获取关于活动的信息
  loadData: function () {
    var that = this

    // 这里需要调用云函数获取活动信息
    wx.cloud.callFunction({
      name: "get_task_detail",
      data: {
        taskId: [that.data.taskId],
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log(res)
          console.log("成功获取活动详情")
          that.setData({
            task: res.result.data.tasks[0]
          })
          // 修改时间
          let myDate = new Date(that.data.task.startTime)
          let hour = myDate.getHours()
          let minu = myDate.getMinutes()
          if (hour < 10) {
            var str_hour = '0' + hour
          } else {
            var str_hour = hour
          }
          if (minu < 10) {
            var str_minu = '0' + minu
          } else {
            var str_minu = minu
          }
          this.setData({
            time: str_hour + ':' + str_minu,
            date: myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
          })
        } else {
          console.log('传参')
        }
      },
      fail: err => {
        console.error('[云函数] [get_task_detail] 调用失败', err)
      }
    })

    // 这里需要调用云函数获取报名者信息
    wx.cloud.callFunction({
      name: "get_task_applicants",
      data: {
        taskId: [that.data.taskId]
      },
      success: res => {
        if (res.result.errCode == 0) {
          console.log(res)
          // 首先需要不是空的
          if (res.result.data.info.length > 0) {
            that.setData({
              applied: true,
              applicantsInfo: res.result.data.info,
            })
            let chatList = that.data.applicantsInfo.map(
              item => {
                return {
                  name: item.applicantNickName,
                  avatar: item.applicantUserPic,
                  history: "报名",
                  noti: 1,
                  time: "最近",
                  openId: item.applicantId,
                }
              }
            )
            console.log(chatList)
            that.setData({
              chatList: chatList,
            })
            // 其次需要没有被确认
            if (that.data.applicantsInfo[0].isFull) {
              that.setData({
                confirmed: true
              })
              // 看看确认的人
              for (let i = 0; i < that.data.applicantsInfo.length; i++) {
                if (that.data.applicantsInfo[i].applicantStatus) {
                  that.setData({
                    subInfo: {
                      nickName: that.data.applicantsInfo[i].applicantNickName,
                      openId: that.data.applicantsInfo[i].applicantId,
                      gender: 1,
                      userPic: that.data.applicantsInfo[i].applicantUserPic,
                    }
                  })
                  break
                }
              }
            }
          }
        } else {
          console.log('传参')
        }
      },
      fail: err => {
        console.error('[云函数] [get_task_applicants] 调用失败', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const chatId = app.globalData.openId+'-'+parseInt(options.taskId)
    const userSig = genTestUserSig(chatId).userSig
    logger.log(`TUI-login | login  | userSig:${userSig} userID:${chatId}`)
    this.setData({
      taskId: parseInt(options.taskId),
      chatId: chatId
    })
    console.log(chatId)
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
    this.loadData()
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