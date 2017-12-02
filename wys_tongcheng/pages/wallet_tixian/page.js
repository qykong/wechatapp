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
    btn_status:true,
    money_sxfl:""
  },
  /**
   * 输入提现金额时
   */
  money_input:function(e){
    var money = e.detail.value;
    this.check_money_btn(money);
   
  },
  /**
   * 金额检查控制提现按钮
   */
  check_money_btn:function(money){
    var that=this;
    
    if (money != '') {
      if (parseFloat(money) >= 1) {
        that.setData({ 
          btn_status: false,
          money_sj: (parseFloat(money) * (1 - parseFloat(that.data.money_sxfl)/100 )).toFixed(2),
          money_sxf: (parseFloat(money) * (parseFloat(that.data.money_sxfl)/100)).toFixed(2)
         });
      }
      if (parseFloat(money) > parseFloat(that.data.account)){
        that.setData({
          btn_status: true
        });
      }

      if (parseFloat(that.data.money_sj)<1) {
        that.setData({
          btn_status: true
        });
      }


    } else {
      that.setData({ 
        btn_status: true,
        money_sj:'',
        money_sxf:''
       });
    }
  },
  /**
   * 全部提现额度
   */
  input_money:function(e){
    var tg=e.currentTarget.dataset;
    console.log(tg)
    this.setData({
      money: tg.account
    });
    this.check_money_btn(tg.account);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    userinfoUtil.getUserinfo();
    setTimeout(function(){
      var snycopenid = wx.getStorageSync('openId');
      var snycubinfo = wx.getStorageSync('ubinfo');
    that.setData({      
      user:snycubinfo
    });
      console.log(snycopenid)
      console.log(snycubinfo)
    },500);

    setTimeout(function () {
      that.load_account();
    }, 500);
   
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
            integral: rpjson.integral,
            money_sxfl: rpjson.money_sxfl,            
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
  
  },
  formSubmit:function(e){
    var that = this;
    var formID = e.detail.formId;
    var formobj = e.detail.value;
    formobj.formID = formID;
    formobj.money_sj = that.data.money_sj;
    formobj.money_sxf = that.data.money_sxf;
    formobj.account = that.data.account;
    formobj.money_sxfl = that.data.money_sxfl;
    formobj.money = parseFloat(formobj.money);   

    formobj.u_nickname = app.globalData.userInfo.nickName;
    formobj.u_city = app.globalData.userInfo.city;
    formobj.u_openid = app.globalData.openId;
    formobj.u_unionid = '';
    formobj.u_avatarurl = app.globalData.userInfo.avatarUrl;
    console.log(formobj);
    if (formobj.u_openid == '') {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '用户信息openId为空,不可提现!',
      });
    }else if (formobj.money > parseFloat(formobj.account)) {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '提现金额,不能大于空额!',
      });
    } else if (parseFloat(formobj.money_sj)<1) {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '实际到帐金额,大于等1元!',
      });
    } else{
      
      app.util.request({
        'url': 'entry/wxapp/tx_info_add',
        data: formobj,
        success(res) {
          var rpjson = res.data.data;
          console.log(rpjson);
          if (rpjson.tx_status){

            if (rpjson.tx_sh_isopen == '1') {
              var packpage = rpjson.apidata.packpage;
              console.log()

              if (packpage.isok) {
                wx.showModal({
                  title: packpage.error_title,
                  content: packpage.error_info,
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      // console.log('用户点击确定')
                      that.action_over();
                    }
                  }
                });

              } else {
                wx.showModal({
                  title: packpage.error_title,
                  content: packpage.error_info,
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      // console.log('用户点击确定')
                      that.action_over();
                    }
                  }
                });
              }
            } else {
              wx.showModal({
                title: '提示',
                content: '提现订单已提交成功,待审核',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    // console.log('用户点击确定')
                    that.action_over();
                  }
                }
              });
            }

          }else{
            if (rpjson.tx_status_str==1){
              wx.showToast({
                image: '../../resource/images/static/error.png',
                title: '提现金额,不可大过余额!',
              });

            }else{

            }
           


          }

          




        }
      });



      
    }



  },
  action_over:function(){
    WxNotificationCenter.postNotificationName('tx_over');
    wx.navigateBack({
      delta:1
    });
  }
})