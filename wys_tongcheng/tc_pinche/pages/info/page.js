var app=getApp();
var mid="";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid:'',
    keiy: [
      { "name": "临时拼车", "cls": "act", "img": "" },
      { "name": "长期拼车", "cls": "", "img": "ab" }
    ]  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;

    that.setData({ mid: options.mid, share: options.share});

    app.util.request({
      'url': 'entry/wxapp/pinche_msg_action',
      data: {
        op:'get_one_show',
        id: options.mid
      },
      success(res) {
        var rpjson = res.data.data;
        console.log(rpjson) ;

        that.setData({
          type: rpjson.type,
          pc_type: rpjson.pc_type,
          address_start: rpjson.address_start,
          address_end: rpjson.address_end,
          num: rpjson.num,
          geixiaofei: rpjson.geixiaofei,
          time: rpjson.time,
          yaoqiu: rpjson.rmk_yaoqiu,
          tel: rpjson.u_phone,
          time_start: rpjson.time_start,
          time_end: rpjson.time_end,
          buchong: rpjson.rmk_buchong
        })    

      }
    });
  
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that=this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.share_name + '-拼车信息',
      path: '/' + app.globalData.wx_model_name +'/tc_pinche/pages/info/page?mid=' + that.data.mid+'&share=1',
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  tap_phone:function(e){
    var tg=e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: tg.tel
    });

  }
})