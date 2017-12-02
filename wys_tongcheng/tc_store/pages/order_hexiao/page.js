var userinfoUtil = require('../../../resource/js/userinfoUtil.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userinfoUtil.getUserinfo();

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
   * 核销二维码 (res) =>
   */
  tap_scanCode:function(){
    var that=this;
    wx.scanCode({
      success: (res) => {
        wx.showToast({         
          title: '扫码成功,信息查询中!',
        });
        console.log(res);
        var result = res.result;
        console.log(result);
        that.setData({
          result: result
        });

        app.util.request({
          'url': 'entry/wxapp/store_order_action',
          data: {
            op:'check_order',
            oncode: result,
            openid: wx.getStorageSync('openId')
          },
          success(res) {
            var rpjson = res.data.data;
            //console.log(rpjson)
            that.setData({
              order: rpjson
            });
            if (rpjson.status=='0') {
              wx.showModal({
                title: '核销失败',
                content: '该订单未支付,无法核销!',
                showCancel: false
              });
            } else if (rpjson.hexiao_use == '1') {
              wx.showModal({
                title: '核销失败',
                content: '该订单已核销过,无法再次核销!',
                showCancel: false
              });
            }else if(!rpjson.hexiao_do_status){
              wx.showModal({
                title: '核销失败',
                content: '您没有权限核销该订单!',
                showCancel:false
              });
            }else{
              wx.showModal({
                title: '提示',
                content: '是否核销该订单,￥:' + rpjson.total_money+'元',
                confirmText:'确认核销',
                success: function (res) {
                  if (res.confirm) {                  

                    app.util.request({
                      'url': 'entry/wxapp/store_order_action',
                      data: {
                        op:'hexiao_sure',
                        oncode:rpjson.oncode,
                        openid: wx.getStorageSync('openId')
                      },
                      success(res) {
                       
                        wx.showModal({
                          title: '核销成功',
                          content: '该订单已成功核销!',
                          showCancel: false
                        });

                      }
                    });




                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              });

            }
          }
        });

       
      },
      fail:(res)=>{
        //console.log(res);
        wx.showToast({
          image: '../../../resource/images/static/error.png',
          title: '扫码失败!',
        });
      }
    });

  }
})