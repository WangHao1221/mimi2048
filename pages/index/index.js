//index.js

//获取应用实例
const app = getApp()

Page({
  data: {
    mydata: new Array(16),
    slidetime: 20,
    direction: 0,
    startPos: {},
    gameover: {
      status: true,
      message: 'game over'
    },
    userinfo: {}
  },
  onLoad: function(){
      //获取用户信息
      this.data.userinfo = app.globalData.userInfo
      //初始化数组
      this.data.mydata.fill(0)
      //随机生成2个数字
      this.randNum()
      this.randNum()
  },
  randNum: function(){
      var arr = []
      this.data.mydata.map(function(item,i){
        if(item == 0){
          arr.push(i)
        }
      })
      var num = Math.random()>0.5?4:2
      while (true) {
        var index = arr[Math.floor(Math.random() * arr.length)]
        console.log(this.data.mydata[index])
        if (this.data.mydata[index] != 0) {
          this.randNum();
        } else {
          break;
        }
      }
      this.changeData(index, num)
  },
  changeData: function(index,num){
    var changedData = {}
    changedData['mydata['+ index + ']'] = num
    //将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）
    this.setData(changedData) 
  },
  //开始滑动
  start: function(e){
    //touches数组对象获得屏幕上所有的touch，取第一个touch
    var touch = e.touches(0)
    //取第一个touch的坐标值
    this.data.startPos = {x:touch.pageX,y:touch.pageY,time:new Date()}
    this.data.direction = 0;
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '咪咪2048新玩法，赶紧来试试吧',
      path: '/page/index'
    }
  }
})
