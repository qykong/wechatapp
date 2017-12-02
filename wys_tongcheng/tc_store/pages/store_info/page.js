var app=getApp();
var userinfoUtil = require('../../../resource/js/userinfoUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {   
    showModalStatus: false,
    indicatorDots: true,//是否显示点点
    autoplay: true,//自动播放
    active_color: "#fff",//点选中的颜色
    indicator: "#B4B4B4",//点的颜色
    interval: 5000,
    duration: 1000,
    s_id:'',
    s_name:'',
    s_oncode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    userinfoUtil.getUserinfo();
    app.setAppColor();
    //options.sid

    wx.setNavigationBarTitle({
      title: options.s_name + ' 详情'
    });
    that.setData({
      s_id: options.sid,
      s_oncode: options.oncode,
      s_name: options.s_name,
    });

    app.util.request({
      'url': 'entry/wxapp/store_info_action',
      data: {
        op: 'get_one_view',
        oncode: options.oncode,
        openid: wx.getStorageSync('openId')
      },
      success(res) {
        var json = res.data.data;
        //console.log(json)
        //console.log(json.goods_list)
        that.setData({
          it: json,
          is_sale: json.goods_list.length>0
        });
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
  onShareAppMessage: function (res) {  
    var that = this;
    var s_name = that.data.s_name;    
    var title = app.globalData.share_name;
    if (s_name != '' && s_name != null && s_name != 'null') {
      title += " " + s_name + ' 详情';
    } else {
      title += ' 店铺/商家 详情';
    }
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: title,
      path: '/' + app.globalData.wx_model_name + '/tc_store/pages/store_info/page?sid=' + that.data.s_id + '&oncode=' + that.data.s_oncode + '&s_name=' + that.data.s_name,
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
   * 商品信息
   */
  tap_store_goods_info: function (e) {
    var tg = e.currentTarget.dataset;
    var gid = tg.gid;
    var oncode = tg.oncode;
    var sid = tg.sid;
    wx.navigateTo({
      url: '../store_goods_info/page?gid=' + tg.gid + '&oncode=' + tg.oncode
    });
  },
  tap_phone:function(e){
    var tg=e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: tg.s_phone
    });

  },
  /**
   * 打开地图标注
   */
  open_map: function (e) {
    console.log(e.currentTarget.dataset)
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
   * 弹出评论窗口
   */
  tap_comment: function (e) {
    var that = this;
    var tg = e.currentTarget.dataset;   
    that.setData({
      pl_ctype: 'parent',
      goods_id: tg.goods_id,    
      s_id: tg.s_id,
      attr:tg.attr,
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
      formobj.op="add2";
      app.util.request({
        'url': 'entry/wxapp/store_order_comment_action',
        data: formobj,
        success(res) {
          var rpjson = res.data.data;
          that.hideModal();
          //刷新评论
        

          var it = that.data.it;
          console.log(it.cnt_comment_all[that.data.idx])

          it.cnt_comment_all[that.data.idx].comments_p = rpjson.rp_comment;
          that.setData({
            it:it
          });

          // if (that.data.currentTab == 0) {
          //   var list_t = that.data.m_list_0;
          //   list_t[m_idx].comments = ;
          //   list_t[m_idx].comments_cnt = parseInt(list_t[m_idx].comments_cnt) + 1;
          //   that.setData({ m_list_0: list_t });
          // }
          //刷新评论结束
        }
      });

    }
    //console.log(formobj)

  }
  ,
  /**
   * 评论列表
   */
  tap_comment_list:function(e){
    var tg=e.currentTarget.dataset;
    wx.navigateTo({
      url: '../order_comment_list/page?vtype=' + tg.type + '&val=' + tg.val + '&name=' + tg.name
    })
  }

})