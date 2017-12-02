var app = getApp();
var userinfoUtil = require('../../../resource/js/userinfoUtil.js');
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    op:'list_show',
    vtype: "",//store 店铺s_id  goods 商品goods_id
    val:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    userinfoUtil.getUserinfo();
    app.setAppColor();

    var title="";
    if (options.vtype =='store'){
      title = options.name+" 店铺评价列表";
    } else if(options.vtype == 'goods') {
      title = options.name + " 商品评价列表";
    }
    wx.setNavigationBarTitle({
      title: title,
    })
   
    // options.vtype ='store';
    // options.val='27';


    // options.vtype ='goods';
    // options.val='4';

    that.setData({
      vtype: options.vtype,
        val: options.val
    })

   
    page = 1;
    that.setData({ list: [] });
    that.load_list();  

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
    page = 1;
    this.setData({
      list: [],
      is_no_list: 0//去除更多
    });
    this.load_list();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.ismore) {
      wx.showToast({
        title: '加载更多...',
      })
      page++;
      that.load_list();
    } else {
      wx.showToast({
        title: app.globalData.nomoretext
      });
    }
  },
  load_list: function () {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/store_order_comment_action',
      data: {
        page: page,
        vtype: that.data.vtype,
        val: that.data.val,
        op: that.data.op
      },
      success(res) {
        var json = res.data.data;
        //that.createQrCode('123123',"mycanvas");

        var list_t = that.data.list;
        var len = json.length;
        for (var i = 0; i < len; i++) {
          list_t.push(json[i]);
        }
        if (len == 0) {
          that.setData({ is_no_list: 1 });
        }
        that.setData({
          list: list_t,
          ismore: len > 0
        });
      }

    });
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
          var list = that.data.list;
        

          list[that.data.idx].comments_p = rpjson.rp_comment;
          that.setData({
            list: list
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
})