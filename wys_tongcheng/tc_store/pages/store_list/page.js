var app=getApp();
var userinfoUtil = require('../../../resource/js/userinfoUtil.js');
var page = 1;
Page({
  data: {
    store_m_type_arr: [],
    store_m_type_idx: 0,
    store_m_type_select: false,
    store_p_type_arr: [],
    store_p_type_idx: 0,
    store_p_type_select: false,
    main_arr_id:[],
    main_parr_all_id:[],

    saxuan_arr: ['最新入驻', '距离最近', '评分最高','人气最高'],
    saxuan_idx:0,
    saxuan_select:false,

    list: [],
    op:'list_store_show',
    shen: ['全部品类', '超市', '花店', '修车铺'],
    shen_2: ['综合排序', '最近入驻', '距离最近', '评分最高'],
    sn: 0,
    imgUrls: [ //轮播图
      '../../resource/images/banner.png'
    ],
    indicatorDots: true,//是否显示点点
    autoplay: true,//自动播放
    active_color: "#fff",//点选中的颜色
    indicator: "#B4B4B4",//点的颜色
    interval: 5000,
    duration: 1000,
  },
  bindPickerChange_store_m_type: function (e) {
    var that = this;
    that.setData({
      store_m_type_select:true,
      store_p_type_select:false,
      store_m_type_idx: e.detail.value,
      store_p_type_idx:0      
    });  
   
   if (e.detail.value==0){
     that.setData({
       store_p_type_arr:['请先选择主品类']
     });
     that.load_list_init();
    }else{
     that.setData({
       store_p_type_arr: that.data.main_parr_all[e.detail.value - 1]
     });
     that.load_list_init();
    }
  

   //console.log(typeof (that.data.store_m_type_idx))
  // console.log(that.data.store_m_type_idx)
  // console.log(that.data.store_m_type_idx!='0')

  //  console.log('主分类 id:' + that.data.main_arr_id[that.data.store_m_type_idx]);
  //  console.log('主分类名称:' + that.data.store_m_type_arr[that.data.store_m_type_idx]);
  //  console.log('主分类选择:' + that.data.store_m_type_select);
  
  //  console.log('子分类 id:' + (that.data.store_m_type_idx != 0 ? that.data.main_parr_all_id[parseInt(that.data.store_m_type_idx) - 1][that.data.store_p_type_idx]  : '0'));
  //  console.log('子分类名称:' + that.data.store_p_type_arr[that.data.store_p_type_idx]);
  //  console.log('子分类选择:' + that.data.store_p_type_select);

  //  console.log('排序:' + (that.data.saxuan_select ? that.data.saxuan_arr[that.data.saxuan_idx] : ''));
 

   //

  },
  bindPickerChange_store_p_type: function (e) {
    var that=this;
    that.setData({
      store_p_type_select:true,
      store_p_type_idx: e.detail.value
    });
    that.load_list_init();


    // console.log('主分类 id:' + that.data.main_arr_id[that.data.store_m_type_idx]);
    // console.log('主分类名称:' + that.data.store_m_type_arr[that.data.store_m_type_idx]);
    // console.log('主分类选择:' + that.data.store_m_type_select);

    // console.log('子分类 id:' + (that.data.store_m_type_idx != 0 ? that.data.main_parr_all_id[parseInt(that.data.store_m_type_idx) - 1][that.data.store_p_type_idx] : '0'));
    // console.log('子分类名称:' + that.data.store_p_type_arr[that.data.store_p_type_idx]);
    // console.log('子分类选择:' + that.data.store_p_type_select);

    // console.log('排序:' + (that.data.saxuan_select ? that.data.saxuan_arr[that.data.saxuan_idx] : ''));

  },
  bindPickerChange_saxuan: function (e) {
    var that=this;
    that.setData({
      saxuan_select:true,
      saxuan_idx: e.detail.value
    });
    that.load_list_init();

    // console.log('主分类 id:' + that.data.main_arr_id[that.data.store_m_type_idx]);
    // console.log('主分类名称:' + that.data.store_m_type_arr[that.data.store_m_type_idx]);
    // console.log('主分类选择:' + that.data.store_m_type_select);

    // console.log('子分类 id:' + (that.data.store_m_type_idx != 0 ? that.data.main_parr_all_id[parseInt(that.data.store_m_type_idx) - 1][that.data.store_p_type_idx] : '0'));
    // console.log('子分类名称:' + that.data.store_p_type_arr[that.data.store_p_type_idx]);
    // console.log('子分类选择:' + that.data.store_p_type_select);

    // console.log('排序:' + (that.data.saxuan_select ? that.data.saxuan_arr[that.data.saxuan_idx] : ''));
  },
  
  bindshen: function (e) {
    this.setData({
      sn: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    userinfoUtil.getUserinfo();
    app.setAppColor();  
    //加载筛选列表
    that.load_init_shaixuan();

if (typeof (wx.getStorageSync('latitude')) == 'undefined' || wx.getStorageSync('latitude') == '' || wx.getStorageSync('latitude') == null) {
      wx.getLocation({
        complete: function (res) {
          wx.setStorageSync('latitude', res.latitude);
          wx.setStorageSync('longitude', res.longitude);
          that.load_list_init();
        }
      });
    } else {
      that.load_list_init();
    }
 

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
    var that=this;
    that.load_list_init();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    var title = app.globalData.share_name+' 店铺/商家 列表';
   
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: title,
      path: '/' + app.globalData.wx_model_name + '/tc_store/pages/store_list/page',
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
   * 初始化 顶部筛选
   */
  load_init_shaixuan:function(){
    var that=this;
    app.util.request({
      'url': 'entry/wxapp/store_mtype_action',
      data: {
        op: 'list_select',
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
          store_m_type_arr: json.main_arr,
          store_p_type_arr: ['请先选择主品类'],// json.main_parr_all[0],       
        });
       
      }

    });
  },
  /**
   * 入驻商圈
   */
  tap_store: function () {
    wx.navigateTo({
      url: '../stroe_add/page?nav_type=send',
    });

  },
  /**
   * 加载初始化
   */
  load_list_init:function(){
    var that=this;
    page = 1;
    that.setData({
      list: [],
      is_no_list: 0//去除更多
    });
    setTimeout(function(){
      that.load_list();
    },400);  

  },
  load_list: function () {
    var that = this;

    var m_type_id = that.data.main_arr_id[that.data.store_m_type_idx];
    var m_type_txt = that.data.store_m_type_arr[that.data.store_m_type_idx];
    var p_type_id = that.data.store_m_type_idx != 0 ? that.data.main_parr_all_id[parseInt(that.data.store_m_type_idx) - 1][that.data.store_p_type_idx] : '0';
    var p_type_txt = that.data.store_p_type_arr[that.data.store_p_type_idx];
    var s_order = that.data.saxuan_select ? that.data.saxuan_arr[that.data.saxuan_idx] : '';
    
    console.log('=-=======')
    if(typeof (m_type_id) =='undefined'){
      m_type_id='0';
    }
    if(typeof (m_type_txt) == 'undefined'){
      m_type_txt='';
    }
    if(typeof (p_type_id) == 'undefined'){
      p_type_id='0';
    }
    if(typeof (p_type_txt) == 'undefined'){
      p_type_txt='';
    }

    if (typeof (s_order) == 'undefined') {
      s_order = '';
    }

    app.util.request({
      'url': 'entry/wxapp/store_info_action',
      data: {
        page: page,
        openid: wx.getStorageSync('openId'),
        op: that.data.op,
        m_type_id: m_type_id,
        m_type_txt: m_type_txt,
        p_type_id: p_type_id,
        p_type_txt: p_type_txt,
        s_order: s_order,
        lon: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude')
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
   * 打开详情
   */
  tap_store_info: function (e) {
    var tg = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../store_info/page?sid=' + tg.sid + '&oncode=' + tg.oncode + '&s_name=' + tg.s_name,
    });
  }
})