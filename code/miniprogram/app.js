//app.js
import TIM from 'tim-wx-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'cloud2-0g1qpznn8481602d',
      })
    }

    let options = {
      SDKAppID: 1400601709 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
    };
    var that =this
    // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
    let tim = TIM.create(options);  // SDK 实例通常用 tim 表示
    // 注册腾讯云即时通信 IM 上传插件
    tim.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});
    tim.setLogLevel(0);

    //监听事件
    tim.on(TIM.EVENT.SDK_READY, function(event) {
      console.log('SDK_READY')
      that.globalData.isImLogin = true
      wx.setStorageSync('isImLogin', true)
      // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
      // event.name - TIM.EVENT.SDK_READY
    });

    tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
      console.log('收到消息')
      // 若同时收到多个会话 需要根据conversationID来判断是哪个人的会话
      var msgarr = []
      var newMsgForm = event.data[0].conversationID // 定义会话键值
      console.log(msgarr[newMsgForm])
      if(msgarr[newMsgForm]) {
        msgarr[newMsgForm].push(event.data[0])
      } else {
        msgarr[newMsgForm] = [event.data[0]]
      }
      console.log(msgarr[newMsgForm])
      that.globalData.myMessages = msgarr
      // 这里引入了一个监听器 （因为小程序没有类似vuex的状态管理器 当global里面的数据变化时不能及时同步到聊天页面 因此 这个监听器可以emit一个方法 到需要更新会话数据的页面 在那里进行赋值）
      wx.event.emit('testFunc',that.globalData.myMessages,newMsgForm) // 详情页的函数
      wx.event.emit('conversation') // 会话列表的监听函数
      // 未读消息数
      var number = wx.getStorageSync('number_msg') || 0
      // 根据isRead判断是否未读 否则加1
      if(!event.data[0].isRead) {
        number = number++
      }
      console.log(number)
      wx.setStorageSync('number_msg', number)
      // 如果有未读数 需要设置tabbar的红点标志 反之去掉红点标志
      if(number>0) {
        wx.setTabBarBadge({
          index: 2,
          text: number.toString()
        })
      } else {
        wx.hideTabBarRedDot({
          index: 2
        })
      }
      // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
      // event.name - TIM.EVENT.MESSAGE_RECEIVED
      // event.data - 存储 Message 对象的数组 - [Message]
    })

    tim.on(TIM.EVENT.MESSAGE_REVOKED, function(event) {
      // 收到消息被撤回的通知
      // event.name - TIM.EVENT.MESSAGE_REVOKED
      // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
    });
  
    tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function(event) {
      // 更新当前所有会话列表
      // 注意 这个函数在首次点击进入会话列表的时候也会执行 因此点击消息 可以显示当前的未读消息数（unreadCount表示未读数）
      console.log('发送了消息')
      console.log('更新当前所有会话列表')
      var conversationList = event.data
      var number =  0
      conversationList.forEach(e => {
        number = number + e.unreadCount
      })
      wx.setStorageSync('conversationList', conversationList)
      console.log(conversationList)
      // if(number>0) {
      //   wx.setTabBarBadge({
      //     index: 2,
      //     text: number.toString()
      //   })
      // } else {
      //   wx.hideTabBarRedDot({
      //     index: 2
      //   })
      // }
      // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
      // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
      // event.data - 存储 Conversation 对象的数组 - [Conversation]
    });
  
    tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function(event) {
      // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
      // event.name - TIM.EVENT.GROUP_LIST_UPDATED
      // event.data - 存储 Group 对象的数组 - [Group]
    });
  
    tim.on(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, function(event) {
      // 收到新的群系统通知
      // event.name - TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED
      // event.data.type - 群系统通知的类型，详情请参见 GroupSystemNoticePayload 的 operationType 枚举值说明
      // event.data.message - Message 对象，可将 event.data.message.content 渲染到到页面
    });
  
    tim.on(TIM.EVENT.PROFILE_UPDATED, function(event) {
      // 收到自己或好友的资料变更通知
      // event.name - TIM.EVENT.PROFILE_UPDATED
      // event.data - 存储 Profile 对象的数组 - [Profile]
    });
  
    tim.on(TIM.EVENT.BLACKLIST_UPDATED, function(event) {
      // 收到黑名单列表更新通知
      // event.name - TIM.EVENT.BLACKLIST_UPDATED
      // event.data - 存储 userID 的数组 - [userID]
    });
  
    tim.on(TIM.EVENT.ERROR, function(event) {
      // 收到 SDK 发生错误通知，可以获取错误码和错误信息
      // event.name - TIM.EVENT.ERROR
      // event.data.code - 错误码
      // event.data.message - 错误信息
    });
  
    tim.on(TIM.EVENT.SDK_NOT_READY, function(event) {
      // wx.setStorageSync('isImLogin', false)
      console.log('SDK_NOT_READY')
      that.globalData.isImLogin = false
      wx.setStorageSync('isImLogin', false)
      // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
      // event.name - TIM.EVENT.SDK_NOT_READY
    });
  
    tim.on(TIM.EVENT.KICKED_OUT, function(event) {
      console.log('KICKED_OUT')
      wx.setStorageSync('isImLogin', false)
      that.globalData.isImLogin = false
      // 收到被踢下线通知
      // event.name - TIM.EVENT.KICKED_OUT
      // event.data.type - 被踢下线的原因，例如:
      //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
      //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
      //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢
    })
    that.globalData.tim=tim

   
    
    // 获取openId
    if (this.globalData.openId == undefined) {
      wx.cloud.callFunction({
        name: 'get_openid',
        data: {},
        success: res => {
          if (res.result.errCode == 0) {
            console.log('获取openId成功。')
            this.globalData.openId = res.result.data.openId
            console.log('openId: ', this.globalData.openId)
            
            // 静默注册
            wx.cloud.callFunction({
              name: 'check_user',
              data: {
                openId: this.globalData.openId,
              },
              success: res => {
                console.log(res)
                if (res.result.errCode == 0) {
                  if (res.result.data.boolexist == 1) {
                    console.log('查有此人。')
                    this.globalData.logged = true
                    this.globalData.user = res.result.data.user
                    this.globalData.userInfo.avatarUrl = this.globalData.user.userPic
                    this.globalData.userInfo.nickName = this.globalData.user.nickName
                  } else {
                    console.log('查无此人。')
                  }
                } else {
                  console.error('通过openid查用户失败。', err)
                }
              },
              fail: err => {
                console.error('查用户失败，离谱。', err)
              }
            })
          } else {
            console.log('获取openId失败，传参有问题。')
          }
        },
        fail: err => {
          console.error('获取openId失败，离谱。', err)
        }
      })
    } else {
      console.log('已经获得openid')
    }  
  },
  globalData :{
    tim:'',
    isImLogin:false,
    msgList:[],
    myMessages:new Map(),
    accountTid:'',
    isDetail:true,
    logged: false,
    userInfo: {
      avatarUrl: 'cloud://cloud2-0g1qpznn8481602d.636c-cloud2-0g1qpznn8481602d-1307703676/images/ano.png',
      nickName: '点击登录',
      gender: 1,
      age: 18,
    },
    user: {},
    taskSub: {},  // 当前用户报名的所有活动
    taskPub: {},  // 当前用户发布的所有活动
  }

})

