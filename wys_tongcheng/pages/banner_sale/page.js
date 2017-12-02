var app = getApp();
var oncode = "";

Page({
  data: {
    ordermoney: 0,
    index: 0,
    daymoney: 0,
    bn_total_money: 0,//支付金额
    objectArray: [
      { days: 1 }, { days: 7 }, { days: 15 }, { days: 30 }, { days: 60 }, { days: 90 }
    ],
    imglist: [],
    money: 0//天单价
  },
  zdy_url: function (ourl) {
    var that = this;
    var surl = app.util.url(ourl);
    var nowPage = getCurrentPages();
    if (!nowPage) {
      nowPage = nowPage[getCurrentPages().length - 1];
      if (nowPage.__route__) {
        surl = surl + 'm=' + nowPage.__route__.split('/')[0];
      }
    } else {
      surl = surl + 'm=' + app.globalData.wx_model_name;
    }
    return surl;
  }, bindPickerChange: function (e) {
    var that = this;
    that.setData({
      index: e.detail.value
    });
    var days = that.data.objectArray[e.detail.value].days;
    //console.log(days)
    that.setData({
      bn_total_money: parseFloat(that.data.daymoney) * parseInt(days),
      bn_days: days
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppColor();
    var that = this;

    var snycubinfo = wx.getStorageSync('ubinfo');
    if (snycubinfo != '') {
      //that.setData({ ubinfo: snycubinfo });
      app.globalData.userInfo = snycubinfo;
    }

    //bnid: "10", btypename: "首页幻灯片", money: "10"

    wx.getStorage({
      key: 'bn_info',
      success: function (res) {
        console.log(res.data)
        var days = that.data.objectArray[that.data.index].days;
        that.setData({
          bn_info: res.data,
          daymoney: res.data.money,
          bn_total_money: parseFloat(res.data.money) * parseInt(days),
          bn_days: days
        });

      }
    });


    wx.getStorage({
      key: 'msg_det',
      success: function (res) {
        console.log(res.data)
        that.setData({
          msg_det: res.data
        });
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
  /**
   * 选择图片
   */
  choosePic: function () {
    var that = this;
    var imglist = this.data.imglist;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有//'original', 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths)
        for (var i = 0, len = tempFilePaths.length; i < len; i++) {
          imglist.push(tempFilePaths[i]);
        }
        that.setData({
          imglist: imglist
        });
        if (imglist.length >= 1) {
          that.setData({
            upimgbtt: true
          })
        }
      }
    });

  },
  /**
   * 图片删除
   */
  pic_remove: function (e) {
    Array.prototype.indexOf = function (val) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
      }
      return -1;
    };

    Array.prototype.remove = function (val) {
      var index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };

    var that = this;
    var imglist = this.data.imglist;
    wx.showModal({
      title: '提示',
      content: '是否删除图片?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');

          imglist.remove(e.currentTarget.dataset.img);
          that.setData({
            imglist: imglist
          })
          that.setData({
            upimgbtt: false
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  /**
   * 表单提交
   */
  formSubmit: function (e) {
    var that = this;
    var formId = e.detail.formId;
    var formobj = e.detail.value;
    formobj.formId = formId;
    formobj.openid = wx.getStorageSync('openId');

    formobj.u_nickname = app.globalData.userInfo.nickName;
    formobj.u_city = app.globalData.userInfo.city;
    formobj.u_openid = app.globalData.openId;
    formobj.u_unionid = app.globalData.unionId;
    formobj.u_avatarurl = app.globalData.userInfo.avatarUrl;


    console.log(formobj);
    if (formobj.mid == '') {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '消息ID不能为空!',
      });
    } else if (that.data.imglist == 0) {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '请上幻灯片图片!',
      });
    } else {
      //上传信息
      app.util.request({
        'url': 'entry/wxapp/banner_sale',
        data: formobj,
        method: 'post',
        success(res) {
          // console.log(res.data);
          var rpjson = res.data.data;
          //消息识别码
          oncode = rpjson.oncode;
          //返回总金额
          that.setData({ ordermoney: parseFloat(rpjson.ordermoney) });
          wx.hideLoading();

          //上传图片

          //上传图片地址
          var usrfile = that.zdy_url('entry/wxapp/banner_imgs');
          for (var i = 0, len = that.data.imglist.length; i < len; i++) {
            wx.uploadFile({
              url: usrfile,
              filePath: that.data.imglist[i],
              name: 'file',
              formData: { oncode: oncode },
              header: {
                'content-type': 'multipart/form-data'
              },
              success: function (res) {
                var json = res.data;
                console.log('request：');
                console.log(res.data);
                var json_b = JSON.parse(res.data);
                console.log(json_b.message)
                console.log(json_b.data.messate);
                console.log(json_b.data.fileimg);

                if (that.data.ordermoney > 0) {
                  that.payMoney(that.data.ordermoney, oncode);
                } else {
                  //
                }

              }
            });

          }

        }
      });



    }

  },
  payMoney: function (money, _oncode) {
      //money=0.01;
    var that = this; 
    app.util.request({
      'url': 'entry/wxapp/check_user_account',
      data: {
        openId: app.globalData.openId,
        ck_type: 'account',
        ck_money: money
      },
      success(crpres) {
        var rpjson = crpres.data.data;
        console.log(rpjson)
        if (rpjson.have_user) {
          if (rpjson.ck_status) {

            //支付频道
            var rp_pay_channel = rpjson.pay_channel;
            var rp_pay_money = rpjson.pay_money;
            var rp_title = "";
            var rp_pay_title = "";
            if (rp_pay_channel == 'integral') {
              rp_title = "积分可支付,支付积分:" + rp_pay_money;
              rp_pay_title = "积分支付";
            } else if (rp_pay_channel == 'account') {
              rp_title = "帐户可支付,支付:" + rp_pay_money + '元';
              rp_pay_title = "帐户支付";
            }


            wx.showModal({
              title: '提示',
              content: rp_title,// '帐户可支付，确认支付' + money + '元？',
              cancelText: '取消',
              confirmText: rp_pay_title,//'帐户支付',
              success: function (res) {
                if (res.confirm) {
                  // console.log('支付' + money+oncode+'account');
                  app.util.request({
                    'url': 'entry/wxapp/update_pay_auditstatus',
                    data: {
                      pay_channel: rp_pay_channel,
                      oncode: _oncode,
                      status: 1,                     
                      ptype: "banner",
                      fee: money,
                      openid: app.globalData.openId,//用户的openid
                      u_nickname: app.globalData.userInfo.nickName,
                      u_avatarurl: app.globalData.userInfo.avatarUrl
                    },
                    success(crpres) {
                      
                      wx.showModal({
                        title: '提示',
                        content: '你已支付成功,待管理员审核,确定后返回我的消息列表!',
                        showCancel: false,
                        success: function (res) {
                          if (res.confirm) {
                            // console.log('用户点击确定')
                            wx.redirectTo({
                              url: '../myuser_banner/page',
                            });

                          }
                        }
                      });

                    }
                  });

                } else {
                  //转向我的发布
                  that.wx_api_pay(money, _oncode);
                }
              }
            });
          } else {
            //  wx.showToast({
            //    image: '../../resource/images/static/error.png',
            //    title: '帐户金币不足,微信支付',
            //  });

            that.wx_api_pay(money, _oncode);
          }

        } else {
          //没有该用户直接微信支付
          that.wx_api_pay(money, _oncode);
        }
      }
    });


  },


  /**
   * 微信支付
   */
  wx_api_pay: function (money, _oncode) {
    var that = this;

    var min = 1000, max = 9999;
    var rnum = Math.floor(Math.random() * (max - min + 1) + min) + new Date().getTime();
    //money=0.01;
 
          var prepay_id = "";
          app.util.request({
            'url': 'entry/wxapp/pay',
            data: {
              openid: wx.getStorageSync('openId'),
              sum: money,
              oncode: _oncode + "," + rnum,
              ptype: "banner"
            },
            'cachetime': '0',
            success(res) {
              console.log('支付信息');
              prepay_id = res.data.data.package;
              //console.log(res.data)
              //console.log(res.data.data);
              //console.log("支付回调模板id:"+res.data.data.package)
              if (res.data && res.data.data) {
                wx.requestPayment({
                  'timeStamp': res.data.data.timeStamp,
                  'nonceStr': res.data.data.nonceStr,
                  'package': res.data.data.package,
                  'signType': 'MD5',
                  'paySign': res.data.data.paySign,
                  'success': function (res) {
                    //支付成功后，系统将会调用payResult() 方法，此处不做支付成功验证，只负责提示用户
                    console.log('成功')
                    //console.log(res);

                    //检查支付回调成功
                    app.util.request({
                      'url': 'entry/wxapp/update_pay_auditstatus',
                      data: {
                        pay_channel: 'wx',
                        oncode: _oncode,
                        status: 1,
                        prepay_id: prepay_id,
                        ptype: "banner",
                        fee: money,
                        u_nickname: app.globalData.userInfo.nickName,
                        u_avatarurl: app.globalData.userInfo.avatarUrl,
                        rnum: rnum
                      },
                      success(crpres) {
                        console.log('支付回调检查:');
                        console.log(crpres.data.data);

                        wx.showModal({
                          title: '提示',
                          content: '你已支付成功,待管理员审核,确定后返回我的消息列表!',
                          showCancel: false,
                          success: function (res) {
                            if (res.confirm) {
                              // console.log('用户点击确定')
                              wx.redirectTo({
                                url: '../myuser_banner/page',
                              });

                            }
                          }
                        });

                      }
                    });

                  },
                  'fail': function (res) {
                    //支付失败后，
                    // console.log(res)
                    //转向我的发布
                    wx.redirectTo({
                      url: '../myuser_banner/page',
                    });

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