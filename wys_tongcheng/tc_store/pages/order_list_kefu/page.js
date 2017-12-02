var app = getApp();
var WxNotificationCenter = require("../../../../we7/resource/plugin/WxNotificationCenter/WxNotificationCenter.js");
var userinfoUtil = require('../../../resource/js/userinfoUtil.js');
//var QR = require("../../../../we7/resource/plugin/qr/qrcode.js");
//var BR = require("../../../../we7/resource/plugin/qr/barcode.js");
var wxbarcode = require("../../../../we7/resource/plugin/qr/wxbarcode.js");
var page=1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    activeIndex: 0,
    op:'list_my',
    menus: [
      {
        'menuId': 1,
        'menu': '全部'
      },
      {
        'menuId': 2,
        'menu': '商品'
      },
      {
        'menuId': 3,
        'menu': '卡券'
      },
      {
        'menuId': 4,
        'menu': '未审核'
      }
    ]
  },
  comments_ok:function(){
    var that=this;
    page = 1;
    that.setData({ list: [] });
    that.load_list();  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;   
   // wxbarcode.barcode('barcode', '1234567890123456789', 680, 200);
   // wxbarcode.qrcode('qrcode', '1234567890123456789', 420, 420);

   // that.br_createQrCode("mycanvas",123123,120,120);

    WxNotificationCenter.addNotification("comments_ok", that.comments_ok, that)
    page=1;
    that.setData({ list:[]});
    that.load_list();   

    // 页面显示
    var span = wx.getSystemInfoSync().windowWidth / this.data.menus.length + 'px';
    this.setData({
      itemWidth: this.data.menus.length <= 5 ? span : '160rpx'
    });

    //获取用户信息
    setTimeout(function () {
      userinfoUtil.getUserinfo();
    }, 100);
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
    page=1;
    this.setData({
      list: [],
      is_no_list:0//去除更多
    });
    this.load_list();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this;
    if (that.data.ismore) {
      wx.showToast({
        title: '加载更多...',
      })
      page++;
      that.load_list();
    } else {
      wx.showToast({
        title: app.globalData.nomoretext
      });
    }

    

  },
  tabChange: function (e) {
    var tg = e.currentTarget.dataset;
    var index = tg.index;
    var menuId = tg.menuId;
    console.log(tg);
    this.setData({
      menuId: menuId,
      activeIndex: index
    });
  },
  load_list: function () {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/store_order_action',
      data: {
        page:page,
        openid: wx.getStorageSync('openId'),
        op: that.data.op
      },
      success(res) {
        var json = res.data.data;
        //that.createQrCode('123123',"mycanvas");
        
        var list_t = that.data.list;
        var len = json.length;
        for (var i = 0; i < len; i++) {
          list_t.push(json[i]);
        }
        if (len == 0) {
          that.setData({ is_no_list: 1 });
        }        
        that.setData({
          list: list_t,
          ismore: len > 0
        });
        // 
        for(var i=0,len=that.data.list.length;i<len;i++){
          if (that.data.list[i].status == '1') { }
            wxbarcode.barcode('barcode_' + that.data.list[i].id, that.data.list[i].oncode, 680, 200);
          //wxbarcode.qrcode('qrcode_' + that.data.list[i].id, that.data.list[i].oncode, 420, 420);
          

        }
      }
    });
  },
  /**
   *订单评价
   */
  tap_comments:function(e){
    var tg=e.currentTarget.dataset;
    wx.navigateTo({
      url: '../order_comment/page?oncode=' + tg.oncode + '&s_id=' + tg.s_id + '&goods_id=' + tg.goods_id
    });
  }
})