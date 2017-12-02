var app=getApp();
var userinfoUtil = require('../../../resource/js/userinfoUtil.js');
var QQMapWX = require('../../../../we7/resource/plugin/qqmap/qqmap-wx-jssdk.min.js');
var WxNotificationCenter = require("../../../../we7/resource/plugin/WxNotificationCenter/WxNotificationCenter.js");
var uploadUrl = "";
var qqmapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imglist:[],
    cnt_store: 6,//店铺图片
    nav_type:'list_my',//进入页面入口
    oncode:'',
    enable:'0',//状态
    paystatus:'0',//支付状态
    pay_money_ruzhu: '0',//入驻费用
    form_action:'add',
    loc_address:'地址定位中...',
    multiSelet:false,
    multiIndex: [0,0],
    //multiIndex_time: [0, 0],
    //multiArray_time: [['00:00', '休闲娱乐'], ['早点早餐', '饭店餐厅']],   
    multiArray: [['餐饮美食', '休闲娱乐'], ['早点早餐','饭店餐厅']],

    store_m_type_arr: [],
    store_m_type_idx: 0,
    store_m_type_select:true,
    store_p_type_arr: [],
    store_p_type_idx: 0,
    store_p_type_select: true,

    isopen_yyzz:false,
    store_p_type_isopen_yyzz: [],
    store_p_type_isopen_yyzz_all: [],

    shen: ['北京', '深圳', '上海', '广州'],
    sn: 0,
    squyu: ['地区', '地区1', '地区2', '地区3'],
    qu: 0,
    imgUrls: [ //轮播图
      '/img/ruz_banner.png',
      '/img/ruz_banner.png',
      '/img/ruz_banner.png'
    ],
    indicatorDots: true,//是否显示点点
    autoplay: true,//自动播放
    active_color: "#fff",//点选中的颜色
    indicator: "#B4B4B4",//点的颜色
    interval: 5000,
    duration: 1000,
    ssd_Sd_a: "",
    ssd_Sd_b: "",
    ssd_Sd_a_chonnse: "1",
    ssd_Sd_b_chonnse: "1",
    store_m_type:'',
    store_m_typeid: '',
    store_p_type: '',
    store_p_typeid: '',
    time_start:"",
    time_end: ""
  },
  bindTimeChange_start: function (e) {
    console.log('time_startpicker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time_start: e.detail.value
    })
  },
  bindTimeChange_end: function (e) {
    console.log('time_endpicker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time_end: e.detail.value
    })
  },
  bindMultiPickerChange_time: function (e) {
    console.log('timepicker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiSelet: true,
      multiIndex_time: e.detail.value
    })
  },
  bindMultiPickerChange: function (e) {
    var that=this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      multiSelet:true,
      multiIndex: e.detail.value
    }); 
    // console.log("主名:" + that.data.main_arr[that.data.multiIndex[0]])
    // console.log("主ID:" + that.data.main_arr_id[that.data.multiIndex[0]])   
    // console.log("子名:" + that.data.main_parr_all[that.data.multiIndex[0]][that.data.multiIndex[1]])
    // console.log("子ID:" + that.data.main_parr_all_id[that.data.multiIndex[0]][that.data.multiIndex[1]])
  },
  bindMultiPickerColumnChange: function (e) {
    var that=this;
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        data.multiArray[1] = that.data.main_parr_all[e.detail.value];
        // switch (data.multiIndex[0]) {
        //   case 0:
        //     data.multiArray[1] = ['早点早餐', '饭店餐厅'];
        //     break;
        //   case 1:
        //     data.multiArray[1] = ['A', 'B', 'C'];
        //     break;
        // }
        data.multiIndex[1] = 0;
        break;
      
    }
    this.setData(data);
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
  sdf_dfs: function (e) {
    var okjx = e.currentTarget.dataset.idx,
      sd_s = this
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        if (okjx == 1) {
          sd_s.setData({ ssd_Sd_a: tempFilePaths[0], ssd_Sd_a_chonnse:'0' })
        } else if (okjx == 2) {
          sd_s.setData({ ssd_Sd_b: tempFilePaths[0], ssd_Sd_b_chonnse: '0'  })
        }
      }
    })
  },
  bindPickerChange_store_m_type: function (e) {
    var that=this;   
    that.setData({
      store_m_type_idx: e.detail.value,
      store_p_type_idx: 0,
      store_p_type_arr: that.data.main_parr_all[e.detail.value],
      store_p_type_isopen_yyzz: that.data.store_p_type_isopen_yyzz_all[e.detail.value],
    });
    //console.log(that.data.store_p_type_isopen_yyzz)
    var val_isopen_yyzz = that.data.store_p_type_isopen_yyzz[that.data.store_p_type_idx];
    console.log('主 是需营业执照' + val_isopen_yyzz);
    if (val_isopen_yyzz=='1'){
      that.setData({ isopen_yyzz: true});
    }else{
      that.setData({ isopen_yyzz: false });
    }

  },
   bindPickerChange_store_p_type: function (e) {
     var that=this;
     that.setData({
      store_p_type_idx: e.detail.value
    });
     var val_isopen_yyzz = that.data.store_p_type_isopen_yyzz[that.data.store_p_type_idx];
     console.log('子 是需营业执照' + val_isopen_yyzz);
     if (val_isopen_yyzz == '1') {
       that.setData({ isopen_yyzz: true });
     } else {
       that.setData({ isopen_yyzz: false });
     }
   
  },
  bindshen: function (e) {
    this.setData({
      sn: e.detail.value
    })
  },
  bindsquyu: function (e) {
    this.setData({
      qu: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.setAppColor();   

    if (typeof (options.nav_type) != 'undefined' && options.nav_type != '') {
      that.setData({
        nav_type: options.nav_type
      });
    }   
    app.util.request({
      'url': 'entry/wxapp/store_mtype_action',
      data: {
        op: 'list',
        u_openid: wx.getStorageSync('openId')
      },
      success(res) {
        var json = res.data.data;
        console.log(json.token)
        that.setData({
          //multiArray: [json.main_arr, json.main_parr_all[0]],
          main_arr: json.main_arr,
          main_arr_id: json.main_arr_id,
          main_parr_all: json.main_parr_all,
          main_parr_all_id: json.main_parr_all_id,
          pay_money_ruzhu: json.pay_money_ruzhu,
          last_time_str: json.last_time_str,

          store_m_type_arr: json.main_arr,
          store_p_type_arr: json.main_parr_all[0],
          store_p_type_isopen_yyzz: json.main_parr_all_isopen_yyzz[0],
          store_p_type_isopen_yyzz_all: json.main_parr_all_isopen_yyzz,
          cnt_store: parseInt(json.store_imgs_cnt)
        });

        var val_isopen_yyzz = that.data.store_p_type_isopen_yyzz[that.data.store_p_type_idx];
        if (val_isopen_yyzz == '1') {
          that.setData({ isopen_yyzz: true });
        } else {
          that.setData({ isopen_yyzz: false });
        }
        
        that.setData({
          pay_btn_title: '支付￥:'+json.pay_money_ruzhu+'元,确认新入驻'
        });

        //options.oncode = '1506437859CR-UWnfzDnE';
        if (typeof (options.oncode) != 'undefined' && options.oncode != '') {
          that.setData({ form_action: 'edit', oncode: options.oncode });
          wx.setNavigationBarTitle({
            title: '商家/店铺 编辑',
          })
          app.util.request({
            'url': 'entry/wxapp/store_info_action',
            data: {
              op: 'get_one',
              oncode: options.oncode
            },
            success(res) {
              var json = res.data.data;
              console.log(json)
              if (json.enable == '0' && json.paystatus=='0'){
                that.setData({
                  pay_btn_title: '请支付￥:' + that.data.pay_money_ruzhu+'元,后才可通过审核'
                });
              } else if (json.enable == '0' && json.paystatus == '1') {
                that.setData({
                  pay_btn_title: '审核中'
                });
              } else if (json.enable == '1') {
                that.setData({
                  pay_btn_title: '审核通过,可编辑信息'
                });
              } else if (json.enable == '2') {
                that.setData({
                  sh_str:json.sh_str,
                  pay_btn_title: '审核驳回,请根据审核回馈编辑信息,重新提交'
                });
              } 

              for (var i = 0, len = that.data.main_arr.length; i < len; i++) {
                if (that.data.main_arr[i] == json.store_m_type) {
                  that.setData({
                    store_m_type_idx: i,
                    store_m_type_select: true,
                    store_p_type_arr: that.data.main_parr_all[i],
                    store_p_type_isopen_yyzz: that.data.store_p_type_isopen_yyzz_all[i]
                  });
                 
                }
              }
            
             // console.log(that.data.store_p_type_isopen_yyzz)
             
               // store_p_type_isopen_yyzz_all: json.main_parr_all_isopen_yyzz,

              for (var i = 0, len = that.data.store_p_type_arr.length; i < len; i++) {
                if (that.data.store_p_type_arr[i] == json.store_p_type) {
                  that.setData({
                    store_p_type_idx: i,
                    store_p_type_select: true
                  });
                  var val_isopen_yyzz = that.data.store_p_type_isopen_yyzz[i];
                  if (val_isopen_yyzz == '1') {
                    that.setData({ isopen_yyzz: true });
                  } else {
                    that.setData({ isopen_yyzz: false });
                  }

                }
              }

              var imglist_temp = that.data.imglist;
              for (var i = 0, len = json.imgs_list_arr.length; i < len; i++) {
                if (json.imgs_list_arr[i] != '') {
                  imglist_temp.push({
                    img: json.imgs_list_arr[i],
                    imgtype: 'img_list',
                    status: 'server',
                  });
                }
              }
              that.setData({ imglist: imglist_temp});



              var data_A = {
                upimgbtt: imglist_temp.length >= that.data.cnt_store,
                time_start: json.time_start,
                time_end: json.time_end,
                multiSelet: true,
                enable: json.enable,
                paystatus: json.paystatus,                
                //multiArray: that.data.multiArray,
                //multiIndex: [parseInt(json.store_m_typeid_idx), parseInt(json.store_p_typeid_idx)]
              };             
            //data_A.multiArray[1] = that.data.main_parr_all[parseInt(json.store_m_typeid_idx)];

             that.setData(data_A);
             that.setData({
                it: json,               
                ssd_Sd_a: json.img_store_mentou,
                ssd_Sd_b: json.img_store_yingyezz
              });

            }

          });
        }
      }

    });
    //formobj.store_m_typeid_idx = that.data.multiIndex[0];
    //formobj.store_p_typeid_idx = that.data.multiIndex[1];


    //获取用户信息
    setTimeout(function () {
      userinfoUtil.getUserinfo();
    }, 100);
    //multiArray
    
   

    app.util.request({
      'url':'entry/wxapp/get_user_info',
      data: { u_openid: wx.getStorageSync('openId') },
      success(res) {
        var json = res.data.data;
        //console.log(json)
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
   * 获取位置
   */
  gpsloc: function () {
    var that = this;

    wx.getLocation({
      type: 'gcj02',
      success: function (mapsucres) {
        wx.setStorageSync('loc_lat', mapsucres.latitude);
        wx.setStorageSync('loc_lon', mapsucres.longitude);
        that.setData({
          loc_lon: mapsucres.longitude,
          loc_lat: mapsucres.latitude
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
        //console.log('地址逆解析:')
        //console.log(res);
       // console.log(res.result.ad_info);
        that.setData({
          loc_nation_code: res.result.ad_info.nation_code,
          loc_nation: res.result.ad_info.nation,
          loc_province: res.result.ad_info.province,
          loc_city_code: res.result.ad_info.city_code,
          loc_city: res.result.ad_info.city,
          loc_district: res.result.ad_info.district
        });

        that.setData({
          loc_address: res.result.address
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
   * 打开地图选择位置
   */
  open_map_chonse: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          loc_lon: res.longitude,
          loc_lat: res.latitude,
          loc_address: res.address
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
   * 表单提交
   */
  formSubmit:function(e){
    var that=this;
    var formId = e.detail.formId;
    var formobj = e.detail.value;
    formobj.formId = formId;
    formobj.openid = wx.getStorageSync('openId');
    formobj.u_nickname = app.globalData.userInfo.nickName;
    formobj.u_city = app.globalData.userInfo.city;
    formobj.u_unionid = '';
    formobj.u_avatarurl = app.globalData.userInfo.avatarUrl;
   
    formobj.time_start = that.data.time_start;
    formobj.time_end = that.data.time_end;

    // formobj.store_m_typeid_idx = that.data.multiIndex[0];
    // formobj.store_p_typeid_idx = that.data.multiIndex[1];
    // formobj.store_m_type = that.data.main_arr[that.data.multiIndex[0]];
    // formobj.store_m_typeid = that.data.main_arr_id[that.data.multiIndex[0]];
    // formobj.store_p_type = that.data.main_parr_all[that.data.multiIndex[0]][that.data.multiIndex[1]];
    // formobj.store_p_typeid = that.data.main_parr_all_id[that.data.multiIndex[0]][that.data.multiIndex[1]];

    formobj.store_m_typeid_idx = that.data.store_m_type_idx;
    formobj.store_p_typeid_idx = that.data.store_p_type_idx;
    formobj.store_m_type = that.data.store_m_type_arr[formobj.store_m_typeid_idx];
    formobj.store_m_typeid = that.data.main_arr_id[formobj.store_m_typeid_idx];
    formobj.store_p_type = that.data.main_parr_all[formobj.store_m_typeid_idx][formobj.store_p_typeid_idx];
    formobj.store_p_typeid = that.data.main_parr_all_id[formobj.store_m_typeid_idx][formobj.store_p_typeid_idx];

    formobj.ssd_Sd_a = that.data.ssd_Sd_a;
    formobj.ssd_Sd_b = that.data.ssd_Sd_b;
    console.log(formobj)
    
    if(formobj.s_name==''){
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '请输入店铺名称!',
      });
    } else if (formobj.store_m_type == '') {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '请选择店铺分类!',
      });
    } else if (formobj.s_phoneperson==''){
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '请输入联系人!',
      });
    } else if (formobj.s_phone == '') {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '请输入联系电话!',
      });
    } else if (formobj.loc_address == '地址定位中...' || formobj.loc_address == '') {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '地址位置还未定位,不可入驻!',
      });
    } else if (formobj.time_start == '') {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '选择开始营业时间',
      });
    } else if (formobj.time_end == '') {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '选择结束营业时间',
      });
    }  else if (formobj.s_address == '' || formobj.s_address =='地址定位中...') {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '请选择店铺地址!',
      });
    } else if (that.data.ssd_Sd_a == '') {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '请拍照或选择门店照片!',
      });
    } else if (that.data.isopen_yyzz && (that.data.ssd_Sd_b == '' || that.data.ssd_Sd_b ==null)) {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '请拍照或选择营业执照!',
      });
    }else{
      //提交表单
      uploadUrl = that.zdy_url('entry/wxapp/store_info_imgs');     
      formobj.op = that.data.form_action;
      app.util.request({
        'url': 'entry/wxapp/store_info_action',
        data: formobj,
        success(res) {
          var rpjosn = res.data.data;
          that.setData({
            oncode:rpjosn.oncode
          });
          //rpjosn.oncode //店铺识别码
          var imglist_sfz = new Array();
          if (that.data.ssd_Sd_a_chonnse == '0') {
            imglist_sfz.push({
              'img': that.data.ssd_Sd_a,
              'imgtype': 'meng',
              'oncode': rpjosn.oncode
            });
          }
          if (that.data.ssd_Sd_b_chonnse == '0') {
            imglist_sfz.push({
              'img': that.data.ssd_Sd_b,
              'imgtype': 'zhezao',
              'oncode': rpjosn.oncode
            });
          }

          for (var i = 0, len = that.data.imglist.length;i<len;i++){
            if (that.data.imglist[i].status =='new'){
              imglist_sfz.push({
                'img': that.data.imglist[i].img,
                'imgtype': 'img_list',
                'oncode': rpjosn.oncode
              });
            }
          }

          var successUp = 0; //成功个数
          var failUp = 0; //失败个数
          var length = imglist_sfz.length; //总共个数
          if (length > 0) {
            var i = 0; //第几个
            that.uploadDIY(imglist_sfz, successUp, failUp, i, length);
            wx.showLoading({
              title: '图片上传中...',
            });
          } else {
            if (that.data.paystatus=='0'){
              var pay_param = {};
              pay_param.oncode = that.data.oncode;
              pay_param.ptype = 'store_ruzhu';
              pay_param.pay_money = that.data.pay_money_ruzhu;
              pay_param.ck_type = 'account_only';//只检查帐户
              that.pay_money(pay_param);
            }else{
              that.goto_store_main();
            }
          }

        }
      });
    } 
  },
  uploadDIY(filePaths, successUp, failUp, i, length) {
    var that = this;
    //console.log(uploadUrl)
    wx.uploadFile({
      url: uploadUrl,
      filePath: filePaths[i].img,
      name: 'file',
      formData: { 'imgtype': filePaths[i].imgtype, 'oncode': filePaths[i].oncode },
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
          if (that.data.paystatus == '0') {
            var pay_param = {};
            pay_param.oncode = that.data.oncode;
            pay_param.ptype = 'store_ruzhu';
            pay_param.pay_money = that.data.pay_money_ruzhu;
            pay_param.ck_type = 'account_only';//只检查帐户
            that.pay_money(pay_param);
          } else {
            that.goto_store_main();
          }          
        }
        else {  //递归调用uploadDIY函数
          that.uploadDIY(filePaths, successUp, failUp, i, length);
        }
      },
    });
  },
  /**
   * 打赏支付
   */
  pay_money: function (formobj) {
    var that = this;   
    //console.log(formobj);
    //formobj.ptype
    //formobj.pay_money
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/check_user_account',
      data: {
        openId: app.globalData.openId,
        ck_type: formobj.ck_type,
        ck_money: formobj.pay_money
      },
      success(crpres) {
        var rpjson = crpres.data.data;      
        if (rpjson.have_user) {
          if (rpjson.ck_status) {
            wx.showModal({
              title: '提示',
              content: '帐户可支付，确认支付' + formobj.pay_money + '元？',
              cancelText: '取消',
              confirmText: '帐户支付',
              success: function (res) {
                if (res.confirm) {                  
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
                      
                      //更新支付
                      wx.showToast({
                        title: '微信支付成功!',
                      });

                      that.goto_store_main();    

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
               
                  //更新支付
                  wx.showToast({
                    title: '微信支付成功!',
                  });

                  that.goto_store_main();

                }
              });
            },
            'fail': function (res) {
              that.goto_store_main_ot();
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
        that.goto_store_main_ot();
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
   * 注册成功 返回店铺管理界面 检查支付状态
   */
  goto_store_main: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '店铺信息已提交,点击确定进入 我的－店铺管理!',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          //nav_type: options.nav_type
          WxNotificationCenter.postNotificationName("store_info_add");
          if (that.data.nav_type =='list_my'){
            console.log('1')
            wx.navigateBack({
              delta: 1
            });           
          }else{
            console.log('2')
            wx.redirectTo({
              url: '../store_list_my/page',
            });
            // wx.switchTab({
            //   url: '../../../page_user_main/page',
            // });
          }
        }
      }
    });

  },
  /**
   * 注册成功 返回店铺管理界面 检查支付状态
   */
  goto_store_main_ot: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '未支付,占击确定进入 我的－店铺管理!!',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          //nav_type: options.nav_type
          WxNotificationCenter.postNotificationName("store_info_add");
          if (that.data.nav_type == 'list_my') {
            console.log('1')
            wx.navigateBack({
              delta: 1
            });
          } else {
            console.log('2')
            wx.redirectTo({
              url: '../store_list_my/page',
            });
            // wx.switchTab({
            //   url: '../../../page_user_main/page',
            // });
          }
        }
      }
    });

  },
  /**
   * 选择图片
   */
  choosePic: function () {
    var that = this;
    var imglist = this.data.imglist;
    var imglistlength = imglist.length;
    //imgcnt
    wx.chooseImage({
      count: that.data.cnt_store - imglistlength, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 'original', 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0, len = tempFilePaths.length; i < len; i++) {
          imglist.push({
            img: tempFilePaths[i],
            imgtype: 'img_list',
            status: 'new',
          });
        }
        that.setData({
          imglist: imglist,
          upimgbtt: imglist.length >= that.data.cnt_store
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
    var tg = e.currentTarget.dataset;
    Array.prototype.indexOf = function (val) { for (var i = 0; i < this.length; i++) { if (this[i] == val) return i } return -1 };
    Array.prototype.remove = function (val) { var index = this.indexOf(val); if (index > -1) { this.splice(index, 1) } };

    Array.prototype.indexOf_byimg = function (val) { for (var i = 0; i < this.length; i++) { if (this[i].img == val.img) return i } return -1 };
    Array.prototype.remove_byimg = function (val) { var index = this.indexOf_byimg(val); if (index > -1) { this.splice(index, 1) } };
    var that = this;
    var imglist = this.data.imglist;
    wx.showModal({
      title: '提示',
      content: '是否删除图片?',
      success: function (res) {
        if (res.confirm) {
          if (that.data.form_action == 'edit') {
            //编辑状态是 直接删除
            app.util.request({
              'url': 'entry/wxapp/store_info_action',
              data: {
                oncode: that.data.oncode,
                del_img: tg.img,
                op: 'del_img_list'
              },
              success(res) {
                var rpjson = res.data.data;
                console.log(rpjson)

              }
            });

          }
          imglist.remove_byimg({
            img: tg.img,
            imgtype: tg.imgtype,
            status: tg.status
          });
          that.setData({
            imglist: imglist,
            upimgbtt: imglist.length >= that.data.cnt_store
          });

        }
      }
    })

  }


})