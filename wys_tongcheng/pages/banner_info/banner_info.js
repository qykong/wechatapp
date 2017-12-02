var app=getApp();
var WxParse = require('../../../we7/resource/plugin/wxParse/wxParse.js');
var bid="";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodes: []
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    app.setAppColor();
    //that.data.nodes.children[0].text = 1212;
    
    bid = options.bid;

    this.load_bannser(options.bid);
    
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.share_name+'-信息详情',
      path: '/' + app.globalData.wx_model_name +'/pages/banner_info/banner_info?bid=' + bid,
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  load_bannser:function(_bid){
    var that=this;
    app.util.request({
      'url': 'entry/wxapp/get_banner_info',
      data: { bid: _bid},
      success(res) {
        var item = res.data.data;
        that.setData({
          banner: item         
        });

        WxParse.wxParse('content', 'html', item.content, that, 5);


      }
    });
  }
  
})