//app.js
App({
  onLaunch: function () {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        that.globalData.userInfo = res.userInfo
      }, fail: function (err) { }
    })
  },
  globalData: {
    userInfo: null
  }
})