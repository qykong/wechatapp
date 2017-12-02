var app = getApp();
var userinfoUtil = require('../resource/js/userinfoUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xiaosh: "act",//为空的话消息图标就没一点
    sd_sd_ds: [
      { "name": "个人资料", "img": "", "url": "#" },
      { "name": "我的收藏", "img": "ab", "url": "#" },
      { "name": "优惠买单", "img": "ac", "url": "#" },
      { "name": "商家入驻", "img": "ad", "url": "#" }
    ],
    df_dfx: [
      {
        "name": "同城信息", "df_sf": [
          { "name": "发布", "img": "ae", "num": 0, "url": "#" },
          { "name": "消息", "img": "af", "num": 0, "url": "#" },
          { "name": "关注", "img": "ag", "num": 0, "url": "#" },
          { "name": "回复", "img": "ah", "num": 0, "url": "#" },
          { "name": "回复", "img": "ah", "num": 0, "url": "#" }
        ]
      }, 
      {
        "name": "我的订单", "df_sf": [
          { "name": "待付款", "img": "", "num": 0, "url": "#" },
          { "name": "未使用", "img": "ab", "num": 1, "url": "#" },
          { "name": "已使用", "img": "ac", "num": 0, "url": "#" },
          { "name": "退款订单", "img": "ad", "num": 0, "url": "#" }
        ]
      },
      {
        "name": "我的拼车", "df_sf": [
          { "name": "待付款", "img": "", "num": 0, "url": "#" },
          { "name": "未使用", "img": "ab", "num": 0, "url": "#" },
          { "name": "已使用", "img": "ac", "num": 0, "url": "#" },
          { "name": "退款订单", "img": "ad", "num": 0, "url": "#" }
        ]
      }, {
        "name": "我的圈子", "df_sf": [
          { "name": "发布", "img": "ae", "num": 0, "url": "#" },
          { "name": "消息", "img": "af", "num": 0, "url": "#" },
          { "name": "关注", "img": "ag", "num": 0, "url": "#" },
          { "name": "回复", "img": "ah", "num": 0, "url": "#" }
        ]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.setAppColor();
    userinfoUtil.getUserinfo();

    setTimeout(function(){
      that.setData({
        ubinfo: wx.getStorageSync('ubinfo')
      });
    },1000);




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
  onShareAppMessage: function () {

  }
})