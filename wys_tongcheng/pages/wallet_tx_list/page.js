var app = getApp();
var page_0 = 1;
Page({
  data: {
    ordertype: '',
    ismore: true,//是否有更多
    m_list_0_last: [],
    account: '0',
    integral: '0',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.setAppColor();

    page_0 = 1;
    that.setData({ m_list_0: [] });
    that.setData({ m_list_0_last: null });
    that.load_list(page_0);



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
    var that = this;
    page_0 = 1;
    that.setData({ m_list_0: [] });
    that.setData({ m_list_0_last: null });
    that.load_list(page_0);
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
      page_0++;
      that.load_list(page_0);
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
   * 加载列表信息
   */
  load_list: function (_page) {

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/get_account_tx_list',
      data: {
        page: _page,
        pagesize: 10,
        ordertype: that.data.ordertype,
        openid: app.globalData.openId
      },
      success(res) {

        var len = res.data.data.length;
        var list_t = that.data.m_list_0;
        for (var i = 0; i < len; i++) {
          list_t.push(res.data.data[i]);
        }
        if (len == 0 || len < 10) {
          that.setData({ m_list_0_last: 1 });
        }


        that.setData({ m_list_0: list_t });
        that.setData({ ismore: len > 0 });



      }
    });


  },
  /**
   * 打开消息明细
   */
  tap_sheet: function (e) {
    var tg = e.currentTarget.dataset;
    if (tg.dtid !== '') {
      wx.navigateTo({
        url: '../msg_info/msg_info?mid=' + tg.dtid,
      })
    }
  }
})