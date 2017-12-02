var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active_tcid:'',
    imgUrls: [ //轮播图
      '../../resource/images/dsf_a.png',
      '../../resource/images/dsf_adfa.jpg',
      '../../resource/images/dsf_a.png'
    ],
    indicatorDots: false,//是否显示点点
    autoplay: true,//自动播放
    active_color: "#fff",//点选中的颜色
    indicator: "#B4B4B4",//点的颜色
    interval: 5000,
    duration: 1000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.setAppColor();
    that.setData({
      active_tcid: options.gid,
      oncode: options.oncode
    })
    that.load_info();

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
    this.load_info();
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
    var that = this;   
    var title = app.globalData.share_name+' 商品/套餐 详情';   
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: title,
      path: '/' + app.globalData.wx_model_name + '/tc_store/pages/store_goods_info/page?gid=' + that.data.active_tcid + '&oncode=' + that.data.oncode ,
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //图片预览
  previewImage: function (e) {
    var that = this;
    // //img imgs
   // console.log(e.currentTarget.dataset)
   // return false;
    wx.previewImage({
      current: e.currentTarget.dataset.img,
      urls: e.currentTarget.dataset.imgs
    })
  },
  /**
   * 选择新的套餐
   */
  tap_choose_tc:function(e){
    var that=this;
    var tg = e.currentTarget.dataset;
    if (tg.oncode!=that.data.oncode){
    that.setData({
      active_tcid:tg.tcid,
      oncode: tg.oncode
    });
    that.load_info();
    }
  },
  /**
   * 加载套餐信息
   */
  load_info:function(){
    var that=this;
    console.log('商品变更了' + that.data.active_tcid)   
    app.util.request({
      'url': 'entry/wxapp/store_goods_info_action',
      data: {
        op: 'get_one_view',
        openid: wx.getStorageSync('openId'),
        oncode: that.data.oncode
      },
      success(res) {
        var rpjson = res.data.data;
        //console.log(rpjson)
        that.setData({
          it: rpjson
        });
      }
    });
  },
  /**
   * 购买按钮
   */
  tap_buy_goods:function(e){
    var tg=e.currentTarget.dataset;
    var good_det = tg.it;
    
  
    app.util.request({
      'url': 'entry/wxapp/store_order_action',
      data: {
        op:'check_goods',
        gid: good_det.id,
        openId: wx.getStorageSync('openId')
      },
      success(res) {
        var json = res.data.data;
        console.log(json);      
       //json.enable='1';
        if (json.check_kuccun && json.check_lasttime && json.enable=='1'){

          good_det.imgs_list_arr = '';
          good_det.goods_list = '';
          wx.navigateTo({
            url: '../order_sure/page?it=' + JSON.stringify(good_det),
          });
        } else if (json.enable!='1') {
          wx.showToast({
            image: '../../../resource/images/static/error.png',
            title: '该商品未审核通过,无法购买!',
          });
        }else if (!json.check_kuccun){
          wx.showToast({
            image: '../../../resource/images/static/error.png',
            title: '该商品已无库存!',
          });
        } else if (!json.check_lasttime) {
          wx.showToast({
            image: '../../../resource/images/static/error.png',
            title: '该商品已停售!',
          });
        }

      }
    });
   
    
    
    
  },
  tap_phone: function (e) {
    var tg = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: tg.s_phone
    });

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
   * 弹出评论窗口
   */
  tap_comment: function (e) {
    var that = this;
    var tg = e.currentTarget.dataset;
    that.setData({
      pl_ctype: 'parent',
      goods_id: tg.goods_id,
      s_id: tg.s_id,
      attr: tg.attr,
      idx: tg.idx,
      oncode: tg.oncode
    });
    this.showModal();
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
        image: '../../../resource/images/static/error.png',
        title: '用户授权信息无,不可发布评论!',
      });
    } else if (formobj.mcontent == '') {
      wx.showToast({
        image: '../../../resource/images/static/error.png',
        title: '评论内容不能为空!',
      })
    } else {

      // console.log(formobj)
      formobj.op = "add2";
      app.util.request({
        'url': 'entry/wxapp/store_order_comment_action',
        data: formobj,
        success(res) {
          var rpjson = res.data.data;
          that.hideModal();
          //刷新评论
          var it = that.data.it;
          it.cnt_comment_all[that.data.idx].comments_p = rpjson.rp_comment;
          that.setData({
            it: it
          });
        }
      });

    }
    //console.log(formobj)

  },
  /**
   * 评论列表
   */
  tap_comment_list: function (e) {
    var tg = e.currentTarget.dataset;   
    wx.navigateTo({
      url: '../order_comment_list/page?vtype=' + tg.type + '&val=' + tg.val + '&name=' + tg.name
    })
  }


})