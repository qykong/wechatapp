var app=getApp();
var WxNotificationCenter = require("../../../../we7/resource/plugin/WxNotificationCenter/WxNotificationCenter.js");
var userinfoUtil = require('../../../resource/js/userinfoUtil.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },
  store_info_add:function(){
    this.load_list();
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    WxNotificationCenter.addNotification("store_info_add", that.store_info_add, that)
    userinfoUtil.getUserinfo(); 
    //获取用户信息
    setTimeout(function () {
      that.load_list();
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
    this.load_list();
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
   * 入驻商圈
   */
  tap_store: function () {
    wx.navigateTo({
      url: '../stroe_add/page?nav_type=list_my',
    });

  },
  load_list:function(){
    var that=this;
    app.util.request({
      'url': 'entry/wxapp/store_info_action',
      data: { 
        openid: wx.getStorageSync('openId'),
        op:'list_my'
       },
      success(res) {
        var json = res.data.data;
        that.setData({
        list:json
        });        
      }

    });
  },
  /**
   * 打开详情
   */
  tap_store_info:function(e){
    var tg=e.currentTarget.dataset;

    wx.showActionSheet({
      itemList: ['店铺 编辑','店铺 预览'],
      success: function (res) {
        if(res.tapIndex==0){
          wx.navigateTo({
            url: '../stroe_add/page?oncode=' + tg.oncode + '&nav_type=list_my',
          });
        } else if (res.tapIndex == 1) {
          wx.navigateTo({
            url: '../store_info/page?sid=' + tg.sid + '&oncode=' + tg.oncode + '&nav_type=list_my',
          });
        } else if (res.tapIndex == 2) {

        } else if (res.tapIndex == 3) {

        } else if (res.tapIndex == 4) {

        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    });

   
  }

})