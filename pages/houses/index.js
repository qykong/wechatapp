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
        for (let i = (res.data.length-1); i >= 0; i--) {
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
  handleTap: function(event) {
    console.log(event.target);
    wx.previewImage({
      // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [event.target.dataset['url']],
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})
