
var app = getApp();
var QQMapWX = require('../../../../we7/resource/plugin/qqmap/qqmap-wx-jssdk.min.js');
var userinfoUtil = require('../../../resource/js/userinfoUtil.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keiy: [
      { "name": "临时拼车", "cls": "act", "img": "" },
      { "name": "长期拼车", "cls": "", "img": "ab" }
    ],
    showModalStatus_shang: false,//打赏状态
    showModalStatus_sheet: false,
    dates: '出发日期',
    times: '出发时间',
    dates_start: '开始日期',
    times_start: '开始时间',
    dates_end: '结束日期',
    times_end: '结束时间',
    pc_type: '选择拼车类型',
    type: "临时拼车"

  },
  dsf_ds_s: function (e) {
    var okjx = e.currentTarget.dataset.idx,
      sd_sd = this.data.keiy
    sd_sd.map(function (a) {
      a.cls = ""
    })
    sd_sd[okjx].cls = "act"
    this.setData({
      keiy: sd_sd,
      type: sd_sd[okjx].name
    })

  }, /**
   * 表单提交
   */
  formSubmit: function (e) {
    var that = this;
    var formID = e.detail.formId;
    var formobj = e.detail.value;
    formobj.formID = formID;
    formobj.u_nickname = app.globalData.userInfo.nickName;
    formobj.u_city = app.globalData.userInfo.city;
    formobj.u_openid = app.globalData.openId;
    formobj.u_unionid = '';
    formobj.u_avatarurl = app.globalData.userInfo.avatarUrl;

    formobj.dates = that.data.dates;
    formobj.times = that.data.times;

    formobj.dates_start = that.data.dates_start;
    formobj.times_start = that.data.times_start;

    formobj.dates_end = that.data.dates_end;
    formobj.times_end = that.data.times_end; 
   

    formobj.pc_type = that.data.pc_type;
    formobj.type = that.data.type; 
    //console.log(formobj.name)

    formobj.msg_address = that.data.msg_address;
    formobj.msg_lon = that.data.msg_lon;
    formobj.msg_lat = that.data.msg_lat;

    formobj.msg_nation = that.data.msg_nation;
    formobj.msg_province = that.data.msg_province;
    formobj.msg_city = that.data.msg_city;
    formobj.msg_district = that.data.msg_district;
    formobj.msg_street = that.data.msg_street;
    formobj.msg_street_number = that.data.msg_street_number;

    formobj.address_start = that.data.address_start;
    formobj.address_start_lon = that.data.address_start_lon;
    formobj.address_start_lat = that.data.address_start_lat;

    formobj.address_start_nation = that.data.address_start_nation;
    formobj.address_start_province = that.data.address_start_province;
    formobj.address_start_city = that.data.address_start_city;
    formobj.address_start_district = that.data.address_start_district;
    formobj.address_start_street = that.data.address_start_street;
    formobj.address_start_street_number = that.data.address_start_street_number;

    formobj.address_end = that.data.address_end;
    formobj.address_end_lon = that.data.address_end_lon;
    formobj.address_end_lat = that.data.address_end_lat;

    formobj.address_end_nation = that.data.address_end_nation;
    formobj.address_end_province = that.data.address_end_province;
    formobj.address_end_city = that.data.address_end_city;
    formobj.address_end_district = that.data.address_end_district;
    formobj.address_end_street = that.data.address_end_street;
    formobj.address_end_street_number = that.data.address_end_street_number;

    formobj.op="add";

  console.log(formobj);
    //return false;
  if (formobj.pc_type == '' || formobj.pc_type == '选择拼车类型') {
    wx.showToast({
      image: '../../../resource/images/static/error.png',
      title: '拼车类型不能为空!',
    })
  } else if (formobj.address_start == '' || formobj.address_start == '位置') {
    wx.showToast({
      image: '../../../resource/images/static/error.png',
      title: '起点位置不能为空!',
    })
  } else if (formobj.address_end == '' || formobj.address_end == '你要去哪儿') {
    wx.showToast({
      image: '../../../resource/images/static/error.png',
      title: '终点位置不能为空!',
    })
  } else if (formobj.num == '') {
    wx.showToast({
      image: '../../../resource/images/static/error.png',
      title: '人数不能为空!',
    })
  } else  if (formobj.dates == '' || formobj.dates == '出发日期') {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '出发日期不能为空!',
      });
  } else if (formobj.times == '' || formobj.times == '出发时间') {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '出发时间不能为空!',
      })
  }
  

  else if (formobj.type == "长期拼车" && (formobj.dates_start == '' || formobj.dates_start == '开始日期' )) {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '开始日期不能为空!',
      });
  } else if (formobj.type == "长期拼车" && (formobj.times_start == '' || formobj.times_start == '开始时间')) {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '开始时间不能为空!',
      })
    }

  else if (formobj.type == "长期拼车" && (formobj.dates_end == '' || formobj.dates_end == '结束日期')) {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '结束日期不能为空!',
      });
  } else if (formobj.type == "长期拼车" && (formobj.times_end == '' || formobj.times_end == '结束时间')) {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '结束时间不能为空!',
      })
    }
  else if (formobj.u_phone == '') {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '手机号码不能为空!',
      })
    } else {
      wx.showLoading({
        title: '信息保存中...',
      });
      //限制数量查询

     
      //上传信息
      app.util.request({
        'url': 'entry/wxapp/pinche_msg_action',
        data: formobj,
        method:'POST',
        success(res) {
          // console.log(res.data);
          var rpjson = res.data.data;
         // console.log(rpjson)
          wx.showModal({
            title: '发布成功',
            content: '您的信息已发布成功',
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                });
              } else if (res.cancel) {
                
              }
            }
          });
         

        }
      });
    }


  },
  //  点击时间组件确定事件  1
  bindTimeChange: function (e) {

    this.setData({
      times: e.detail.value
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {

    this.setData({
      dates: e.detail.value
    })
  },



  //  点击时间组件确定事件  2
  bindTimeChangeStart: function (e) {

    this.setData({
      times_start: e.detail.value
    })
  },
  //  点击日期组件确定事件  
  bindDateChangeStart: function (e) {

    this.setData({
      dates_start: e.detail.value
    })
  },



  //  点击时间组件确定事件  3
  bindTimeChangeEnd: function (e) {

    this.setData({
      times_end: e.detail.value
    })
  },
  //  点击日期组件确定事件  
  bindDateChangeEnd: function (e) {

    this.setData({
      dates_end: e.detail.value
    })
  },
  chose_type: function () {
    var that = this;
    var parent_types = [
      { id: 0, pc_type: '人找车', type: 0 },
      { id: 1, pc_type: '车找人', type: 0 },
      { id: 2, pc_type: '车找货', type: 0 },
      { id: 3, pc_type: '货找车', type: 0 },
    ];

    that.setData({
      mtype_list: parent_types
    });
    that.util_model('open', 'menu');
  },
  /**
   * sheet打开菜单
   */
  tap_add_sheet: function (e) {
    var that = this;
    var pc_type = e.currentTarget.dataset.pc_type;
    that.setData({
      pc_type: pc_type
    });
    that.util_model('close', 'menu');


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
  ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      address_start: options.address_start,
      address_end: options.address_end,
     
      msg_address: options.msg_address,
      msg_lat: options.msg_lat,
      msg_lon: options.msg_lon,

      msg_nation: options.msg_nation,
      msg_province: options.msg_province,
      msg_city: options.msg_city,
      msg_district: options.msg_district,
      msg_street: options.msg_street,
      msg_street_number: options.msg_street_number,

      address_start: options.address_start,
      address_start_lon: options.address_start_lon,
      address_start_lat: options.address_start_lat,

      address_start_nation: options.address_start_nation,
      address_start_province: options.address_start_province,
      address_start_city: options.address_start_city,
      address_start_district: options.address_start_district,
      address_start_street: options.address_start_street,
      address_start_street_number: options.address_start_street_number,

      address_end: options.address_end,
      address_end_lon: options.address_end_lon,
      address_end_lat: options.address_end_lat,

      address_end_nation: options.address_end_nation,
      address_end_province: options.address_end_province,
      address_end_city: options.address_end_city,
      address_end_district: options.address_end_district,
      address_end_street: options.address_end_street,
      address_end_street_number: options.address_end_street_number
    });

    app.util.request({
      'url': 'entry/wxapp/api_data',
      data: { 
        op: 'pinche_send_init',
        openid: wx.getStorageSync('openId')        
       },
      success(res) {
       // console.log('==================');
        var rpjson = res.data.data;
        //console.log(rpjson);
        that.setData({
          date_start: rpjson.now_data,
          date_start2: rpjson.now_data2,
          u_phone:rpjson.u_phone
        });
        if (rpjson.qq_map_key != '') {
          qqmapsdk = new QQMapWX({ key: rpjson.qq_map_key });
        } else {
          if (app.globalData.qqmap_key == '') {
            qqmapsdk = new QQMapWX({ key: 'CMTBZ-H2R34-HNYUG-DCOZN-5UXZE-SLFXW' });
          } else {
            qqmapsdk = new QQMapWX({ key: app.globalData.qqmap_key });
          }

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
   * 打开地图选择位置
   */
  open_map_chonse: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          address_start_lon: res.longitude,
          address_start_lat: res.latitude,
          address_start: res.address
        });
        that.getLocinfo_revLf(res.latitude, res.longitude, "start");
      },
      fail: function (res) {
      }
    });
  },
  /**
   * 打开地图选择位置
   */
  open_map_chonse2: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          address_end_lon: res.longitude,
          address_end_lat: res.latitude,
          address_end: res.address
        });
        that.getLocinfo_revLf(res.latitude, res.longitude, "end");
        
      },
      fail: function (res) {
      }
    });


  },/**
   * 直接内解析
   */
  getLocinfo_revLf: function (latitude, longitude, gtype) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      coord_type: 5,
      success: function (res) {
       // console.log('地址逆解析:')
       // console.log(res);
       // console.log(res.result.address_component);
        if (gtype == 'msg') {
          that.setData({

            msg_nation: res.result.address_component.nation,
            msg_province: res.result.address_component.province,
            msg_city: res.result.address_component.city,
            msg_district: res.result.address_component.district,
            msg_street: res.result.address_component.street,
            msg_street_number: res.result.address_component.street_number,

            address_start_nation: res.result.address_component.nation,
            address_start_province: res.result.address_component.province,
            address_start_city: res.result.address_component.city,
            address_start_district: res.result.address_component.district,
            address_start_street: res.result.address_component.street,
            address_start_street_number: res.result.address_component.street_number
          });
          that.setData({
            address_start_lat: latitude,
            address_start_lon: longitude,
            address_start: res.result.address,
            msg_address: res.result.address
          });
        } else if (gtype == 'start') {
          that.setData({
            address_start_nation: res.result.address_component.nation,
            address_start_province: res.result.address_component.province,
            address_start_city: res.result.address_component.city,
            address_start_district: res.result.address_component.district,
            address_start_street: res.result.address_component.street,
            address_start_street_number: res.result.address_component.street_number
          });
        } else if (gtype == 'end') {
          that.setData({
            address_end_nation: res.result.address_component.nation,
            address_end_province: res.result.address_component.province,
            address_end_city: res.result.address_component.city,
            address_end_district: res.result.address_component.district,
            address_end_street: res.result.address_component.street,
            address_end_street_number: res.result.address_component.street_number
          });
        }

        // address_start_lon: mapsucres.longitude,
        //   address_start_lat: mapsucres.latitude
        
      },
      fail: function (res) {
        //console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  }
})