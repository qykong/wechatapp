var app = getApp();
var page_0 = 1;
var page_1 = 1;
var page_2 = 1;
var page_3 = 1;
var QQMapWX = require('../../../../we7/resource/plugin/qqmap/qqmap-wx-jssdk.min.js');
var userinfoUtil = require('../../../resource/js/userinfoUtil.js');
var qqmapsdk;
Page({
  data: {

    bannser_show: false,
    indicatorDots: true,//是否显示点点
    autoplay: true,//自动播放
    active_color: "#fff",//点选中的颜色
    indicator: "#B4B4B4",//点的颜色
    interval: 5000,
    duration: 1000,
    df_dsf: [
      { "name": "人找车", "img": "", "url": "#" },
      { "name": "车找人", "img": "ab", "url": "#" },
      { "name": "车找货", "img": "ac", "url": "#" },
      { "name": "货找车", "img": "ad", "url": "#" }
    ],
    currentTabmenu: 1,
    currentTab: 0, //首页tab 序列
    m_list_0: [],
    m_list_1: [],
    m_list_2: [],
    m_list_3: [],
    idx: 0,//更新内容ID
    nation_code: '',
    nation: '',
    province: '',
    city_code: '',
    city: '',
    district: '',
    loc_type: '-1',//限制类型 －1不限制
    loc_text: '',//限制字段检查    
    msg_address: "定位",
    msg_lon: 0,
    msg_lat: 0,
    address_start: "位置",
    address_start_lon:0,
    address_start_lat:0,
    address_end: "你要去哪儿",
    address_end_lon:0,
    address_end_lat:0
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.share_name + '-首页',
      path: '/' + app.globalData.wx_model_name +'/pages/index/index',
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  df_d_sdgx: function (e) {
    let tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    });
  },//加载幻灯片
  load_banners: function () {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/get_banners',
      data: {},
      success(res) {
        if (res.data.data.length > 0) {
          that.setData({ bannser_show: true });
        }
        that.setData({ banners: res.data.data });
      }
    });
  }
  ,
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
   * 切换栏目
   */
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,
        m_list_0: [],
        m_list_1: [],
        m_list_2: [],
        m_list_3: []
      });
    }

    if (that.data.currentTab == 0) {
      page_0=1;
      that.load_list('人找车', page_0);
    } else if (that.data.currentTab == 1) {
      page_1 = 1;
      that.load_list('车找人', page_1);
    } else if (that.data.currentTab == 2) {
      page_2 = 1;
      that.load_list('车找货', page_2);
    } else if (that.data.currentTab == 3) {
      page_3 = 1;
      that.load_list('货找车', page_3);
    }

  },/**
   * 取同城信息内容
   */
  load_list: function (m_type, _page) {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/pinche_msg_action',
      data: {
        op:'list',
        page: _page,
        pagesize: 10,
        m_type: m_type
      },
      success(res) {
        //console.log(res.data);
        var rpjson = res.data.data;
        if(rpjson){

        var len = res.data.data.length;

        if (that.data.currentTab == 0) {
          var list_t = that.data.m_list_0;
          for (var i = 0; i < len; i++) {
            list_t.push(res.data.data[i]);
          }
          if (len == 0 || len < 10) {
            that.setData({ m_list_0_last: 1 });
          }
          that.setData({ m_list_0: list_t });
          that.setData({ ismore: len > 0 });

        } else if (that.data.currentTab == 1) {
          var list_t = that.data.m_list_1;
          for (var i = 0; i < len; i++) {
            list_t.push(res.data.data[i]);
          }
          if (len == 0 || len < 10) {
            that.setData({ m_list_1_last: 1 });
          }
          that.setData({ m_list_1: list_t });
          that.setData({ ismore: len > 0 });
          console.log(that.data.m_list_1);
        } else if (that.data.currentTab == 2) {
          var list_t = that.data.m_list_2;
          for (var i = 0; i < len; i++) {
            list_t.push(res.data.data[i]);
          }
          if (len == 0 || len < 10) {
            that.setData({ m_list_2_last: 1 });
          }
          that.setData({ m_list_2: list_t });
          that.setData({ ismore: len > 0 });
        } else if (that.data.currentTab == 3) {
          var list_t = that.data.m_list_3;
          for (var i = 0; i < len; i++) {
            list_t.push(res.data.data[i]);
          }
          if (len == 0 || len<10) {
            that.setData({ m_list_3_last: 1 });
          }
          that.setData({ m_list_3: list_t });
          that.setData({ ismore: len > 0 });
        }
        }
      }
    });

  },
  /**
  * 加载初始化
  */
  load_list_init: function () {
    var that = this;
    if (that.data.currentTab == 0) {
      page_0 = 1;
      that.setData({ m_list_0: [] });
      that.setData({ m_list_0_last: null });
      that.load_list('人找车', page_0);
    } else if (that.data.currentTab == 1) {
      page_1 = 1;
      that.setData({ m_list_1: [] });
      that.setData({ m_list_1_last: null });
      that.load_list('车找人', page_1);
    } else if (that.data.currentTab == 2) {
      page_2 = 1;
      that.setData({ m_list_2: [] });
      that.setData({ m_list_2_last: null });
      that.load_list('车找货', page_2);
    } else if (that.data.currentTab == 3) {
      page_2 = 1;
      that.setData({ m_list_3: [] });
      that.setData({ m_list_3_last: null });
      that.load_list('货找车', page_3);
    }
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
        that.getLocinfo_revLf(res.latitude, res.longitude, "end");
        that.setData({
          address_end_lon: res.longitude,
          address_end_lat: res.latitude,
          address_end: res.address
        });
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
        // wx.setStorageSync('latitude', mapsucres.latitude);
        // wx.setStorageSync('longitude', mapsucres.longitude);
       // console.log('ffffffffffffffffffffffffffff');
       
        that.setData({
          msg_lon: mapsucres.longitude,
          msg_lat: mapsucres.latitude
        
        });
        that.getLocinfo_revLf(mapsucres.latitude, mapsucres.longitude,"msg");
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

  },/**
   * 直接内解析
   */
  getLocinfo_revLf: function (latitude, longitude,gtype) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      coord_type: 5,
      success: function (res) {
        //console.log('地址逆解析:')
       // console.log(res);
        //console.log(res.result.address_component);
        if (gtype=='msg'){
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
          msg_lon: res.longitude,
          msg_lat: res.latitude
        });
       // wx.setStorageSync('latitude', res.latitude);
       // wx.setStorageSync('longitude', res.longitude);

        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          coord_type: 5,
          success: function (res) {
            console.log('地址逆解析:')
            //console.log(res);
            //console.log(res.result.ad_info);

            that.setData({
              msg_nation: res.result.address_component.nation,
              msg_province: res.result.address_component.province,
              msg_city: res.result.address_component.city,
              msg_district: res.result.address_component.district,
              msg_street: res.result.address_component.street,
              msg_street_number: res.result.address_component.street_number,


              address_start_nation: res.result.ad_info.nation,
              address_start_province: res.result.ad_info.province,
              address_start_city: res.result.ad_info.city,
              address_start_district: res.result.ad_info.district,
              address_start_street: res.result.ad_info.street,
              address_start_street_number: res.result.ad_info.street_number
            });

            that.setData({
              address_start: res.result.address,
              msg_address: res.result.address
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


  },
  open_submit_carpool: function () {
    var that = this;
    wx.navigateTo({
      url: '../send/page?address_start=' + that.data.address_start + "&address_end=" + that.data.address_end + "&msg_address=" + that.data.msg_address + '&msg_lat=' + that.data.msg_lat + '&msg_lon=' + that.data.msg_lon + '&msg_nation=' + that.data.msg_nation + '&msg_province=' + that.data.msg_province + '&msg_city=' + that.data.msg_city + '&msg_district=' + that.data.msg_district + '&msg_street=' + that.data.msg_street + '&msg_street_number=' + that.data.msg_street_number + '&address_start_lat=' + that.data.address_start_lat + '&address_start_lon=' + that.data.address_start_lon + '&address_start_nation=' + that.data.address_start_nation + '&address_start_province=' + that.data.address_start_province + '&address_start_city=' + that.data.address_start_city + '&address_start_district=' + that.data.address_start_district + '&address_start_street=' + that.data.address_start_street + '&address_start_street_number=' + that.data.address_start_street_number + '&address_end_lat=' + that.data.address_end_lat + '&address_end_lon=' + that.data.address_end_lon + '&address_end_nation=' + that.data.address_end_nation + '&address_end_province=' + that.data.address_end_province + '&address_end_city=' + that.data.address_end_city + '&address_end_district=' + that.data.address_end_district + '&address_end_street=' + that.data.address_end_street + '&address_end_street_number=' + that.data.address_end_street_number
    });

  }
  ,
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    //加载幻灯片  
    // setTimeout(function () {
    //   that.load_banners();
    // }, 300);

    //获取用户信息
    setTimeout(function () {
      userinfoUtil.getUserinfo();
    }, 100);
    //console.log(wx.getStorageSync('ubinfo'))

    setTimeout(function () {
      // that.load_list(0, page_0);
      that.load_list_init();
    }, 50);


    var that = this;
    app.util.request({
      'url': 'entry/wxapp/api_data',
      data:{op:'qq_map_key'},
      success(res) {
        console.log('==================');
        var rpjson = res.data.data;
        if (rpjson.qq_map_key!=''){
          
          qqmapsdk = new QQMapWX({ key: rpjson.qq_map_key });
        }else{
          if (app.globalData.qqmap_key == '') {
            qqmapsdk = new QQMapWX({ key: 'CMTBZ-H2R34-HNYUG-DCOZN-5UXZE-SLFXW' });
          } else {
            qqmapsdk = new QQMapWX({ key: app.globalData.qqmap_key });
          }

        }
      
        
      }
    });


   

    that.gpsloc();


  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  wxSearchFn: function () {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/test',
      success(res) {
        console.log(res.data);
      }
    });

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.load_list_init();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this;
    if (that.data.currentTab == 0) {
      page_0++;
      that.load_list('人找车', page_0);
    } else if (that.data.currentTab == 1) {
      page_1++;
      that.load_list('车找人', page_1);
    } else if (that.data.currentTab == 2) {
      page_2++;
      that.load_list('车找货', page_2);
    } else if (that.data.currentTab == 3) {
      page_3++;
      that.load_list('货找车', page_3);
    }

  },
  msg_list: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../info/page?mid=' + id +'&share=0'
    });


  }


})