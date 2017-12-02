var app = getApp();
var page_0 = 1;
var tname = "";
var tid = "";
var userinfoUtil = require('../../resource/js/userinfoUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shmoney: '',
    shmoney_choonse: false,//打赏金额选择
    showModalStatus_shang: false,//打赏状态
    showModalStatus_sheet: false,
    bannser_show: false,
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1500,
    ismore: true,//是否有更多
    tid: 0,
    tname: "",
    currentTab: 0,
    m_list_0: [],
    idx: 0//更新内容ID

  },
  /**
   * 实名代码检查
   */
  check_smrzbyuser: function () {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/check_smrzbyuser',
      data: { openId: wx.getStorageSync('openId') },
      success(res) {
        var json = res.data.data;
        console.log('实名认证检查开关');
        console.log(json);
        //实名认证启用
        if (json.smrz_isopen == '1') {
          //console.log('记用')
          if (json.smrz_state == false) {
            wx.navigateTo({
              url: '../myuser_smrz_p_info/smrz_p_info',
            })
          }
        }

      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppColor();


    var that = this;

    wx.setNavigationBarTitle({
      title: wx.getStorageSync('unickname') + " -信息列表",
    });



    tname = options.tname;
    tid = options.tid;
    that.setData({
      tid: options.tid,
      tname: options.tname,
      openId: app.globalData.openId,
      ubinfo: app.globalData.userInfo,
    })


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
    var that = this;
    if (typeof (wx.getStorageSync('latitude')) == 'undefined' || wx.getStorageSync('latitude') == '' || wx.getStorageSync('latitude') == null) {
      wx.getLocation({
        complete: function (res) {
          wx.setStorageSync('latitude', res.latitude);
          wx.setStorageSync('longitude', res.longitude);

          page_0 = 1;
          that.setData({ m_list_0: [] });
          that.setData({ m_list_0_last: null });
          that.load_list(6, page_0);

        }
      });
    } else {
      page_0 = 1;
      that.setData({ m_list_0: [] });
      that.setData({ m_list_0_last: null });
      that.load_list(6, page_0);
    }


    that.hideModal();
    //this.load_list(4, page_0);




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
  //加载幻灯片
  load_banners: function (_btype) {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/get_banners',
      data: { btype: _btype },
      success(res) {
        if (res.data.data.length > 0) {
          that.setData({ bannser_show: true });
        }
        that.setData({ banners: res.data.data });
      }
    });
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
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.share_name + " " + tname + ' 信息列表',
      path: '/' + app.globalData.wx_model_name +'/pages/msg_list/msg_list?tid=' + tid + "&tname=" + tname,
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  load_list: function (m_type, _page) {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/get_msg_list',
      data: {
        page: _page,
        pagesize: 10,
        m_type: m_type,
        m_typeid: that.data.tid,
        openid: app.globalData.openId,
        byuser: wx.getStorageSync('byuser'),
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
   * 弹出评论窗口
   */
  show_comments: function (e) {
    var that = this;
    that.check_smrzbyuser();
    that.setData({
      pl_mid: e.currentTarget.dataset.mid,
      pl_ctype: e.currentTarget.dataset.ctype,
      plname: e.currentTarget.dataset.plname,
      attr: e.currentTarget.dataset.attr,
      attrtp: e.currentTarget.dataset.attrtp,
      plid: e.currentTarget.dataset.plid,
      idx: e.currentTarget.dataset.idx
    });
    this.showModal();
  },
  /**
   * 评论发布
   */
  formSubmit_send_comments: function (e) {
    var formID = e.detail.formId;
    var that = this;
    var formobj = e.detail.value;
    formobj.formID = formID;
    formobj.u_unionid = app.globalData.unionId;
    formobj.u_openid = app.globalData.openId;
    formobj.u_nickname = app.globalData.userInfo.nickName;
    formobj.u_city = app.globalData.userInfo.city;
    formobj.u_avatarurl = app.globalData.userInfo.avatarUrl;
    formobj.u_gender = app.globalData.userInfo.gender;
    formobj.u_province = app.globalData.userInfo.province;
    formobj.u_country = app.globalData.userInfo.country;

    if (formobj.u_nickname == '' || formobj.u_openid == '') {
      wx.showToast({
        title: '用户授权信息无,不可发布评论!',
      });
    } else if (formobj.pl_content == '') {
      wx.showToast({
        title: '评论内容不能为空!',
      })
    } else {
      app.util.request({
        'url': 'entry/wxapp/send_comments',
        data: formobj,
        success(res) {
          //console.log(res.data.data);        
          that.hideModal();
          //刷新评论
          var m_idx = that.data.idx;
          if (that.data.currentTab == 0) {
            var list_t = that.data.m_list_0;
            list_t[m_idx].comments = res.data.data;
            list_t[m_idx].comments_cnt = parseInt(list_t[m_idx].comments_cnt) + 1;
            that.setData({ m_list_0: list_t });
          } else if (that.data.currentTab == 1) {
            var list_t = that.data.m_list_1;
            list_t[m_idx].comments = res.data.data;
            list_t[m_idx].comments_cnt = parseInt(list_t[m_idx].comments_cnt) + 1;
            that.setData({ m_list_1: list_t });
          } else if (that.data.currentTab == 2) {
            var list_t = that.data.m_list_2;
            list_t[m_idx].comments = res.data.data;
            list_t[m_idx].comments_cnt = parseInt(list_t[m_idx].comments_cnt) + 1;
            that.setData({ m_list_2: list_t });
          }
          //刷新评论结束
        }
      });

    }
    //console.log(formobj)

  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  /**
   * 用户点赞
   */
  ck_goods: function (e) {
    var that = this;
    var m_idx = e.currentTarget.dataset.idx;
    var formobj = app.globalData.userInfo;
    formobj.mid = e.currentTarget.dataset.mid;
    formobj.openId = wx.getStorageSync('openId');
    app.util.request({
      'url': 'entry/wxapp/send_goods',
      data: formobj,
      success(res) {
        // console.log(res.data.data);        

        //刷新评论
        //list_t[m_idx].comments = ;
        if (that.data.currentTab == 0) {
          var list_t = that.data.m_list_0;
          list_t[m_idx].isgoods = res.data.data.isgoods;
          list_t[m_idx].goods_cnt = res.data.data.allgoods;
          that.setData({ m_list_0: list_t });
        } else if (that.data.currentTab == 1) {
          var list_t = that.data.m_list_1;
          list_t[m_idx].isgoods = res.data.data.isgoods;
          list_t[m_idx].goods_cnt = res.data.data.allgoods;
          that.setData({ m_list_1: list_t });
        } else if (that.data.currentTab == 2) {
          var list_t = that.data.m_list_2;
          list_t[m_idx].isgoods = res.data.data.isgoods;
          list_t[m_idx].goods_cnt = res.data.data.allgoods;
          that.setData({ m_list_2: list_t });
        }
        //刷新评论结束
      }
    });
  },
  /**
   * 打开打赏界面
   */
  open_shang_win: function (e) {
    var that = this;
    var tg = e.currentTarget.dataset;
    var mid = tg.mid;
    var idx = tg.idx;
    that.setData({
      shang_mid: mid,
      shang_idx: idx
    });

    that.util_model('open', 'shang');
  },
  /**
   * 打赏金额选择
   */
  tap_choonse_money: function (e) {
    this.setData({
      shmoney: e.currentTarget.dataset.shmoney,
      shmoney_choonse: true,
      clear_inshmoney: ''
    });
  },
  /**
   * 输入框输入金额取消选择状态和金额
   */
  clear_shmoney_choonse: function () {
    this.setData({
      shmoney: '',
      shmoney_choonse: false
    });
  },
  /**
   * 打赏表单提交
   */
  formSubmit_shange: function (e) {
    var that = this;
    var formID = e.detail.formId;
    var formobj = e.detail.value;
    formobj.formID = formID;
    var data_shmoney_choonse = that.data.shmoney_choonse;
    var data_shmoney = that.data.shmoney;

    console.log(data_shmoney_choonse)
    if (data_shmoney_choonse) {
      formobj.shmoney = data_shmoney;
      that.pay_shang(formobj);
    } else {
      if (formobj.shmoney == '') {
        wx.showToast({
          image: '../../resource/images/static/error.png',
          title: '打赏金额不能为空,请重新输入!',
        });
      } else {
        that.pay_shang(formobj);
      }

    }
  },
  pay_shang: function (formobj) {
    var that = this;
    //console.log(formobj);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/check_user_account',
      data: {
        openId: app.globalData.openId,
        ck_type: 'account_only',//只检查帐户
        ck_money: formobj.shmoney
      },
      success(crpres) {
        var rpjson = crpres.data.data;
        console.log(rpjson)
        if (rpjson.have_user) {
          if (rpjson.ck_status) {
            wx.showModal({
              title: '提示',
              content: '帐户可支付，确认支付' + formobj.shmoney + '元？',
              cancelText: '取消',
              confirmText: '帐户支付',
              success: function (res) {
                if (res.confirm) {
                  // console.log('支付' + money+oncode+'account');
                  app.util.request({
                    'url': 'entry/wxapp/update_pay_auditstatus',
                    data: {
                      pay_channel: 'account',
                      oncode: formobj.shang_mid,
                      status: 1,
                      ptype: "shang",
                      openid: app.globalData.openId,
                      fee: formobj.shmoney,
                      u_nickname: app.globalData.userInfo.nickName,
                      u_avatarurl: app.globalData.userInfo.avatarUrl
                    },
                    success(crpres) {

                      console.log('支付回调检查:');
                      console.log(crpres.data.data);
                      that.util_model('close', 'shang');

                      if (that.data.currentTab == 0) {
                        var list_t = that.data.m_list_0;

                        list_t[that.data.shang_idx].shang_cnt++;
                        that.setData({ m_list_0: list_t });
                      }

                      wx.showToast({
                        title: '帐户打赏成功!',
                      });

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
    //formobj.shmoney = 0.01;
    console.log(formobj);
    // 
    var min = 1000, max = 9999;
    var rnum = Math.floor(Math.random() * (max - min + 1) + min) + new Date().getTime();
    //console.log(rnum)

    if (parseFloat(formobj.shmoney) < 1) {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '请输入至少为1元!',
      });
      return false;
    }
    var prepay_id = "";
    app.util.request({
      'url': 'entry/wxapp/pay',
      data: {
        openid: app.globalData.openId,
        sum: formobj.shmoney,
        oncode: formobj.shang_mid + "," + rnum,
        ptype: "shang"
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
                  oncode: formobj.shang_mid,
                  status: 1,
                  ptype: "shang",
                  openid: app.globalData.openId,
                  fee: formobj.shmoney,
                  u_nickname: app.globalData.userInfo.nickName,
                  u_avatarurl: app.globalData.userInfo.avatarUrl,
                  rnum: rnum
                },
                success(crpres) {
                  console.log('支付回调检查:');
                  console.log(crpres.data.data);
                  that.util_model('close', 'shang');

                  if (that.data.currentTab == 0) {
                    var list_t = that.data.m_list_0;

                    list_t[that.data.shang_idx].shang_cnt++;
                    that.setData({ m_list_0: list_t });
                  } 

                  wx.showToast({
                    title: '微信打赏成功!',
                  });

                  //that.send_over();
                  //更新支付
                }
              });
            },
            'fail': function (res) {
              that.util_model('close', 'shang');
              //支付失败后，
              // console.log(res)
              //转向我的发布
              // wx.redirectTo({
              //   url: '../myuser_send/msg_list',
              // });

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
  
  
  
  
  ,
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
      that.load_list(6, page_0);
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
        that.load_list(6, page_0);
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
   * 联系他
   */
  tap_lianxita: function (e) {
    var phone = e.currentTarget.dataset.uphone;
    wx.makePhoneCall({ phoneNumber: phone });
    // console.log(phone)
    // wx.showActionSheet({
    //   itemList: [phone, '电话联系Ta'],
    //   success: function (res) {
    //     if (res.tapIndex == 1 || res.tapIndex == 0) {

    //     }
    //   },
    //   fail: function (res) {
    //     //console.log(res.errMsg)
    //   }
    // })
  },
  /**
   * 悬浮添加按钮
   */
  tap_add: function (e) {
    var tg = e.currentTarget.dataset;
    wx.redirectTo({
      url: '../msg_send/msg_send?tid=' + tg.tid + '&tname=' + tg.tname
    });
    // wx.navigateTo({
    //   url: '../release/release'
    // });
  },
  /**
   * 打开地图标注
   */
  open_map: function (e) {
    //console.log(e.currentTarget.dataset)
    var lat = e.currentTarget.dataset.lat;
    var lon = e.currentTarget.dataset.lon;
    if (lat != '0') {
      wx.openLocation({
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        scale: 28
      });
    } else {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '座标错误,无法定位!',
      });
    }

  },
  /**
   * 打开用户列表
   */
  tapbyuserlist: function (e) {
    // if (e.currentTarget.dataset.openid != '') {
    //   wx.setStorageSync('byuser', e.currentTarget.dataset.openid);
    //   wx.setStorageSync('unickname', e.currentTarget.dataset.nkname);
    //   wx.navigateTo({
    //     url: '../msg_list_byuser/msg_list',
    //   });
    // } else {
    //   wx.showToast({
    //     image: '../../resource/images/static/error.png',
    //     title: '不可查看,该用户点赞时未授权!',
    //   });
    // }
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util_model(currentStatu, e.currentTarget.dataset.mtype);
  },
  util_model: function (currentStatu, mtype) {
    var that = this;
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });
    // 第2步：这个动画实例赋给当前的动画实例  
    that.animation = animation;
    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();
    // 第4步：导出动画对象赋给数据对象储存  
    that.setData({
      animationData: animation.export()
    });
    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      that.setData({
        animationData: animation
      });
      //关闭  
      if (currentStatu == "close") {
        if (mtype == 'menu') {
          that.setData({
            showModalStatus_sheet: false
          });
        } else if (mtype == 'shang') {
          that.setData({
            showModalStatus_shang: false
          });

        }
      }
    }.bind(that), 200);
    // 显示  
    if (currentStatu == "open") {

      if (mtype == 'menu') {
        that.setData({
          showModalStatus_sheet: true
        });
      } else if (mtype == 'shang') {
        that.setData({
          showModalStatus_shang: true
        });

      }

    }
  }





})