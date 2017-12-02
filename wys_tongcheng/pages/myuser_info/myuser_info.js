var app=getApp();
var userinfoUtil = require('../../resource/js/userinfoUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexvalue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.setAppColor();


    //获取用户信息
    userinfoUtil.getUserinfo();

    //获取用户信息
    setTimeout(function () {
      that.getUserinfo_byOpenid();
    }, 500);
   
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
  getUserinfo_byOpenid:function(){
    var that = this;
    //app.globalData.openId='ohzMZ0XzIIhTEtQaLsuQAdo2I1QM';
    if (app.globalData.openId != '') {
      app.util.request({
        'url': 'entry/wxapp/get_user_info',
        data: { u_openid: wx.getStorageSync('openId') },
        success(res) {
          console.log('用户信息')
          console.log(res.data.data)
          that.setData({
            user: res.data.data,
            sexvalue: res.data.data.u_sex
          });


        }
      });
    }
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
  formSubmit: function (e) {
    var that = this;
    var formobj = e.detail.value;
    formobj.u_openid=app.globalData.openId;
    formobj.u_sex = that.data.sexvalue;
    formobj.u_city = app.globalData.userInfo.city;
    formobj.u_avatarurl = app.globalData.userInfo.avatarUrl;
   
    
    if(formobj.u_nickname == ''){
      wx.showToast({
        title: '姓名不能为空!',
      })
    } else if (formobj.u_phone == '') {
      wx.showToast({
        title: '手机号码不能为空!',
      })
    }else{
      app.util.request({
        'url': 'entry/wxapp/saveorupdate_user_info',
        data: formobj,
        success(res) {
         // console.log(res.data);
          wx.navigateBack({ })
          
        }
      });

    }

  },
  /**
   * 性别选择
   */
  radioChange:function(e){
    //console.log()
    this.setData({
      sexvalue: e.detail.value
    });
  }
})