//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //获取用户信息
    this.getUserInfo()
  },
  getUserInfo: function(usinfo){
    var that = this
    if(this.globalData.userInfo){
      typeof usinfo == 'function' && usinfo(this.globalData.userInfo)
    }else{
      // 登录
      wx.login({
        success: res => {
          wx.getUserInfo({
            success: function(res){
              that.globalData.userInfo = res.userInfo
              typeof usinfo == 'function' && usinfo(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})