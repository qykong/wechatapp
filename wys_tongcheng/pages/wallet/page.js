var app=getApp();
var userinfoUtil = require('../../resource/js/userinfoUtil.js');
var WxNotificationCenter = require("../../../we7/resource/plugin/WxNotificationCenter/WxNotificationCenter.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: '0',
    integral: '0',
    mlist:[
      { st: '1', mtg: 'payat',m: '帐户充值', otype:'navigate', url: '../pay_taocan/page', icon:'../../resource/images/static/chongzhi.png'},      
      { st: '1', mtg: 'account_tx_action', m: '帐户提现', otype: 'navigate', url: '../wallet_tixian/page', icon: '../../resource/images/static/money_tixian.png' }, 
     // { st: '1', mtg: '',m: '' },
     // { st: '1', mtg: '',m: '' },


   
    ],

    mlist2: [
     
      { st: '1', mtg: 'msg', m: '信息+置顶', otype: 'navigate', url: '../wallet_list/page?ordertype=msg&title=消息付费或置顶', icon: '../../resource/images/static/money_zhicu.png' },
      { st: '1', mtg: 'banner', m: '广告位出租', otype: 'navigate', url: '../wallet_list/page?ordertype=banner&title=广告位出租', icon: '../../resource/images/static/money_zhicu.png' },
      { st: '1', mtg: 'pay', m: '充值记录', otype: 'navigate', url: '../wallet_list/page?ordertype=pay&title=充值记录', icon: '../../resource/images/static/money_zhicu.png' },
      { st: '1', mtg: 'shang_rem', m: '打赏记录', otype: 'navigate', url: '../wallet_list/page?ordertype=shang_rem&title=打赏记录', icon: '../../resource/images/static/money_zhicu.png' },
      { st: '1', mtg: 'account_tx', m: '提现记录', otype: 'navigate', url: '../wallet_tx_list/page?ordertype=account_tx&title=提现记录', icon: '../../resource/images/static/money_shouru.png' },
      { st: '1', mtg: 'shang_add', m: '被打赏', otype: 'navigate', url: '../wallet_list/page?ordertype=shang_add&title=被打赏', icon: '../../resource/images/static/money_shouru.png' },
      

    ]


  },
  tx_over:function(){
    setTimeout(function(){
      wx.navigateTo({
        url: '../wallet_tx_list/page',
      });
    },500);

  },
//../wallet_list/page?ordertype=' + tg.ordertype+ '&title=' + tg.title
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppColor();
    var that=this;
    WxNotificationCenter.addNotification('tx_over', that.tx_over, that)
    that.load_isopen();

    //获取用户信息
    setTimeout(function () {
      userinfoUtil.getUserinfo();
    }, 100);

   
  },
  /**
   * 加载开关配置项
   */
  load_isopen:function(){
    var that=this;
    app.util.request({
      'url': 'entry/wxapp/get_setting_open',
      data: {},
      success(res) {
        var rpjson = res.data.data;
        var pay_isopen = rpjson.pay_isopen;
        var shang_isopen = rpjson.shang_isopen;
        var mlist2 = that.data.mlist2;
        var mlist = that.data.mlist;

        for (var i = 0, len = mlist2.length; i < len; i++) {
          if (mlist2[i].mtg == 'pay') {
            mlist2[i].st = pay_isopen;
          }
          if (mlist2[i].mtg == 'shang_rem' || mlist2[i].mtg == 'shang_add') {
            mlist2[i].st = shang_isopen;
          }
          if (mlist2[i].mtg == 'account_tx') {
            mlist2[i].st = rpjson.tx_isopen;
          }
        }

        for (var i = 0, len = mlist.length; i < len; i++) {
          if (mlist[i].mtg == 'account_tx_action') {
            mlist[i].st = rpjson.tx_isopen;
          }

        }

        // that.setData({
        //   sett: res.data.data
        // });
        that.setData({
          mlist: mlist,
          mlist2: mlist2
        });
      }
    });
  },
  load_account: function () {
    var that = this;
  
      that.setData({
        ubinfo: wx.getStorageSync('ubinfo')
      });

      var openid = app.globalData.openId;
      if (openid == '') {
        openid = wx.getStorageSync('openId');
      }
      app.util.request({
        'url': 'entry/wxapp/check_user_account',
        data: {
          openId: openid,
          ck_type: 'all'
        },
        success(res) {
          var rpjson = res.data.data;
          if (rpjson.have_user) {
            that.setData({
              account: rpjson.account,
              integral: rpjson.integral
            });

          }

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
    var that = this;
    setTimeout(function () {
      that.load_account();
    }, 500);
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
    var that = this
    WxNotificationCenter.removeNotification('tx_over', that)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.load_account();
    this.load_isopen();
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
  tap_order:function(e){
    var tg = e.currentTarget.dataset;
    console.log(tg.ordertype)
    console.log(tg.title);
    wx.navigateTo({
      url: '../wallet_list/page?ordertype=' + tg.ordertype+ '&title=' + tg.title,
    })
  }
})