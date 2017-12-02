var app=getApp();
var userinfoUtil = require('../../resource/js/userinfoUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  mid:0,
  init_text:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setAppColor();
    this.setData({ mid:options.mid});
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
   * 快捷信息填写
   */
  tap_txt:function(e){
    var txt = e.currentTarget.dataset.text;
    var init_txt = this.data.init_text;
    init_txt = init_txt.replace(" "+txt,'');
    init_txt = init_txt +" "+ txt;
    this.setData({
      init_text: init_txt
    });
  },
  content_input:function(e){
    var that=this;
    that.setData({
      init_text: e.detail.value
    });
    
  },
  /**
   * 表单提交
   */
  formSubmit:function(e){
    var formID = e.detail.formId;
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

   // console.log(formobj);

    app.util.request({
      'url': 'entry/wxapp/send_jubao',
      data: formobj,
      success(res) {
        console.log(res.data);
        
        wx.showModal({
          title: '提示',
          content: '举报成功',
          showCancel: false,
          confirmText: '关闭返回',
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({});
            }
          }
        });
        


      }
    });


  }
})