var app = getApp();
var page_0 = 1;
var tname = "";
var tid = "";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ismore: true,//是否有更多
    tid: 0,
    tname: "",
    currentTab: 0,
    m_list_0: [],
    idx: 0//更新内容ID

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppColor();
    if (typeof (wx.getStorageSync('latitude')) == 'undefined' || wx.getStorageSync('latitude') == '' || wx.getStorageSync('latitude') == null) {
      wx.getLocation({
        success: function (res) {
          wx.setStorageSync('latitude', res.latitude);
          wx.setStorageSync('longitude', res.longitude);
        }
      });
    }

    var that = this;
    that.userLogin();

    tname = options.tname;
    tid = options.tid;
    that.setData({
      tid: options.tid,
      tname: options.tname,
      openId: wx.getStorageSync('openId'),
      ubinfo: app.globalData.userInfo,
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

    //this.load_list(4, page_0);

    page_0 = 1;
    this.setData({ m_list_0: [] });
    this.setData({ m_list_0_last: null });
    this.load_list(4, page_0);


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
  //加载幻灯片信息详细
  tapBanner_det: function (e) {
    var mtype = e.currentTarget.dataset.msg_type;
    if (mtype == '0') {
      wx.navigateTo({
        url: '../banner_info/banner_info?bid=' + e.currentTarget.dataset.bid
      });
    } else {
      wx.navigateTo({
        url: '../msg_info/msg_info?mid=' + e.currentTarget.dataset.mid
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

  },
  load_list: function (m_type, _page) {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/get_banner_byuser',
      data: {
        page: _page,
        pagesize: 10,
        openid: wx.getStorageSync('openId'),
        lon: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude')
      },
      success(res) {
        // console.log(res.data.data);
        var len = res.data.data.length;
        if (that.data.currentTab == 0) {
          var list_t = that.data.m_list_0;
          for (var i = 0; i < len; i++) {
            list_t.push(res.data.data[i]);
          }
          if (len == 0) {
            that.setData({ m_list_0_last: 1 });
          }
          that.setData({ m_list_0: list_t });
          that.setData({ ismore: len > 0 });
        }

        if (_page == 1 && len==0){
          that.setData({
            show_toMy_send:true
          });
        }


      }
    });


  },
  //图片预览
  previewImage: function (e) {
    var that = this;
    // //img imgs
    wx.previewImage({
      current: e.currentTarget.dataset.img,
      urls: e.currentTarget.dataset.imgs
    })
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    var that = this;
    // wx.showToast({
    //   title: '下拉',
    // })
    if (that.data.currentTab == 0) {
      page_0 = 1;
      that.setData({ m_list_0: [] });
      that.setData({ m_list_0_last: null });
      that.load_list(4, page_0);
    }
    wx.stopPullDownRefresh();
  }
  /**
   * 页面上拉触底事件的处理函数
   */
  , onReachBottom: function () {
    var that = this;

    if (that.data.ismore) {
      wx.showToast({
        title: '加载更多...',
      })
      if (that.data.currentTab == 0) {
        page_0++;
        that.load_list(4, page_0);
      }
    } else {
      wx.showToast({
        title: app.globalData.nomoretext
      });
    }

  },
  /**
   * 消息内容详细页
   */
  nav_msg_info: function (e) {
    wx.navigateTo({
      url: '../msg_info/msg_info?mid=' + e.currentTarget.dataset.mid
    })
  },
  /**
   * 取用户的openid unid
   */
  getU_openid: function () {
    var that = this;
    console.log('===========')
    if (app.globalData.openId == '') {
      wx.login({
        success: function (ires) {
          app.util.request({
            'url': 'entry/wxapp/get_userinfo',
            data: { code: ires.code },
            success(res) {
              var rpjosn = res.data.data;
              wx.hideLoading();
              console.log('自请求');
              console.log("取openid:" + rpjosn.openid);
              that.setData({
                openId: rpjosn.openid
              });
              app.globalData.openId = rpjosn.openid;
              wx.setStorageSync('openId', rpjosn.openid);
            }
          });
        }
      });
    }
  }
  ,
  /**
   * 用户信息获取 
   */
  getuser_info_openid: function () {
    var that = this;

    var snycopenid = wx.getStorageSync('openId');
    if (snycopenid != '' && snycopenid != null) {
      that.setData({
        openId: snycopenid
      });
      app.globalData.openId = snycopenid;

    } else {
      if (app.globalData.openId == '') {
        that.getU_openid();

      } else {
        that.setData({
          openId: app.globalData.openId
        });
      }
    }

    var snycubinfo = wx.getStorageSync('ubinfo');
    if (snycubinfo != '' && snycubinfo != null) {
      that.setData({ ubinfo: snycubinfo });
      app.globalData.userInfo = snycubinfo;
    } else {

      if (app.globalData.userInfo == null) {
        app.util.getUserInfo(function (userInfo) {
          //更新数据    
          app.globalData.userInfo = userInfo.wxInfo;
          that.setData({ ubinfo: userInfo.wxInfo });
          wx.setStorageSync('ubinfo', userInfo.wxInfo);
          setTimeout(function () {
            if (app.globalData.openId == '') {
              that.getU_openid();
            }
          }, 1500);

        });

      } else {
        that.setData({ ubinfo: app.globalData.userInfo });
      }

    }


  },
  /**
   * 取用户信息-验证授权
   */
  userLogin: function () {
    var that = this;
    wx.login({
      success: function (ires) {
        if (ires.code) {
          wx.getUserInfo({
            success: function (data) {
              console.log('suc');
              that.getuser_info_openid();
            }, fail: function () {
              wx.showModal({
                title: '提示',
                content: '授权获取用户信息失败,将不可发布消息和评论!',
                confirmText: '去设置',
                success: function (mres) {
                  if (mres.confirm) {
                    wx.openSetting({
                      success: function (pdata) {
                        if (pdata) {
                          if (pdata.authSetting["scope.userInfo"] == true) {
                            console.log('取得信息成功');
                            that.getuser_info_openid();

                          } else {
                            that.userLogin();
                          }
                        }
                      }
                    });
                  }
                }
              });
            }
          });
        }
      }
    });

  },
  /**
   * 支付按钮
   */
  btn_pay: function (e) {
    var that = this;
    var list_t = that.data.m_list_0;
    var idx = e.currentTarget.dataset.idx;
    var oncode = e.currentTarget.dataset.oncode;
    var bn_total_money = e.currentTarget.dataset.bn_total_money;
    console.log(bn_total_money)
    that.setData({
      idx: idx
    });
    that.payMoney(bn_total_money, oncode);
 
  },
  payMoney: function (money, _oncode){
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
                      console.log('支付回调检查:');
                      console.log(crpres.data.data);

                      wx.showModal({
                        title: '提示',
                        content: '你已支付成功,待管理员审核!',
                        showCancel: false,
                        success: function (res) {
                          if (res.confirm) {
                            console.log('用户点击确定')
                          }
                        }
                      });
                      var list_t = that.data.m_list_0;
                      var idx = that.data.idx;
                      list_t[idx].paystate = 1;
                      that.setData({ m_list_0: list_t });
                    }
                  });

                } else {
                 
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
                    console.log('成功');


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
                          content: '你已支付成功,待管理员审核!',
                          showCancel: false,
                          success: function (res) {
                            if (res.confirm) {
                              console.log('用户点击确定')
                            }
                          }
                        });
                        var list_t = that.data.m_list_0;
                        var idx = that.data.idx;
                        list_t[idx].paystate = 1;
                        that.setData({ m_list_0: list_t });



                      }
                    });


                  },
                  'fail': function (res) {
                    //支付失败后，
                    // console.log(res)
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
  },
  /**
   * 打开消息
   */
  tapopenmsg: function (e) {
    var that = this;
    var mid = e.currentTarget.dataset.mid;
    var idx = e.currentTarget.dataset.idx;
    var bnid = e.currentTarget.dataset.bnid;
    var paystate = e.currentTarget.dataset.paystate;
    that.setData({ idx: idx });

    wx.showActionSheet({
      itemList: ['查看关联消息', '删除'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '../msg_info/msg_info?mid=' + mid
          })
        } else if (res.tapIndex == 1) {
          if (paystate != 0) {
            wx.showToast({
              image: '../../resource/images/static/error.png',
              title: '已支付不可删除!',
            });
          } else {
            //扩展根据数据下标
            Array.prototype.del = function (index) {
              if (isNaN(index) || index >= this.length) {
                return false;
              }
              for (var i = 0, n = 0; i < this.length; i++) {
                if (this[i] != this[index]) {
                  this[n++] = this[i];
                }
              }
              this.length -= 1;
            };

            app.util.request({
              'url': 'entry/wxapp/del_banner',
              data: { bnid: bnid },
              success(res) {
                var list_t = that.data.m_list_0;
                var idx = that.data.idx;
                list_t.del(idx);
                that.setData({ m_list_0: list_t });
                wx.showToast({
                  title: '删除成功'
                });

              }
            });

          }
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })

  },
  tap_my_msglist:function(){
    wx.redirectTo({
      url: '../myuser_send/msg_list',
    })
  }

})