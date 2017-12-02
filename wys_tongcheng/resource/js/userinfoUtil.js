var userinfoutil={};
var app=getApp();
var util = require('../../../we7/resource/js/util.js');
//获取openid
userinfoutil.getOpenId = function (code){
  var that = this;
 
    app.util.request({
      'url': 'entry/wxapp/get_userinfo',
      data: { code: code},
      success(res) {
        var rpjosn = res.data.data;
        wx.hideLoading();
        console.log(res.data)
        //console.log('获取用户openID::' + rpjosn);
        if (rpjosn != null) {
          //console.log(rpjosn) // app.globalData.unionId
          console.log("获取用户openID:" + rpjosn.openid);


          if (app.globalData.userInfo != null && app.globalData.openId != '') {
            var have_user = wx.getStorageSync('have_status_user');
            //console.log("have_user:" + have_user)
            if (have_user) {
              console.log('检查一次用户信息')
              that.check_user_have();
            }

          }

          // that.setData({
          //   openId: rpjosn.openid
          // });
          app.globalData.openId = rpjosn.openid;
          wx.setStorageSync('openId', rpjosn.openid);
        } else {
          console.log('======解析失败==openid=======')
        }
      }
    });

  //   if (app.globalData.openId == '') { }else{
  //   wx.setStorageSync('openId', app.globalData.openId);
  // }
}

userinfoutil.getUserinfo_det = function (code) {
  var that = this;  
  var snycopenid = wx.getStorageSync('openId');
  var snycubinfo = wx.getStorageSync('ubinfo');  
  if (snycopenid != '' && snycopenid != null) {
     app.globalData.openId = snycopenid;
    that.getOpenId(code);
    // console.log('缓存Store:' + app.globalData.openId);    
  } else {
    if (app.globalData.openId == '' && app.globalData.openId != null && typeof (snycubinfo.avatarUrl) != 'undefined' && snycubinfo.avatarUrl != '') {
      that.getOpenId(code);
    } else {
      console.log('缓存App:' + app.globalData.openId);


      //that.setData({        openId: app.globalData.openId      });
    }

  }
     
    if (snycubinfo != '' && snycubinfo != null) {
     // that.setData({ ubinfo: snycubinfo });
      app.globalData.userInfo = snycubinfo;
      console.log('缓存stroe:' + JSON.stringify(snycubinfo))
    } else {
      if (app.globalData.userInfo == null) { 
        wx.getUserInfo({
          success: function (res) {
            var userInfo = res.userInfo
            // var nickName = userInfo.nickName
            // var avatarUrl = userInfo.avatarUrl
            // var gender = userInfo.gender //性别 0：未知、1：男、2：女
            // var province = userInfo.province
            // var city = userInfo.city
            // var country = userInfo.country
            console.log('实时用户信息>>>')
            console.log(userInfo)
            app.globalData.userInfo = userInfo;
            wx.setStorageSync('ubinfo', userInfo);
            
           // console.log('OPENID:' + app.globalData.openId)
            
            //console.log(app.globalData.nomoretext)
          }
        });      
        
        
        // app.util.getUserInfo(function (userInfo) {
        //   //更新数据    
        //   console.log('================')
        //   console.log(userInfo.wxInfo)
        //   app.globalData.userInfo = userInfo.wxInfo;
        //   //that.setData({ ubinfo: userInfo.wxInfo });
        //   wx.setStorageSync('ubinfo', userInfo.wxInfo);
         

        // });

        setTimeout(function () {
          if (app.globalData.openId == '') {

            wx.login({
              success: function (fires) {
                if (fires.code) {
                  that.getOpenId(fires.code);
                }
              }
            });

          }
        }, 1500);

      } else {      
        //that.setData({ ubinfo: app.globalData.userInfo });
      }
    }

    setTimeout(function(){

    if (app.globalData.userInfo != null && app.globalData.openId != '') {
      var have_user = wx.getStorageSync('have_status_user');
      //console.log("have_user:" + have_user)
      if (have_user) {
        console.log('检查一次用户信息')
        that.check_user_have();
      }

    }

   },1200);

   

}

//强制获取用户信息
userinfoutil.getUserinfo = function (){
  var that = this;

  wx.login({
    success: function (ires) {
      if (ires.code) {
        wx.getUserInfo({
          success: function (data) {     
                  
            that.getUserinfo_det(ires.code);
          }, fail: function () {
            wx.showModal({
              title: '提示',
              content: '授权获取用户信息失败,将不可发布消息和评论!',
              confirmText: '去设置',
              success: function (mres) {
                if (mres.confirm) {
                  wx.openSetting({
                    success: function (pdata) {
                      if (pdata) {
                        if (pdata.authSetting["scope.userInfo"] == true) {
                          console.log('取得用户信息授权成功');
                          
                          wx.login({
                            success: function (twores) {
                              if (twores.code) {
                                that.getUserinfo_det(twores.code);
                              }
                            }
                          });
                          
                         

                        } else {
                          that.getUserinfo();
                        }
                      }
                    }
                  });
                }else{
                  that.getUserinfo();
                }
              }
            });
          }
        });
      }
    }
  });


}
//检查用户信息
userinfoutil.check_user_have=function(){
  var formobj = {};
  formobj.u_unionid = app.globalData.unionId;
  formobj.u_openid = app.globalData.openId;
  formobj.u_nickname = app.globalData.userInfo.nickName;
  formobj.u_city = app.globalData.userInfo.city;
  formobj.u_avatarurl = app.globalData.userInfo.avatarUrl;
  formobj.u_gender = app.globalData.userInfo.gender;
  formobj.u_province = app.globalData.userInfo.province;
  formobj.u_country = app.globalData.userInfo.country;
  if (formobj.u_openid != '') {
    app.util.request({
      'url': 'entry/wxapp/check_user_have',
      data: formobj,
      success(res) {
        console.log("检查用户信息:");
        console.log(res.data.data)
        wx.setStorageSync("have_status_user", res.data.data.user_have);
        //console.log(res)
        // that.setData({
        //   copyright: res.data.data
        // });
      }
    });
  }


}



//帐户支付
userinfoutil.pay_user_account= function () {

}



//微信支付

userinfoutil.pay_wx_api=function(){

}
//获取地址信息
userinfoutil.gps_loc = function () {


  
}









module.exports = userinfoutil;