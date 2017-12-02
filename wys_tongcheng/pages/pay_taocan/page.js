var app = getApp();
var userinfoUtil = require('../../resource/js/userinfoUtil.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //设置顶部颜色
    app.setAppColor();
    //加载用户信息
    userinfoUtil.getUserinfo();
    that.load_pay_taocan_list();
    
  
    if (app.globalData.openId != '') {
     
        console.log('检查一次用户信息')
        userinfoUtil.check_user_have();


    }

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

    this.load_pay_taocan_list();
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
  
  },
  /**
   * 加载充值列表
   */
  load_pay_taocan_list:function(){
    var that=this;
    app.util.request({
      'url': 'entry/wxapp/pay_taocan_list',
      data: {},
      success(res) {
        console.log(res.data.data)
        that.setData({
          list_toacn: res.data.data
        });
      }
    });

  },
  /**
   * 用户点击充值按钮
   */
  tap_pay:function(e){
    var that=this;
    var tg = e.currentTarget.dataset;
   // console.log(tg.pmoney)
    //console.log(tg.tcid)
    that.pay_wx_api(tg);

    
  }
  ,
  /**
   * 微信充值
   */
  pay_wx_api:function(tg){
   tg.u_openid = app.globalData.openId;
    console.log(tg);
    var min = 1000, max = 9999;
    var rnum = Math.floor(Math.random() * (max - min + 1) + min) + new Date().getTime();
    //tg.pmoney=0.01;
    var prepay_id = "";
    app.util.request({
      'url': 'entry/wxapp/pay',
      data: {
        openid: app.globalData.openId,
        sum: tg.pmoney,
        oncode: tg.tcid + "," + rnum,
        ptype: "pay"
      },
      'cachetime': '0',
      success(res) {
        console.log('支付信息');
        prepay_id = res.data.data.package;
        console.log("prepay_id:" + prepay_id);
        console.log(res.data)
        if (res.data && res.data.data) {
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.paySign,
            'success': function (res) {
              //支付成功后，系统将会调用payResult() 方法，此处不做支付成功验证，只负责提示用户
              console.log('成功');
              console.log(res)
              //            
              //检查支付回调成功
              app.util.request({
                'url': 'entry/wxapp/update_pay_auditstatus',
                data: {
                  pay_channel: 'wx',
                  oncode: tg.tcid,
                  status: 1,
                  ptype: "pay",
                  openid: app.globalData.openId,
                  fee: tg.pmoney,
                  u_nickname: app.globalData.userInfo.nickName,
                  u_avatarurl: app.globalData.userInfo.avatarUrl,
                  rnum: rnum
                },
                success(crpres) {
                  console.log('支付回调检查:');
                  console.log(crpres.data.data);
                  wx.showToast({
                    title: '充值成功!',
                  })
                  //that.send_over();
                  //更新支付
                }
              });
            },
            'fail': function (res) {        
             

            }
          });
        }


      },
      fail: function (res) {
        //请求支付失败
        if (res.data.errno == 1) {
          wx.showToast({
            image: '../../resource/images/static/error.png',
            title: res.data.message.message
          })
        }
        //
      }
    });





  }

})