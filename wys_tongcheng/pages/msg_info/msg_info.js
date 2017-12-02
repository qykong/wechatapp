var app = getApp();
var mid="";
var userinfoUtil = require('../../resource/js/userinfoUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shmoney: '',
    shmoney_choonse: false,//打赏金额选择
    showModalStatus_shang: false,//打赏状态
    item:{},
    mid:0
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
    var that = this;

    that.setData({
      openId: app.globalData.openId,
      ubinfo: app.globalData.userInfo,
      mid: options.mid
    });

    mid = options.mid; 
    wx.setNavigationBarTitle({
      title: app.globalData.share_name + '-信息详情'
    });

    app.setAppColor();
    if (typeof (wx.getStorageSync('latitude')) == 'undefined' || wx.getStorageSync('latitude') == '' || wx.getStorageSync('latitude')==null){
    wx.getLocation({
      success: function (res) {
        wx.setStorageSync('latitude', res.latitude);
        wx.setStorageSync('longitude', res.longitude);

        that.load_info(that.data.mid);
      },
      fail:function(){
        that.load_info(that.data.mid);
      }
    });
    }else{
      console.log('===')
      that.load_info(that.data.mid);
    }
   
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
  var that=this;
  that.hideModal();
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
    var that=this;
    this.load_info(that.data.mid);
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
  onShareAppMessage: function (res) {    
    var that=this;
    var pr_name = that.data.item.parent_tname;
    var title = app.globalData.share_name + " " + that.data.item.tname;
    if (pr_name != '' && pr_name != null && pr_name!='null'){
      title += " " + pr_name+ '-信息详情';
    }else{
      title +='-信息详情';
    }
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: title,
      path: '/' + app.globalData.wx_model_name +'/pages/msg_info/msg_info?mid=' + mid,
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**
   * 取信息
   */
  load_info:function(mid){
    var that=this;
    app.util.request({
      'url': 'entry/wxapp/get_msg_one',
      data: { 
        mid: mid,
        openid: app.globalData.openId,
        lon: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude')
        },
      success(res) {

        var rpjson = res.data.data;
        if (typeof (rpjson.id) =='undefined'){

          wx.showModal({
            title: '友情提示',
            content: '这条信息已丢失,我们去看看其它的吧！',
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                
                wx.switchTab({
                  url: '../index/index',
                });

                
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })


        }else{

          that.setData({
            item: res.data.data
          });

          var pr_name = that.data.item.parent_tname;
          var title = app.globalData.share_name + " " + that.data.item.tname;
          if (pr_name != '' && pr_name != null && pr_name != 'null' && typeof (pr_name) != 'undefined') {
            title += " " + pr_name + '-信息详情';
          } else {
            title += '-信息详情';
          }
          wx.setNavigationBarTitle({
            title: title
          });

        }
        
       



      }
    });

  },
  //图片预览
  previewImage: function (e) {
    var that = this;
    console.log(e.target.dataset.imgs)
    // //img imgs
    wx.previewImage({
      current: e.target.dataset.img,// e.target.dataset.img, // 当前显示图片的http链接
      urls: e.target.dataset.imgs//[] // 需要预览的图片http链接列表
    })
  },
  /**
   * 用户点赞
   */
  ck_goods: function (e) {
    var that = this;
    var m_idx = e.target.dataset.idx;
    var formobj = app.globalData.userInfo;
    formobj.mid = e.target.dataset.mid;
    formobj.openId = wx.getStorageSync('openId');
    app.util.request({
      'url': 'entry/wxapp/send_goods',
      data: formobj,
      success(res) {
        //console.log(res.data.data);
        var _item = that.data.item;
        _item.isgoods = res.data.data.isgoods;
        _item.goods_cnt = res.data.data.allgoods;
        that.setData({ item: _item });

        //刷新评论
       
        //刷新评论结束
      }
    });
  }
  ,
  /**
   *弹出评论
   */ 
  show_comments: function (e) {
    var that = this;
    that.check_smrzbyuser();
    that.setData({
      pl_mid: e.target.dataset.mid,
      pl_ctype: e.target.dataset.ctype,
      plname: e.target.dataset.plname,
      attr: e.target.dataset.attr,
      attrtp: e.target.dataset.attrtp,
      plid: e.target.dataset.plid
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
          var _item = that.data.item;
          _item.comments = res.data.data;
          _item.comments_cnt = parseInt(_item.comments_cnt) + 1;  
          that.setData({ item: _item});
          //刷新评论结束
        }
      });

    }
    //console.log(formobj)

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
  pay_shang: function (formobj){
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
                      var _item = that.data.item;
                      _item.shang_cnt = parseInt(_item.shang_cnt) + 1;
                      that.setData({ item: _item });

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
                  var _item = that.data.item;
                  _item.shang_cnt = parseInt(_item.shang_cnt) + 1;
                  that.setData({ item: _item });

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
   * 举报信息打开窗口
   */
  open_msg_jubao:function(e){
    //console.log(e.target.dataset.mid)
    wx.navigateTo({
      url: '../msg_jubao/msg_jubao?mid=' + e.currentTarget.dataset.mid
    })
  },
  /**
   * 联系他
   */
  lx_ta:function(e){
   wx.makePhoneCall({
     phoneNumber: e.currentTarget.dataset.phone
   })
  },
  /**
   * 取用户的openid unid
   */
  getU_openid: function () {
    var that = this;
    if (app.globalData.openId == '') {
      wx.login({
        success: function (ires) {
          app.util.request({
            'url': 'entry/wxapp/get_userinfo',//Userinfo
            data: { code: ires.code },
            success(res) {
              var rpjosn = res.data.data;
              wx.hideLoading();
              //console.log('自请求');
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
  tapbyuserlist:function(e){
    if (e.currentTarget.dataset.openid!=''){
    wx.setStorageSync('byuser', e.currentTarget.dataset.openid);
    wx.setStorageSync('unickname', e.currentTarget.dataset.nkname);
    wx.navigateTo({
      url: '../msg_list_byuser/msg_list',
    });  
    }else{
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '不可查看,该用户点赞时未授权!',
      });
    }
  },
  /**
   * 菜单
   */
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
  },
  nav_home:function(){
    wx.switchTab({
      url: '../index/index'
    })

  },
  nav_back:function(){
    wx.navigateBack({
      delta:1
    });
  }
})