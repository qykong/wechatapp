var app=getApp();
var WxNotificationCenter = require("../../../../we7/resource/plugin/WxNotificationCenter/WxNotificationCenter.js");
var uploadUrl = "";
var qqmapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    store_lsit:[],
    store_id:[],
    store_idx:'',
    imglist: [],
    cnt_good:6,//商品图片
    stroe_select:false,

    g_type_list: ['商品', '优惠券', '折扣券', '代金券'],
    g_type_idx: '',
    g_type_select:false,
       
    oncode:'',
    enable:'0',//状态
    paystatus:'0',//支付状态
    pay_money_ruzhu: '0',//入驻费用
    form_action:'add',   
    last_time:"",

    isopen_newkefu: false,
    isopen_last_time:false,

    tc_info_placeholder:'请输入商品详情',

    indicatorDots: true,//是否显示点点
    autoplay: true,//自动播放
    active_color: "#fff",//点选中的颜色
    indicator: "#B4B4B4",//点的颜色
    interval: 5000,
    duration: 1000,

    ssd_Sd_a: "",
    ssd_Sd_b: "",
    ssd_Sd_a_chonnse: "1",
    ssd_Sd_b_chonnse: "1"
  },
  switch_isopen_last_time:function(e){
    console.log(e)
    this.setData({ isopen_last_time:e.detail.value})
  },
  bind_store_PickerChange: function (e) {
    this.setData({
      stroe_select:true,
      store_idx: e.detail.value
    })
  },
  bind_g_type_PickerChange:function(e){
    var that=this;
    that.setData({
      g_type_select: true,
      g_type_idx: e.detail.value
    });
    var idx = e.detail.value;
    if(idx==0){
      that.setData({
        tc_info_placeholder: '请输入商品详情,如: 商品规格,产地，等商品信息'
      });
    } else if (idx == 1) {
      that.setData({
        tc_info_placeholder: '请输入优惠券信息,如：满多少使用'
      });
    } else if (idx == 2) {
      that.setData({
        tc_info_placeholder: '请输入折扣券信息,如：满多少多少折扣,最低多少打折 '
      });
    } else if (idx == 3) {
      that.setData({
        tc_info_placeholder: '请输入代金券信息,如：满多少多少使用'
      });
    }
  },
  bind_last_time:function(e){
    this.setData({
      last_time: e.detail.value
    })
  },
  /**
   * 是否新客立减
   */
  switch_isopen_newkefu: function (e) {
    var that = this;  
    if (!that.data.top_open) {
      that.setData({
        isopen_newkefu: !this.data.isopen_newkefu
      });
    } else {
      that.setData({
        isopen_newkefu: false
      });    
    }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.setAppColor();
    app.util.request({
      'url': 'entry/wxapp/store_info_action',
      data: {
        op: 'list_store',
        openid: wx.getStorageSync('openId')
      },
      success(res) {
        var json = res.data.data;
       // console.log(json)
        that.setData({
          store_lsit: json.main_arr,
          store_id: json.main_arr_id,
          cnt_good: parseInt(json.goods_imgs_cnt)       
        });
        
       
        //console.log(that.data.cnt_good)

        that.setData({
          pay_btn_title: '添加新商品'
        });
        //options.oncode = '1506437859CR-UWnfzDnE';
        if (typeof (options.oncode) != 'undefined' && options.oncode != '') {
          that.setData({ form_action: 'edit', oncode: options.oncode });
          wx.setNavigationBarTitle({
            title: '商品 编辑',
          })
          app.util.request({
            'url': 'entry/wxapp/store_goods_info_action',
            data: {
              op: 'get_one',
              oncode: options.oncode
            },
            success(res) {
              var json = res.data.data;
              console.log(json)

              for (var i = 0, len = that.data.store_lsit.length; i < len; i++) {
                if (that.data.store_lsit[i] == json.s_name){
                  that.setData({
                    store_idx:i,
                    stroe_select:true
                  });
                }
              }

              for (var i = 0, len = that.data.g_type_list.length; i < len; i++) {
                if (that.data.g_type_list[i] == json.g_type) {
                  that.setData({
                    g_type_idx: i,
                    g_type_select: true
                  });
                }
              }
             
              var imglist_temp=new Array();
              for (var i = 0, len =json.imgs_list_arr.length; i < len; i++) {
                if (json.imgs_list_arr[i] !='') {
                  imglist_temp.push({
                    img: json.imgs_list_arr[i],
                    imgtype: 'img_list',
                    status: 'server',
                  });
                }
              }




              that.setData({
                imglist: imglist_temp,
                upimgbtt: imglist_temp.length >= that.data.cnt_good,
                isopen_last_time: json.isopen_last_time == 'true'?true: false,
                last_time: json.last_time
              });
             

              if (json.enable == '0') {
                that.setData({
                  pay_btn_title: '审核中,可编辑'
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

             that.setData({
                it: json,               
               
              });

            }

          });
        }
      }

    });
    //formobj.store_m_typeid_idx = that.data.multiIndex[0];
    //formobj.store_p_typeid_idx = that.data.multiIndex[1];

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
   * 表单提交
   */
  formSubmit:function(e){
    var that=this;
    var formId = e.detail.formId;
    var formobj = e.detail.value;
    formobj.formId = formId;
    formobj.openid = wx.getStorageSync('openId');

    formobj.s_id = that.data.store_id[that.data.store_idx];
    formobj.s_name = that.data.store_lsit[that.data.store_idx];

    formobj.g_type = that.data.g_type_list[that.data.g_type_idx];
    formobj.g_type_idx = that.data.g_type_idx;

    formobj.isopen_newkefu = that.data.isopen_newkefu;
    formobj.isopen_last_time = that.data.isopen_last_time;
    formobj.last_time = that.data.last_time;

    console.log(formobj)
    if (!that.data.stroe_select){
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '请选择店铺归属!',
      });
    } else if (!that.data.g_type_select) {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '请选择商品类型!',
      });
    } else if (formobj.g_name==''){
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '请输入商品标题!',
      });
    } else if (formobj.tc_info == '') {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '请输入商品详情!',
      });
    } else if (formobj.money_sale == '') {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '请输入实际售价!',
      });
    } else if (formobj.g_cnt_all == '') {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '请输入商品库存',
      });
    } else if (formobj.isopen_last_time && formobj.last_time == '') {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '请选择截止日期!',
      });
    } else if (that.data.imglist.length ==0) {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '请选择上传商品图片!',
      });
    }else{
      
      //提交表单
      uploadUrl = that.zdy_url('entry/wxapp/store_goods_info_imgs');     
      formobj.op = that.data.form_action;
      app.util.request({
        'url': 'entry/wxapp/store_goods_info_action',
        data: formobj,
        success(res) {
          var rpjosn = res.data.data;
          that.setData({
            oncode:rpjosn.oncode
          });
          //rpjosn.oncode //店铺识别码
         
          var imglist = that.data.imglist;
          var imglist_sfz = new Array();
          for (var i = 0, len = imglist.length; i < len; i++) {
            if (imglist[i]['status'] == 'new') {
              imglist[i].oncode = rpjosn.oncode;
              imglist_sfz.push(imglist[i]);
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
            that.goto_store_main();
            // if (that.data.paystatus=='0'){
            //   var pay_param = {};
            //   pay_param.oncode = that.data.oncode;
            //   pay_param.ptype = 'store_ruzhu';
            //   pay_param.pay_money = that.data.pay_money_ruzhu;
            //   pay_param.ck_type = 'account_only';//只检查帐户
            //   that.pay_money(pay_param);
            // }else{
            //   that.goto_store_main();
            // }
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
          
          that.goto_store_main();
          
          // if (that.data.paystatus == '0') {
          //   var pay_param = {};
          //   pay_param.oncode = that.data.oncode;
          //   pay_param.ptype = 'store_ruzhu';
          //   pay_param.pay_money = that.data.pay_money_ruzhu;
          //   pay_param.ck_type = 'account_only';//只检查帐户
          //   that.pay_money(pay_param);
          // } else {
          //   that.goto_store_main();
          // }          
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
            image: '../../../resource/images/static/error.png',
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
      content: '商品信息已提交完成!',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          WxNotificationCenter.postNotificationName("goods_info_edit");
          wx.navigateBack({
            delta: 1
          });        

          

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
      count: that.data.cnt_good - imglistlength, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 'original', 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {        
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0, len = tempFilePaths.length; i < len; i++) {
          imglist.push({
            img: tempFilePaths[i],
            imgtype:'img_list',
            status:'new',
          });
        }
        that.setData({
          imglist: imglist,
          upimgbtt: imglist.length >= that.data.cnt_good
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
  pic_remove: function (e){
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
          if (that.data.form_action=='edit'){
            //编辑状态是 直接删除
            app.util.request({
              'url': 'entry/wxapp/store_goods_info_action',
              data: {
                oncode: that.data.oncode,
                del_img: tg.img,
                op:'del_img_list'
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
            upimgbtt: imglist.length >= that.data.cnt_good
          });





        }
      }
    })

  }
})