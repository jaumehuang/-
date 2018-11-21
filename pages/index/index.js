//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    miInfo:"",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //发送模板消息
  formSubmit:function(e){
    let $self= this;
    var formId=e.detail.formId;
     //获取getAccessToken
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx79c0d9fdc73059cd&secret=f54fbe32721aa8fcdb99afadfa690c3d', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      method:"GET",
      success(res) {
        console.log(res.data)
        var access_token = res.data.access_token;
        //发送模板消息
        wx.request({
          url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + access_token, //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json' // 默认值
          },
          data:{
            touser: $self.data.miInfo.openid,
            template_id:"iqXNN_yi3JQGEhPIlW7IMrWVRotYCsYCOWqTv1IheB4",
            page:"",
            form_id: formId,
            data:{
              keyword1:{
                value:"测试标题"
              },
              keyword2: {
                value: "2018-10-12"
              },
              keyword3: {
                value: "违规内容"
              }
            },
            emphasis_keyword:""
          },
          method: "POST",
          success(res) {
             if(res){
                wx.showToast({
                  title: '模板发送成功',
                })
             }
          }
        })
      }
    })
    
  },
 
  onLoad: function () {
    var $self=this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      
    } else if (this.data.canIUse){
      
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.login({
          success(res) {
            if (res.code) {
              console.log(res)
              //发起网络请求
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session',
                method:"GET",
                data: {
                  js_code: res.code,
                  appid:"wx79c0d9fdc73059cd",
                  grant_type:"authorization_code",
                  secret:"f54fbe32721aa8fcdb99afadfa690c3d"
                },
                success:function(res){
                  console.log(res)
                  $self.setData({
                    miInfo:res.data
                  })
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
         
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
