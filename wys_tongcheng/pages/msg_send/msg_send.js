var app = getApp();
var uploadUrl = "";
var oncode = '';//消息识别码
var QQMapWX = require('../../../we7/resource/plugin/qqmap/qqmap-wx-jssdk.min.js');
var WxParse = require('../../../we7/resource/plugin/wxParse/wxParse.js');
var userinfoUtil = require('../../resource/js/userinfoUtil.js');
var qqmapsdk;
var imgcnt = 6;
Page({
  data: {
    xieyi_isopen: false,
    showModalStatus: false,
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
    parent_tid: 0,
    parent_tname: '',
    top_open: false//置顶后台查询
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // console.log(this.zdy_url('entry/wxapp/msg_send_imgs'))
    app.setAppColor();
    var that = this;
    var parent_tid = options.parent_tid;
    var navTitle = '';
    if (parent_tid != 0) {
      navTitle = options.tname + '-' + options.parent_tname + " 发布";
    } else {
      navTitle = options.tname + " 发布";
    }

    wx.setNavigationBarTitle({
      title: navTitle
    });
    //app.util.footer(that);
    that.setData({
      tid: options.tid,
      tname: options.tname,
      parent_tid: options.parent_tid,
      parent_tname: options.parent_tname,
    });



    // app.util.request({
    //   'url': 'entry/wxapp/top_xianzhi',
    //   data: { tid: that.data.tid },
    //   success(res) {
    //     var rpjson = res.data.data;
    //     console.log(res.data);
    //     console.log('限制信息查询');
    //     console.log(rpjson);
    //     //限制置顶状态

    //   }
    // });



    //console.log(qqmapsdk)

   
    // console.log(fileuploadpath);
    //console.log(t1);
  

    app.util.request({
      'url': 'entry/wxapp/get_user_info',
      data: { u_openid: wx.getStorageSync('openId') },
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

          if (json.qq_map_key != '') {
            console.log('取地图key' + json.qq_map_key);
            app.globalData.qqmap_key = json.qq_map_key;
            //imgcnt = parseInt(json.imgs_cnt);

            if (app.globalData.qqmap_key == '') {
              qqmapsdk = new QQMapWX({ key: 'CMTBZ-H2R34-HNYUG-DCOZN-5UXZE-SLFXW' });
            } else {
              qqmapsdk = new QQMapWX({ key: app.globalData.qqmap_key });
            }

            that.gpsloc();
          }
          //设置地理信息

          if (json.top_status) {
            that.setData({ top_open: true });//限制后增加限制标注
          }

          if (json.xieyi_isopen == '1') {
            that.setData({ xieyi_isopen: true });
            WxParse.wxParse('content', 'html', json.xieyi_rmk, that, 5);
          }
          //


        }
      }
    });


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
    this.check_smrzbyuser();
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
   * 是否置顶combo操作
   */
  switch1Change: function (e) {
    var that = this;
    console.log(that.data.top_open)
    if (!that.data.top_open) {
      that.setData({
        showView: !this.data.showView
      });
    } else {
      that.setData({
        showView: false
      });
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '置顶数制已达上限!',
      });
    }

    //console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  }, bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 确认选择发布协议
   */
  tapnet_xieyi: function (e) {
    this.setData({
      isread: e.detail.value.length
    });
  },
  /**
   * 表单提交
   */
  formSubmit: function (e) {
    var that = this;
    var formID = e.detail.formId;
    //模板消息
    // app.util.request({
    //   'url': 'entry/wxapp/send_templ',
    //   data: { openid: app.globalData.openId, formid: formID },
    //   success(res) {
    //     console.log('推送模板')
    //     console.log(res.data)
    //   }
    // });

    uploadUrl = that.zdy_url('entry/wxapp/msg_send_imgs');
    var formobj = e.detail.value;
    formobj.isread = that.data.isread;
    if (formobj.istopstatus) {
      formobj.money = that.data.objectArray[e.detail.value.dayindex].money;
      formobj.topdyas = that.data.objectArray[e.detail.value.dayindex].days;
      formobj.status = 0;
    } else {
      formobj.money = 0;
      formobj.topdyas = 0;
      formobj.status = 1;
    }
    formobj.istop = formobj.istopstatus ? '1' : '0';
    //province
    formobj.u_nickname = app.globalData.userInfo.nickName;
    formobj.u_city = app.globalData.userInfo.city;
    formobj.u_openid = app.globalData.openId;
    formobj.u_unionid = '';
    formobj.u_avatarurl = app.globalData.userInfo.avatarUrl;
    formobj.formID = formID;

    formobj.loc_nation_code = that.data.nation_code;
    formobj.loc_nation = that.data.nation;
    formobj.loc_province = that.data.province;
    formobj.loc_city_code = that.data.city_code;
    formobj.loc_city = that.data.city;
    formobj.loc_district = that.data.district;

    console.log(formobj);
    //console.log(app.globalData.userInfo)

    var ck_text = '';
    var ck_type = '';
    if (that.data.loc_type == '0') {
      ck_type = '国家';
      ck_text = formobj.loc_nation;
    } else if (that.data.loc_type == '1') {
      ck_type = '省';
      ck_text = formobj.loc_province;
    } else if (that.data.loc_type == '2') {
      ck_type = '市';
      ck_text = formobj.loc_city;
    } else if (that.data.loc_type == '3') {
      ck_type = '区/县';
      ck_text = formobj.loc_district;
    }


    // console.log('；国check==')    
    // console.log(that.data.loc_type == '0' && formobj.loc_nation.indexOf(that.data.loc_text)!=-1);
    // console.log('；省check==')
    // console.log(that.data.loc_type == '1' && formobj.loc_province.indexOf(that.data.loc_text) != -1);
    // console.log('；市check==')
    // console.log(that.data.loc_type == '2' && formobj.loc_city.indexOf(that.data.loc_text) != -1);
    // console.log('；区check==')
    // console.log(that.data.loc_type == '3' && formobj.loc_district.indexOf(that.data.loc_text) != -1);


    var phone_isopen = that.data.phone_isopen;
    if (formobj.content == '') {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '消息内容不能为空!',
      });
    } else if (phone_isopen && formobj.phone == '') {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '手机号码不能为空!',
      })
    } else if (formobj.gpsaddress == '' || formobj.gpsaddress == '位置') {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '发送位置不能为空!',
      })
    } else if (formobj.isread != '1') {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '请先选择已阅读关于发布协议确认!',
      })
    } else if (that.data.loc_type != '-1' && (ck_text.indexOf(that.data.loc_text) == -1)) {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '限制发布' + ck_type + ':' + that.data.loc_text + '!',
      })
    } else {
      wx.showLoading({
        title: '信息保存中...',
      });
      //限制数量查询


      //上传信息
      app.util.request({
        'url': 'entry/wxapp/msg_send',
        data: formobj,
        method:'post',
        success(res) {
          // console.log(res.data);
          var rpjson = res.data.data;
          if (rpjson.rp_status == 1) {
            //消息识别码
            oncode = rpjson.oncode;
            //返回总金额
            that.setData({ ordermoney: parseFloat(rpjson.ordermoney) });
            wx.hideLoading();

            //上传图片
            var successUp = 0; //成功个数
            var failUp = 0; //失败个数
            var length = that.data.imglist.length; //总共个数
            if (length > 0) {
              var i = 0; //第几个
              that.uploadDIY(that.data.imglist, successUp, failUp, i, length);
              wx.showLoading({
                title: '图片上传中...',
              });
            } else {
              //如果金额大于0发起支付信息
              //ordermoney
              if (that.data.ordermoney > 0) {
                that.payMoney(that.data.ordermoney);
              } else {
                that.send_over();
              }
            }

          } else {

            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '您已被禁止发布信息!请联系管理员' + rpjson.bk_lianxi
            });
          }
        }
      });
    }

    //上传图片地址
    // var usrfile =;//('entry/wxapp/msg_send_imgs', { m:app.globalData.wx_model_name});
    // for (var i = 0, len = that.data.imglist.length; i < len; i++) {
    // wx.uploadFile({
    //   url: usrfile,
    //   filePath: that.data.imglist[i],
    //   name: 'file',
    //   formData: formobj,
    //   header: {
    //     'content-type': 'multipart/form-data'
    //   },
    //   success: function (res) {
    //     var json = res.data;
    //     console.log('request：');
    //     console.log(res.data);
    //     var json_b = JSON.parse(res.data);
    //     console.log(json_b.message)
    //     console.log(json_b.data.messate);
    //     console.log(json_b.data.fileimg);

    //     if (i == (len - 1)){
    //       console.log('上传结束')
    //     }

    //   }
    // })

    // }

  },
  /* 函数描述：作为上传文件时递归上传的函数体体；
   * 参数描述： 
   * filePaths是文件路径数组
   * successUp是成功上传的个数
   * failUp是上传失败的个数
   * i是文件路径数组的指标
   * length是文件路径数组的长度
   */
  uploadDIY(filePaths, successUp, failUp, i, length) {
    var that = this;
    //console.log(uploadUrl)
    wx.uploadFile({
      url: uploadUrl,
      filePath: filePaths[i],
      name: 'file',
      formData: { 'oncode': oncode },
      success: (resp) => {
        console.log('suc->图片上传')
        console.log(resp)
        successUp++;
      },
      fail: (res) => {
        failUp++;
      },
      complete: () => {
        i++;
        if (i == length) {
          wx.hideLoading();
          //查看是否需要付费
          console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！');
          //this.payMoney(0.01);


          if (that.data.ordermoney > 0) {
            that.payMoney(that.data.ordermoney);
          } else {
            that.send_over();
          }

        }
        else {  //递归调用uploadDIY函数
          this.uploadDIY(filePaths, successUp, failUp, i, length);
        }
      },
    });
  },
  /**
   * 打开地图选择位置
   */
  open_map_chonse: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          gpsaddress: res.address
        });
        //address: res.name || res.address
      },
      fail: function (res) {
        // wx.showToast({
        //   image: '../../resource/images/static/error.png',
        //   title: '调用失败,本机不支持地图选择地址!',
        // });
      },
      complete: function (res) {
        //console.log(res);
      }
    });


  },
  /**
   * 获取位置
   */
  gpsloc: function () {
    var that = this;

    wx.getLocation({
      type: 'gcj02',
      success: function (mapsucres) {
        wx.setStorageSync('latitude', mapsucres.latitude);
        wx.setStorageSync('longitude', mapsucres.longitude);
        that.setData({
          longitude: mapsucres.longitude,
          latitude: mapsucres.latitude
        });
        that.getLocinfo_revLf(mapsucres.latitude, mapsucres.longitude);
        // var speed = res.speed
        // var accuracy = res.accuracy
      },
      fail: function () {
        wx.showModal({
          title: '警告',
          content: '发布消息必须要地理位置信息',
          confirmText: '去设置',
          success: function (res) {
            if (res.confirm) {

              wx.openSetting({
                success: function (pdata) {
                  if (pdata) {
                    if (pdata.authSetting["scope.userLocation"] == true) {
                      console.log('取得授权信息成功');
                      that.getLocinfo();
                    } else {
                      console.log('===========')
                      that.gpsloc();
                    }
                  }
                }
              });
              console.log('用户点击确定')
            } else if (res.cancel) {
              that.gpsloc();
              // console.log('用户点击取消')
            }
          }
        });

      }
    });

  },
  /**
   * 直接内解析
   */
  getLocinfo_revLf: function (latitude, longitude) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      coord_type: 5,
      success: function (res) {
        console.log('地址逆解析:')
        console.log(res);
        console.log(res.result.ad_info);
        that.setData({
          'nation_code': res.result.ad_info.nation_code,
          'nation': res.result.ad_info.nation,
          'province': res.result.ad_info.province,
          'city_code': res.result.ad_info.city_code,
          'city': res.result.ad_info.city,
          'district': res.result.ad_info.district
        });

        that.setData({
          gpsaddress: res.result.address
        });
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  /**
   * 地址解析 先获取 
   */
  getLocinfo: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
        wx.setStorageSync('latitude', res.latitude);
        wx.setStorageSync('longitude', res.longitude);

        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          coord_type: 5,
          success: function (res) {
            console.log('地址逆解析:')
            console.log(res);
            console.log(res.result.ad_info);

            that.setData({
              'nation_code': res.result.ad_info.nation_code,
              'nation': res.result.ad_info.nation,
              'province': res.result.ad_info.province,
              'city_code': res.result.ad_info.city_code,
              'city': res.result.ad_info.city,
              'district': res.result.ad_info.district
            });

            that.setData({
              gpsaddress: res.result.address
            });
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            // console.log(res);
          }
        });

      }
    });


  }
  ,
  /**
   * 选择图片
   */
  choosePic: function () {
    var that = this;
    var imglist = this.data.imglist;
    var imglistlength = imglist.length;
    //imgcnt
    wx.chooseImage({
      count: imgcnt - imglistlength, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 'original', 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths)
        for (var i = 0, len = tempFilePaths.length; i < len; i++) {
          imglist.push(tempFilePaths[i]);
        }
        that.setData({
          imglist: imglist,
          upimgbtt: imglist.length >= imgcnt
        });
      },
      fail: function (res) {

        // wx.showModal({
        //   title: '图片选择错误!',
        //   content: JSON.stringify(res),
        // })

      }
    });

  },
  /**
   * 图片删除
   */
  pic_remove: function (e) {
    //console.log(e.currentTarget.dataset.img);
    Array.prototype.indexOf = function (val) { for (var i = 0; i < this.length; i++) { if (this[i] == val) return i } return -1 };
    Array.prototype.remove = function (val) { var index = this.indexOf(val); if (index > -1) { this.splice(index, 1) } };
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
            imglist: imglist,
            upimgbtt: imglist.length >= imgcnt
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  /**
   * 支付
   */
  payMoney: function (money) {
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
       // console.log(rpjson)
        if (rpjson.have_user) {
          if (rpjson.ck_status) {
            //支付频道
            var rp_pay_channel = rpjson.pay_channel;
            var rp_pay_money = rpjson.pay_money;
            var rp_title="";
            var rp_pay_title="";
            if (rp_pay_channel =='integral'){
              rp_title = "积分可支付,支付积分:" + rp_pay_money;
              rp_pay_title="积分支付";
            } else if (rp_pay_channel == 'account') {
              rp_title = "帐户可支付,支付:" + rp_pay_money+'元';
              rp_pay_title = "帐户支付";
            }
            wx.showModal({
              title: '提示',
              content: rp_title,// '帐户可支付，确认支付' + money + '元？',
              cancelText:'取消',
              confirmText: rp_pay_title,//'帐户支付',
              success: function (res) {
                if (res.confirm) {
                 // console.log('支付' + money+oncode+'account');
                  app.util.request({
                    'url': 'entry/wxapp/update_pay_auditstatus',
                    data: {
                      pay_channel: rp_pay_channel,
                      oncode: oncode,
                      status: 1,
                      ptype: "msg",
                      fee: money,
                      openid: app.globalData.openId,//用户的openid
                      u_nickname: app.globalData.userInfo.nickName,
                      u_avatarurl: app.globalData.userInfo.avatarUrl
                    },
                    success(crpres) {                    
                      that.send_over();
                    }
                  });

                } else {
                  //转向我的发布
                  that.wx_api_pay_msg(money, oncode);
                }
              }
            });
          } else {
            //  wx.showToast({
            //    image: '../../resource/images/static/error.png',
            //    title: '帐户金币不足,微信支付',
            //  });

            that.wx_api_pay_msg(money, oncode);
          }

        } else {
          //没有该用户直接微信支付
          that.wx_api_pay_msg(money, oncode);
        }
      }
    });

  },
  /**
   * 调用微信支付
   */
  wx_api_pay_msg: function (money, _oncode) {
    var that = this;
    var min = 1000, max = 9999;
    var rnum = Math.floor(Math.random() * (max - min + 1) + min) + new Date().getTime();
    var prepay_id = "";
    console.log(money + '<>' + _oncode)
    app.util.request({
      'url': 'entry/wxapp/pay',
      data: {
        openid: app.globalData.openId,
        sum: money,
        oncode: _oncode + "," + rnum,
        ptype: "msg"
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
              //that.send_over();
              //检查支付回调成功
              app.util.request({
                'url': 'entry/wxapp/update_pay_auditstatus',
                data: {
                  pay_channel: 'wx',
                  oncode: _oncode,
                  status: 1,
                  ptype: "msg",
                  fee: money,
                  u_nickname: app.globalData.userInfo.nickName,
                  u_avatarurl: app.globalData.userInfo.avatarUrl,
                  rnum: rnum
                },
                success(crpres) {
                  console.log('支付回调检查:');
                  console.log(crpres.data.data);
                  that.send_over();
                }
              });
            },
            'fail': function (res) {
              //支付失败后，
              // console.log(res)
              //转向我的发布
              wx.redirectTo({
                url: '../myuser_send/msg_list',
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

    // wx.showModal({
    //   title: '确认支付',
    //   content: '确认支付' + money + '元？',
    //   success: function (res) {
    //     if (res.confirm) {
    //      ;

    //     } else {
    //       //转向我的发布
    //       wx.redirectTo({
    //         url: '../myuser_send/msg_list',
    //       });
    //     }
    //   }
    // });
  }
  ,
  /**
   * 退出发布界面
   */
  send_over: function () {
    console.log('退出')
    //  wx.navigateBack({
    //    delta: 2
    //  });
    wx.hideLoading();

    //   wx.redirectTo({
    //   url: '../index/index'
    // });
    //WxNotificationCenter.postNotificationName("close_win_release");
    wx.redirectTo({
      url: '../myuser_send/msg_list',
    });

  }
  ,
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util_model(currentStatu)
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
          showModalStatus: false
        });
      }
    }.bind(this), 200);
    // 显示  
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  }


})