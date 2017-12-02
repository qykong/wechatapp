var app = getApp();
var page = 1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ismore: true,//是否有更多
    list: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppColor();
    page = 1;
    this.load_list(page);
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
    page = 1;
    this.setData({
      list: []
    });
    this.load_list(page);
    this.setData({ list_last: null });
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;

    if (that.data.ismore) {
      wx.showToast({
        title: '加载更多...',
      })
      page++;
      that.load_list(page);
    } else {
      wx.showToast({
        title: app.globalData.nomoretext
      });
    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 加载
   */
  load_list: function (_page) {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/get_banners_sale',
      data: {
        page: _page,
        btype:0
      },
      success(res) {
        var list_t = that.data.list;
        var len = res.data.data.length;
        for (var i = 0; i < len; i++) {
          list_t.push(res.data.data[i]);
        }
        if (len == 0) {
          that.setData({ list_last: 1 });
        }
        that.setData({ ismore: len > 0 });
        that.setData({ list: list_t });
      }
    });
  },
  tap_det: function (e) {
    wx.setStorage({
      key: 'bn_info',
      data: e.currentTarget.dataset
    });
    wx.redirectTo({
      url: '../banner_sale/page?bnid=' + e.currentTarget.dataset.bnid
    });
  }
})