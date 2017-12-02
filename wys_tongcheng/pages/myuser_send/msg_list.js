var app = getApp();
var page_0 = 1;
var oncode = "";
var imgcnt = 6;
var userinfoUtil = require('../../resource/js/userinfoUtil.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isread: 1,//是否已阅读发布协议
    nation_code: '',
    nation: '',
    province: '',
    city_code: '',
    city: '',
    district: '',
    loc_type: '-1',//限制类型 －1不限制
    loc_text: '',//限制字段检查
    index: 0,
    showView: false,
    gpsaddress: "位置",
    longitude: 0,
    latitude: 0,
    imglist: [],
    ordermoney: 0.0,//金额
    is_top: false,
    phone_isopen: false,
    tid: 0,
    tname: '',
    top_open: false,//置顶后台查询
    showModalStatus_top: false,
    ismore: true,//是否有更多 
    currentTab: 0,
    m_list_0: [],
    idx: 0,//更新内容ID
    top_open: false,//置顶后台查询 false 为不限制
    oncode: '',
    mid: '',//消息id 
    defaultmoney: 0
  }, bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppColor();
    var that = this;


    that.setData({
      tid: options.tid,
      ubinfo: wx.getStorageSync('ubinfo')
    });

    app.util.request({
      'url': 'entry/wxapp/get_user_info',
      data: {
        u_openid: wx.getStorageSync('openId'),
        is_no: 1
      },
      success(res) {
        var json = res.data.data;
        //console.log('系统信息')
        //console.log(res.data)
        if (json) {
          that.setData({ user: json, phone_isopen: json.phone_isopen });
          if (json.is_top == '' || json.is_top == '0') {
            that.setData({ is_top: false });
          } else if (json.is_top == '1') {
            that.setData({ is_top: true });
          }

          if (json.topguizhe != '' && json.topguizhe.length > 0) {
            that.setData({ objectArray: json.topguizhe });
          }

          if (typeof (json.u_nickname) != 'undefined' && json.u_nickname != '') {
            //console.log('NNNNNNn:' + json.u_nickname)
            if (app.globalData.userInfo != null)
              app.globalData.userInfo.nickName = json.u_nickname;
          }

          if (json.imgs_cnt != '') {
            console.log('图片限制数量' + json.imgs_cnt);
            imgcnt = parseInt(json.imgs_cnt);
          }
          //设置地理限制
          that.setData({
            loc_type: json.loc_type,
            loc_text: json.loc_text
          });
          //设置地理信息

          if (json.top_status) {
            that.setData({ top_open: true });//限制后增加限制标注
          }


        }
      }
    });


    //获取用户信息
    setTimeout(function () {
      userinfoUtil.getUserinfo();
    }, 100);


    page_0 = 1;
    that.setData({ m_list_0: [] });
    that.load_list(5, page_0);

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
   // var that = this;
  
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 幻灯片出租
   */
  tapbanner: function (e) {
    var mdet = e.currentTarget.dataset;
    //  idx: 0, mid: "324", is_placed_top: "0", money: "0", oncode: "1501658669CR-nJcLqQsa",tid:"16"
    wx.setStorage({
      key: 'msg_det',
      data: mdet
    });
    //console.log(mdet)
    //redirectTo
    wx.redirectTo({
      url: '../banner_sale_list/page'
    });
  },
  /**
   * 加载列表
   */
  load_list: function (m_type, _page) {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/get_msg_list',
      data: {
        page: _page,
        pagesize: 10,
        m_type: m_type,
        m_typeid: that.data.tid,
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
          if (len == 0 ) {
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
    console.log(e.currentTarget.dataset.imgs)
    // //img imgs
    wx.previewImage({
      current: e.currentTarget.dataset.img,// e.currentTarget.dataset.img, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.imgs//[] // 需要预览的图片http链接列表
    })
  },
  /**
   * 弹出评论窗口
   */
  show_comments: function (e) {
    var that = this;
    //console.log(e.currentTarget.dataset.idx)
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
    var that = this;
    var formobj = e.detail.value;

    formobj.u_unionid = app.globalData.unionId;
    formobj.u_openid = app.globalData.openId;
    formobj.u_nickname = app.globalData.userInfo.nickName;
    formobj.u_city = app.globalData.userInfo.city;
    formobj.u_avatarurl = app.globalData.userInfo.avatarUrl;
    formobj.u_gender = app.globalData.userInfo.gender;
    formobj.u_province = app.globalData.userInfo.province;
    formobj.u_country = app.globalData.userInfo.country;
    if (formobj.pl_content == '') {
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
    var tg = e.currentTarget.dataset;
    var m_idx = tg.idx;
    var formobj = app.globalData.userInfo;
    formobj.mid = tg.mid;
    app.util.request({
      'url': 'entry/wxapp/send_goods',
      data: formobj,
      success(res) {
        //刷新评论
        //list_t[m_idx].comments = ;
        if (that.data.currentTab == 0) {
          var list_t = that.data.m_list_0;
          list_t[m_idx].isgoods = res.data.data.isgoods;
          list_t[m_idx].goods_cnt = res.data.data.allgoods;
          that.setData({ m_list_0: list_t });
        }
        //刷新评论结束
      }
    });
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
      that.load_list(5, page_0);
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
        that.load_list(5, page_0);
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
   * 免顶通过
   */
  notopaudit: function () {

  },
  /**
   * 支付
   */
  paymoney: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset)
    oncode = e.currentTarget.dataset.oncode;
    that.setData({
      idx: e.currentTarget.dataset.idx
    });
    var money = e.currentTarget.dataset.money;
    var tid = e.currentTarget.dataset.tid;
    var is_placed_top = e.currentTarget.dataset.is_placed_top;

    if (is_placed_top == '1') {
      //console.log(tid + "|" + is_placed_top)
      app.util.request({
        'url': 'entry/wxapp/top_xianzhi',
        data: { tid: tid },
        success(res) {
          var rpjson = res.data.data;
          console.log('限制信息查询');
          //console.log(rpjson);
          //限制置顶状态
          if (rpjson.top_status) {
            //限制后增加限制标注
            that.setData({ top_open: true });
            //提示置顶已满不可支付
            wx.showToast({
              image: '../../resource/images/static/error.png',
              title: '置顶数制已达上限,该消息不可置顶支付!',
            });
          } else {
            //可生成支付提交

            that.pay_money(money, oncode, 'moneyandtop');
          }
        }
      });
    } else {

      that.pay_money(money, oncode, 'moneyandtop');
    }
    //更新
    //idx = e.currentTarget.dataset.idx;

  }

  ,
  /**
   * 消息置顶
   */
  tapmsg_top: function (e) {
    console.log(e.currentTarget.dataset);
    oncode = e.currentTarget.dataset.oncode;
    this.setData({
      idx: e.currentTarget.dataset.idx,
      mid: e.currentTarget.dataset.mid,
      oncode: e.currentTarget.dataset.oncode,
      tid: e.currentTarget.dataset.tid,
      defaultmoney: e.currentTarget.dataset.defaultmoney,
      payStatus: e.currentTarget.dataset.paystatus
    });
    // console.log(e.currentTarget.dataset.defaultmoney)
    this.util_model('open');
    //console.log(e.currentTarget.dataset.payStatus)
  },
  /**
   * 其它操作
   */
  tapopenmsg: function (e) {
    //Array.prototype.indexOf = function (val) { for (var i = 0; i < this.length; i++) { if (this[i] == val) return i } return -1 };
    //根据元素删除
    // Array.prototype.remove = function (val) { var index = this.indexOf(val); if (index > -1) { this.splice(index, 1) } };
    //根据下标删除
    Array.prototype.delete = function (delIndex) { var temArray = []; for (var i = 0; i < this.length; i++) { if (i != delIndex) { temArray.push(this[i]) } } return temArray }

    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var mid = e.currentTarget.dataset.mid;
    //console.log(e.currentTarget.dataset.mid)
    wx.showActionSheet({
      itemList: ['删除'],
      success: function (res) {
        if (res.tapIndex == 0) {
          that.del_msg(mid, idx);
        }
      }
    });

  },
  /**
   * 其它操作
   */
  tap_del_msg: function (e) {  
 var that = this;
    var idx = e.currentTarget.dataset.idx;
    var mid = e.currentTarget.dataset.mid;
    //console.log(e.currentTarget.dataset.mid)

    wx.showModal({
      title: '提示',
      content: '是否删除?',
      success: function (res) {
        if (res.confirm) {
          that.del_msg(mid, idx);
        }
      }
    })

  },
  /**
   * 删除消息
   */
  del_msg: function (_mid, _idx) {
Array.prototype.delete = function (delIndex) { var temArray = []; for (var i = 0; i < this.length; i++) { if (i != delIndex) { temArray.push(this[i]) } } return temArray }

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/del_msg',
      data: { mid: _mid },
      success(res) {
        var json = res.data.data;
        console.log(json)
        if (json.delstatus == '1') {
          var list_t = that.data.m_list_0;
          list_t = list_t.delete(_idx);
          that.setData({ m_list_0: list_t });
        }
        //限制置顶状态
      }
    });
  },
  /**
   * 刷新消息日期
   */
  tap_refresh_msg: function (e) {
    var that = this;
    oncode = e.currentTarget.dataset.oncode;
    var idx = e.currentTarget.dataset.idx;
    var mid = e.currentTarget.dataset.mid;
    that.setData({
      idx: e.currentTarget.dataset.idx,
      mid: e.currentTarget.dataset.mid,
      oncode: e.currentTarget.dataset.oncode
    });
    
    
    wx.showModal({
      title: '提示',
      content: '是否刷新?',
      success: function (res) {
        if (res.confirm) {
          //that.del_msg(mid, idx);

          app.util.request({
            'url': 'entry/wxapp/get_msg_refresh_crtime_money',
            data: {
              oncode: oncode
            },
            success(res) {
              var rpjson = res.data.data;
              if (rpjson.money>0){
                that.pay_money(rpjson.money, oncode, 'msg_refresh_crtime');
              }else{
                that.do_refresh_msg(mid,idx);
              }

            }
          });
          //
        }
      }
    })

  },
  /**
   * 删除消息
   */
  do_refresh_msg: function (_mid, _idx) {

    var that = this;
    app.util.request({
      'url': 'entry/wxapp/msg_refresh_time',
      data: { mid: _mid },
      success(res) {
        var json = res.data.data;
        console.log(json)
        if (json.ref_status == '1') {
          var list_t = that.data.m_list_0;
          list_t[_idx].crtime = json.refresh_time;
          that.setData({ m_list_0: list_t });
        }
        //限制置顶状态
      }
    });
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util_model(currentStatu);
  },
  util_model: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });
    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;
    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();
    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    });
    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      });
      //关闭    
      if (currentStatu == "close") {
        this.setData({
          showModalStatus_top: false
        });
      }
    }.bind(this), 200);
    // 显示  
    if (currentStatu == "open") {
      this.setData({
        showModalStatus_top: true
      });
    }
  },
  /**
   * 置顶支付
   */
  dopay_top: function () {
    var that = this;
    var money = that.data.objectArray[that.data.index].money;
    // console.log(that.data.idx);
    // console.log(that.data.mid);
    // console.log(that.data.oncode);
    // console.log(that.data.tid);
    // console.log(money);
    //console.log(topdyas);


    that.paymoney_top(money);
  },
  /**
   * 支付检查
   */
  paymoney_top: function (_money) {
    var that = this;
    var payStatus = that.data.payStatus;
    
    var money=0;
    if (payStatus=='0'){
      money = parseFloat(_money) + parseFloat(that.data.defaultmoney);
    }else{
      money = parseFloat(_money);
    }
    
    var tid = that.data.tid;
    var is_placed_top = 1;
    if (is_placed_top == '1') {
      app.util.request({
        'url': 'entry/wxapp/top_xianzhi',
        data: { tid: tid },
        success(res) {
          var rpjson = res.data.data;
          console.log('限制信息查询');
          //console.log(rpjson);
          //限制置顶状态
          if (rpjson.top_status) {
            //限制后增加限制标注
            that.setData({ top_open: true });
            //提示置顶已满不可支付
            wx.showToast({
              image: '../../resource/images/static/error.png',
              title: '置顶数制已达上限,该消息不可置顶支付!',
            });
          } else {
            //可生成支付提交
            that.pay_money(money, oncode, 'top');
          }
        }
      });
    }
    //更新
    //idx = e.currentTarget.dataset.idx;

  },
  pay_money: function (money, oncode, paytype) {
    var that = this;
    console.log(oncode + "<> " + paytype + "<> " + money + "<> " + that.data.idx + "<>" + that.data.mid);
    //return false;
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
              confirmText: rp_pay_title,// '帐户支付',
              success: function (res) {
                if (res.confirm) {
                  // console.log('支付' + money+oncode+'account');

                  if (paytype == 'top') {
                    var topdyas = that.data.objectArray[that.data.index].days;
                    app.util.request({
                      'url': 'entry/wxapp/msg_top',
                      data: {
                        mid: that.data.mid,
                        istop: 1,
                        topdays: topdyas,
                        money: money
                      },
                      success(res) {
                        if (res.data.data == 1) {
                          var list_t = that.data.m_list_0;
                          list_t[that.data.idx].is_placed_top = 1;
                          list_t[that.data.idx].placed_top_money = money;
                          list_t[that.data.idx].placed_top_days = topdyas;
                          list_t[that.data.idx].total_money = money;
                          that.setData({ m_list_0: list_t });
                        }
                      }
                    });

                  }
                  var up_ptype='';
                  if (paytype == 'top' || paytype == 'moneyandtop') {
                    up_ptype ='msg';//信息支付
                  } else if (paytype == 'msg_refresh_crtime'){
                    up_ptype = 'msg_refresh_crtime';//信息支付
                  }
                  //

                  //提交订单信息
                  app.util.request({
                    'url': 'entry/wxapp/update_pay_auditstatus',
                    data: {
                      pay_channel: rp_pay_channel,
                      oncode: oncode,
                      status: 1,
                      ptype: up_ptype,//"msg",
                      fee: money,
                      openid: app.globalData.openId,//用户的openid
                      u_nickname: app.globalData.userInfo.nickName,
                      u_avatarurl: app.globalData.userInfo.avatarUrl
                    },
                    success(crpres) {
                      if (paytype == 'top'){
                        that.util_model('close');
                      }

                      if (paytype == 'top' || paytype == 'moneyandtop') {
                        var list_t = that.data.m_list_0;
                        list_t[that.data.idx].payStatus = 1;
                        list_t[that.data.idx].is_placed_top = 1;
                        that.setData({ m_list_0: list_t });
                      } else if (paytype == 'msg_refresh_crtime'){
                        //刷新日期
                        that.do_refresh_msg(that.data.mid, that.data.idx);
                      } 
                     
                    }
                  });

                  wx.showToast({title: '帐户支付成功'});
                  

                } else {
                  //转向我的发布
                  that.wx_api_pay_msg(money, oncode, paytype);
                }
              }
            });
          } else {
            //  wx.showToast({
            //    image: '../../resource/images/static/error.png',
            //    title: '帐户金币不足,微信支付',
            //  });

            that.wx_api_pay_msg(money, oncode, paytype);
          }

        } else {
          //没有该用户直接微信支付
          that.wx_api_pay_msg(money, oncode, paytype);
        }
      }
    });

  },
  /**
   * 微信支付
   */
  wx_api_pay_msg: function (money, oncode, paytype) {
    var that = this;
    var min = 1000, max = 9999;
    var rnum = Math.floor(Math.random() * (max - min + 1) + min) + new Date().getTime();


    var up_ptype = '';
    if (paytype == 'top' || paytype == 'moneyandtop') {
      up_ptype = 'msg';//信息支付
    } else if (paytype == 'msg_refresh_crtime') {
      up_ptype = 'msg_refresh_crtime';//信息支付
    }
    //money=0.01;

    var prepay_id = "";
    app.util.request({
      'url': 'entry/wxapp/pay',
      data: {
        openid: app.globalData.openId,
        sum: money,
        oncode: that.data.oncode + "," + rnum,
        ptype: up_ptype//"msg"
      },
      'cachetime': '0',
      success(res) {
        prepay_id = res.data.data.package;
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
              console.log(res);
              if (paytype == 'top') {

                var topdyas = that.data.objectArray[that.data.index].days;
                app.util.request({
                  'url': 'entry/wxapp/msg_top',
                  data: {
                    mid: that.data.mid,
                    istop: 1,
                    topdays: topdyas,
                    money: money
                  },
                  success(res) {
                    if (res.data.data == 1) {
                      var list_t = that.data.m_list_0;
                      list_t[that.data.idx].is_placed_top = 1;
                      list_t[that.data.idx].placed_top_money = money;
                      list_t[that.data.idx].placed_top_days = topdyas;
                      list_t[that.data.idx].total_money = money;
                      that.setData({ m_list_0: list_t });
                    }

                    wx.showToast({ title: '微信支付成功' });
                  }

                  
                });

              }

              app.util.request({
                'url': 'entry/wxapp/update_pay_auditstatus',
                data: {
                  pay_channel: 'wx',
                  oncode: oncode,
                  status: 1,
                  prepay_id: prepay_id,
                  ptype: up_ptype,//"msg",
                  fee: money,
                  u_nickname: app.globalData.userInfo.nickName,
                  u_avatarurl: app.globalData.userInfo.avatarUrl,
                  rnum: rnum
                },
                success(crpres) {
                  console.log('支付回调检查:');
                 
                  if (paytype == 'top') {
                    that.util_model('close');
                  }

                  if (paytype == 'top' || paytype == 'moneyandtop') {
                    var list_t = that.data.m_list_0;
                    list_t[that.data.idx].payStatus = 1;
                    list_t[that.data.idx].is_placed_top = 1;
                    that.setData({ m_list_0: list_t });
                  } else if (paytype == 'msg_refresh_crtime') {
                    //刷新日期
                    that.do_refresh_msg(that.data.mid, that.data.idx);
                  }


                }
              });

            },
            'fail': function (res) {
              //支付失败后，
              console.log(res)
              //
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

        if (paytype == 'top') {
          that.util_model('close');
        }

        //
      }
    });
  }


})