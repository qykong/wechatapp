var app=getApp();
var WxParse = require('../../../we7/resource/plugin/wxParse/wxParse.js');
var bid="";
var tanme="";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannser_show: false,
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1500,
    nodes: []
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppColor();
    //that.data.nodes.children[0].text = 1212;
    
    bid = options.bid;
    tanme = options.tanme;

    wx.setNavigationBarTitle({
      title: options.tanme
    });


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
      title: app.globalData.share_name + tanme,
      path: '/' + app.globalData.wx_model_name +'/pages/banner_info/tw_info?bid=' + bid,
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
      'url': 'entry/wxapp/get_mtype_info',
      data: { bid: _bid},
      success(res) {
        var item = res.data.data;
        that.setData({
          banner: item         
        });
       if(item.rd_tw_imglist!=''){
        // console.log(item.rd_tw_imglist)
         that.setData({
           imglist: JSON.parse(item.rd_tw_imglist),
           bannser_show:true
         });
       }

      // console.log()


        WxParse.wxParse('content', 'html', item.rd_tw_rmk, that, 5);


      }
    });
  }
  
})