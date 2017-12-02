var app = getApp();
Page({
  data: {
    goodsNum: 1
  },
  onLoad: function (options) {
    var that = this;
    var param_json = JSON.parse(options.it);
    console.log(param_json)
    that.setData({
      it: param_json
    });
  },
  goods_number_change: function (e) {
    var that = this;
    if (e.currentTarget.id == 'jia') {
      that.setData({
        goodsNum: that.data.goodsNum + 1
      });
    }
    else {
      if (that.data.goodsNum > 1) {
        that.setData({
          goodsNum: that.data.goodsNum - 1
        });
      }

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
  order_submit: function (e) {
    var that = this;
    var obj = that.data.it;
    var formID = e.detail.formId;
    var formobj = e.detail.value;
    console.log(formobj);
    obj.formID = formID;
    obj.goodsNum = formobj.goodsNum;
    obj.total_money = formobj.total_money;
    obj.store_openid = obj.openid;    
    obj.op="add";
    obj.openid = wx.getStorageSync('openId');
    obj.u_nickname = app.globalData.userInfo.nickName;
    obj.u_city = app.globalData.userInfo.city;
    obj.u_openid = app.globalData.openId;
    obj.u_unionid = '';
    obj.u_avatarurl = app.globalData.userInfo.avatarUrl;
  
    app.util.request({
      'url': 'entry/wxapp/store_order_action',
      method:'POST',
      data: obj,
      success(res) {
        var json = res.data.data;
        if(json.cnt_is_sale){

          if (obj.total_money != '0') {
            var param_obj = {
              pay_money: obj.total_money,
              oncode: json.oncode,
              ptype: 'store_order'
            };
            that.pay_store_order(param_obj);
          } else {
            //返回订单项
            that.over_action();
          }
        }else{
          wx.showToast({
            image: '../../../resource/images/static/error.png',
            title: '库存不足!,剩余库存:'+json.cnt_sale_kucn,
          });
        }               
      }
    });
    console.log(obj);
  },
  /**
   * 订单结束
   */
  over_action:function(){
    wx.redirectTo({
      url: '../order_list_kefu/page',
    })
  },
  /**
   * 打赏支付
   */
  pay_store_order: function (formobj) {
    var that = this;
    //console.log(formobj);
    //oncode.
    //pay_money
  
    app.util.request({
      'url': 'entry/wxapp/check_user_account',
      data: {
        openId: app.globalData.openId,
        ck_type: 'account_only',//只检查帐户
        ck_money: formobj.pay_money
      },
      success(crpres) {
        var rpjson = crpres.data.data;
        console.log(rpjson)
        if (rpjson.have_user) {
          if (rpjson.ck_status) {
            wx.showModal({
              title: '提示',
              content: '帐户可支付，确认支付' + formobj.pay_money + '元？',
              cancelText: '取消',
              confirmText: '帐户支付',
              success: function (res) {
                if (res.confirm) {
                  // console.log('支付' + money+oncode+'account');
                  app.util.request({
                    'url': 'entry/wxapp/update_pay_auditstatus',
                    data: {
                      pay_channel: 'account',
                      oncode: formobj.oncode,
                      status: 1,
                      ptype: formobj.ptype,
                      openid: app.globalData.openId,
                      fee: formobj.pay_money,
                      u_nickname: app.globalData.userInfo.nickName,
                      u_avatarurl: app.globalData.userInfo.avatarUrl
                    },
                    success(crpres) {
                      console.log('支付回调检查:');
                      console.log(crpres.data.data);
                      wx.showToast({
                        title: '帐户支付成功!',
                      });
                      that.over_action();

                    }
                  });

                } else {
                  //转向我的发布
                  that.wx_api_pay(formobj);
                }
              }
            });
          } else {
            //  wx.showToast({
            //    image: '../../resource/images/static/error.png',
            //    title: '帐户金币不足,微信支付',
            //  });

            that.wx_api_pay(formobj);
          }

        } else {
          //没有该用户直接微信支付
          that.wx_api_pay(formobj);
        }
      }
    });

  },
  /**
   * 打赏支付界面唤起
   */
  wx_api_pay: function (formobj) {
    var that = this;
    var min = 1000, max = 9999;
    var rnum = Math.floor(Math.random() * (max - min + 1) + min) + new Date().getTime();
   //formobj.pay_money = 0.01;
    var prepay_id = "";
    app.util.request({
      'url': 'entry/wxapp/pay',
      data: {
        openid: app.globalData.openId,
        sum: formobj.pay_money,
        oncode: formobj.oncode + "," + rnum,
        ptype: formobj.ptype
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
              //            
              //检查支付回调成功
              app.util.request({
                'url': 'entry/wxapp/update_pay_auditstatus',
                data: {
                  pay_channel: 'wx',
                  oncode: formobj.oncode,
                  status: 1,
                  ptype: formobj.ptype,
                  openid: app.globalData.openId,
                  fee: formobj.pay_money,
                  u_nickname: app.globalData.userInfo.nickName,
                  u_avatarurl: app.globalData.userInfo.avatarUrl,
                  rnum: rnum
                },
                success(crpres) {
                  console.log('支付回调检查:');
                  console.log(crpres.data.data);
                  wx.showToast({
                    title: '微信支付成功!',
                  });
                  that.over_action();

                }
              });
            },
            'fail': function (res) {
              //支付失败后，
              wx.showToast({
                title: '微信支付失败!',
              });
              that.over_action();
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