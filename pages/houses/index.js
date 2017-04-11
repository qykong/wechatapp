//index.js
//获取应用实例
var app = getApp()
Page( {
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1200,
    selected: -1
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo( {
      url: '../logs/logs'
    })
  },
  swiperchange: function(e) {
    //FIXME: 当前页码
    //console.log(e.detail.current)
  },

  onLoad: function() {
    var that = this

    //playingList
    wx.request({
      url: 'https://cbrcircle.com/api/zufang',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].content) {
            res.data[i].content = res.data[i].content.replace(/(\r\n|\n|\r)/gm,"");
          }
        }
        res.data = res.data.reverse()
        that.setData({ items: res.data });
      }
    })

  },
  onPullDownRefresh: function() {
    var that = this

    //playingList
    wx.request({
      url: 'https://cbrcircle.com/api/zufang',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        console.log(res)
        for (let i = (res.data.length-1); i >= 0; i--) {
          res.data[i].content = res.data[i].content.replace(/(\r\n|\n|\r)/gm,"");
        }
        that.setData({ items: res.data });
      }
    })
    wx.stopPullDownRefresh();
  },
  go: function(event) {
    wx.navigateTo({
      url: '../list/index?type=' + event.currentTarget.dataset.type
    })
  },
  showalltext: function(event) {
    let index = event.currentTarget.dataset['index']
    if (this.data.selected === index) {
      this.setData({
        selected: -1
      })
    } else {
      this.setData({
        selected: index
      })
    }
  }
})
