//index.js

//获取应用实例
const app = getApp()

Page({
  data: {
    mydata: new Array(16),
    direction: 0,
    startPos: {},
    userinfo: {},
    score:0,
    bestScore:0
  },
  onLoad: function(){
      //获取用户信息
      this.data.userinfo = app.globalData.userInfo
      if (this.data.userinfo && wx.getStorageSync(this.data.userinfo.nickName)){
        //如果获取到用户信息，则取出对应的最佳成绩
        var sessionScore = wx.getStorageSync(this.data.userinfo.nickName)
        this.setData({
          bestScore: sessionScore
        })
      }
      //初始化数组
      this.data.mydata.fill(0)
      //随机生成2个数字
      this.randNum()
      this.randNum()
      //初始化分数
      this.updateScore(this.data.score)
  },
  updateScore: function(score){
      this.setData({
        score:score
      })
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
        if (index>=0 && this.data.mydata[index] != 0) {
          this.randNum();
        } else {
          break;
        }
      }
      //如果有可用位置
      if(index>=0){
        this.changeData(index, num)
      }
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
    var touch = e.touches[0]
    //取第一个touch的坐标值
    this.data.startPos = {x:touch.pageX,y:touch.pageY,time:new Date()}
    this.data.direction = 0
  },
  move: function(e){
    //当屏幕有多个touch或者页面被缩放过，就不执行move操作
    if (e.touches.length > 1 || e.scale && event.scale !== 1){
      return
    }
    var time = new Date() - this.data.startPos.time
    if (time > 25 && this.data.direction == 0){
      var touch = e.touches[0]
      //判断滑动方向
      var x = touch.pageX - this.data.startPos.x
      var y = touch.pageY - this.data.startPos.y
      if (Math.abs(x) > Math.abs(y)) { //左右
        if(x>0){
          this.data.direction = 'right'
        }else{
          this.data.direction = 'left'
        }
      }else{
        //竖直
        if(y>0){
          this.data.direction = 'down'
        }else{
          this.data.direction = 'up'
        }
      }
    }
  },
  end: function(e){
    var that = this
    var flag = this.gameOver()
    if(flag == 1){
      wx.showModal({
        title: '友好鼓励',
        content: '你是个天才吗？',
        success: function(res){
          if (res.confirm) {
            console.log('用户点击了确定')
          } else {
            console.log('用户点击了取消')
          }
        }
      })
    }else if(flag == -1){
      //更新最佳成绩
      if (this.data.score > this.data.bestScore) {
        this.setData({
          bestScore: this.data.score
        })
        // 展示本地存储能力
        wx.setStorageSync(this.data.userinfo.nickName, this.data.score)
      }
      wx.showModal({
        title: '游戏结束',
        content: '不服再战?',
        success: function (res) {
          if (res.confirm) {
            that.restart()
          } else {
          }
        }
      })
    }
    //根据方向重新设置方格
    switch(this.data.direction){
      case 'up':
        this.mergeToUp()
        break
      case 'down':
        this.mergeToDown()
        break
      case 'left':
        this.mergeToLeft()
        break
      case 'right':
        this.mergeToRight()
        break
      default :
        break
    }
    if (this.data.direction!=0){
      //随机位置新生成2/4
      this.randNum()
    }
  },
  gameOver: function(){
    //格子满了
    var temp = []
    var max = 0
    for (var i = 0; i < this.data.mydata.length; i++) {
      if (this.data.mydata[i] == 0) {
        temp.push(i)
      }
      if (this.data.mydata[i] > max) {
        max = this.data.mydata[i]
      }
    }
    //有一个格子为2048
    if (max >= 2048) {
      return 1
    }
    if(temp.length == 0){
      //方格满了
      //判断是否还可以移动
      var up, down, left, right;
      for (var i = 0; i < this.data.mydata.length; i++) {
        up = i - 4
        down = i + 4
        left = i - 1
        right = i + 1
        if (up >= 0 && this.data.mydata[up] == this.data.mydata[i]) {
          return false
        }
        if (down < this.data.mydata.length && this.data.mydata[down] == this.data.mydata[i]) {
          return false
        }
        if (i % 4 != 0 && left >= 0 && this.data.mydata[left] == this.data.mydata[i]) {
          return false
        }
        if ((i + 1) % 4 != 0 && right < this.data.mydata.length && this.data.mydata[right] == this.data.mydata[i]) {
          return false
        }
      }
      this.data.direction = 0 //不可以产生新的2/4了
      return -1;
    }
  },
  //根据方向进行合并
  mergeToUp: function () {
    this.mergeMove(12,8,4,0)
    this.mergeMove(13, 9, 5, 1)
    this.mergeMove(14, 10, 6, 2)
    this.mergeMove(15, 11, 7, 3)
  },
  mergeToDown: function () { 
    this.mergeMove(0, 4, 8, 12)
    this.mergeMove(1, 5, 9, 13)
    this.mergeMove(2, 6, 10, 14)
    this.mergeMove(3, 7, 11, 15)
  },
  mergeToLeft: function(){
    this.mergeMove(3, 2, 1, 0)
    this.mergeMove(7, 6, 5, 4)
    this.mergeMove(11, 10, 9, 8)
    this.mergeMove(15, 14, 13, 12)
  },
  mergeToRight: function () {
    this.mergeMove(0, 1, 2, 3)
    this.mergeMove(4, 5, 6, 7)
    this.mergeMove(8, 9, 10, 11)
    this.mergeMove(12, 13, 14, 15)
  },
  mergeMove: function (d1, d2, d3, d4){
    var arr = [d1, d2, d3, d4]
    //计算是否合并
    var pre, next
    for (var i = arr.length - 1; i > 0; i--) {
      pre = this.data.mydata[arr[i]]
      if (pre == 0) {
        //如果为0，则进行下一次循环
        continue
      }
      //如果不为0 
      for (var j = i - 1; j >= 0; j--) {
        next = this.data.mydata[ arr[j] ]
        if (next == 0) {
          continue
        } else if (next != pre) {
          break
        } else {
          this.changeData(arr[i], next * 2)
          this.changeData(arr[j], 0)
          //更新分数
          this.data.score += next*2
          this.updateScore(this.data.score)
          break //防止3个及以上相同的数字在一排，滑动会出现问题
        }
      }
    }
    //更改位置
    for (var i = arr.length - 1; i > 0; i--) {
      pre = this.data.mydata[arr[i]]
      if (pre == 0) {
        for (var j = i - 1; j >= 0; j--) {
          next = this.data.mydata[arr[j]]
          if (next == 0) {
            continue
          } else {
            this.changeData(arr[i], next)
            this.changeData(arr[j], 0)
          }
          break
        }
      }
    }
  },
  restart : function() {
    var arr = new Array(16)
    arr.fill(0)

    this.setData({
      mydata : arr,
      score : 0
    })

    //随机生成二个数字
    this.randNum()
    this.randNum()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var msg = '我在咪咪2048,获得了' + this.data.score +'分!赶紧来试试吧'
    return {
      title: msg,
      path: '/page/index'
    }
  }
})
