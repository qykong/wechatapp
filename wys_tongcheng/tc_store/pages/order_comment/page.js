var app = getApp();
var uploadUrl = "";
var oncode = '';//消息识别码
var userinfoUtil = require('../../../resource/js/userinfoUtil.js');
var WxNotificationCenter = require("../../../../we7/resource/plugin/WxNotificationCenter/WxNotificationCenter.js");
var qqmapsdk;
var imgcnt = 6;
Page({
  data: {    
    flag: 5,
    flag_str: '非常好',
    tag_list:[
      ['价格太贵','与实物不符',''],
      ['价格太贵', '与实物不符', '']
    ],
    imglist: [],
    imgcnt:6 ,
    pl_ctype:'main'  
  },
  changeColor:function (e) {
    var that = this;
    var tg = e.currentTarget.dataset;
    console.log(tg)
    that.setData({
      flag: parseInt(tg.flag)
    });
    if(tg.flag=='1'){
      that.setData({
        flag_str:'非常差'
      });
    } else if (tg.flag == '2') {
      that.setData({
        flag_str: '差'
      });
    } else if (tg.flag == '3') {
      that.setData({
        flag_str: '一般'
      });
    } else if (tg.flag == '4') {
      that.setData({
        flag_str: '好'
      });
    } else if (tg.flag == '5') {
      that.setData({
        flag_str: '非常好'
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;    
    userinfoUtil.getUserinfo();

    that.setData({
      oncode: options.oncode,
      s_id: options.s_id,
      goods_id: options.goods_id,
    });


   
   
    app.setAppColor();
   
    app.util.request({
      'url': 'entry/wxapp/get_user_info',
      data: { u_openid: wx.getStorageSync('openId') },
      success(res) {
        console.log('=======================')
      
        var json = res.data.data;
        //console.log('系统信息')
        //console.log(res.data)
        if (json) {        


        }
      }, fail(res){

      }, complete(res){
        wx.setStorageSync('isShowLoading', true);
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 表单提交
   */
  formSubmit: function (e) {
    var that = this;
    var formID = e.detail.formId;
  
    var formobj = e.detail.value;
    formobj.u_nickname = app.globalData.userInfo.nickName;
    formobj.u_city = app.globalData.userInfo.city;
    formobj.u_openid = app.globalData.openId;
    formobj.u_unionid = '';
    formobj.u_avatarurl = app.globalData.userInfo.avatarUrl;
    formobj.formID = formID;
    formobj.flag = that.data.flag;
    formobj.op = "add";

    console.log(formobj)
    // return false;

    var phone_isopen = that.data.phone_isopen;
    if (formobj.mcontent == '') {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '点评消息内容不能为空!',
      });
    }else {
      wx.showLoading({
        title: '信息保存中...',
      });    
    
      //上传信息
      app.util.request({
        'url': 'entry/wxapp/store_order_comment_action',
        data: formobj,
        method: 'post',
        success(res) {
          // console.log(res.data);
          var rpjson = res.data.data;
         
            //消息识别码
            //oncode = rpjson.oncode;         
            wx.hideLoading();

            uploadUrl = that.zdy_url('entry/wxapp/store_order_comment_img');
            //上传图片
            var successUp = 0; //成功个数
            var failUp = 0; //失败个数
            var length = that.data.imglist.length; //总共个数
            if (length > 0) {
              var i = 0; //第几个
              that.uploadDIY(that.data.imglist, successUp, failUp, i, length);
              wx.showLoading({
                title: '图片上传中...',
              });
            } else {
              that.send_over();
            }

          
        }
      });
    }
  },
  /* 函数描述：作为上传文件时递归上传的函数体体；
   * 参数描述： 
   * filePaths是文件路径数组
   * successUp是成功上传的个数
   * failUp是上传失败的个数
   * i是文件路径数组的指标
   * length是文件路径数组的长度
   */
  uploadDIY(filePaths, successUp, failUp, i, length) {
    var that = this;
    //console.log(uploadUrl)
    wx.uploadFile({
      url: uploadUrl,
      filePath: filePaths[i],
      name: 'file',
      formData: { 'oncode': that.data.oncode },
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
          //this.payMoney(0.01);
          that.send_over();

        }
        else {  //递归调用uploadDIY函数
          this.uploadDIY(filePaths, successUp, failUp, i, length);
        }
      },
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
      count: imgcnt - imglistlength, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 'original', 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths)
        for (var i = 0, len = tempFilePaths.length; i < len; i++) {
          imglist.push(tempFilePaths[i]);
        }
        that.setData({
          imglist: imglist,
          upimgbtt: imglist.length >= imgcnt
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
    Array.prototype.indexOf = function (val) { for (var i = 0; i < this.length; i++) { if (this[i] == val) return i } return -1 };
    Array.prototype.remove = function (val) { var index = this.indexOf(val); if (index > -1) { this.splice(index, 1) } };
    var that = this;
    var imglist = this.data.imglist;
    wx.showModal({
      title: '提示',
      content: '是否删除图片?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');

          imglist.remove(e.currentTarget.dataset.img);
          that.setData({
            imglist: imglist,
            upimgbtt: imglist.length >= imgcnt
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  /**
   * 退出发布界面
   */
  send_over: function () {
    WxNotificationCenter.postNotificationName('comments_ok');
    wx.navigateBack({
      delta: 1
    });
    //   wx.redirectTo({
    //   url: '../index/index'
    // });
    //WxNotificationCenter.postNotificationName("close_win_release");
    // wx.redirectTo({
    //   url: '../myuser_send/msg_list',
    // });

  }


})