var app = getApp();
var uploadUrl = "";
var userinfoUtil = require('../../resource/js/userinfoUtil.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    img1: '',
    img2: '',
    img3: '',

    c_img1: '1',
    c_img2: '1',
    c_img3: '1',

    tp_img1: '../../resource/images/sfz/sfz_1.png',
    tp_img2: '../../resource/images/sfz/sfz_2.png',
    tp_img3: '../../resource/images/sfz/sfz_3.png',

    tip_img1: '../../resource/images/sfz/img1_tip.png',
    tip_img2: '../../resource/images/sfz/img2_tip.png',
    tip_img3: '../../resource/images/sfz/img3_tip.png',

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

    var snycopenid = wx.getStorageSync('openId');
    console.log(snycopenid)
    if (snycopenid != '' && snycopenid != null) {
     app.globalData.openId = snycopenid;
      that.load_smrz();
    } else {
      //获取用户信息
      setTimeout(function () {
        userinfoUtil.getUserinfo();
      }, 100);

      setTimeout(function () {
        that.load_smrz();
      }, 1000);      
      
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
    app.setAppColor();
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
   * 获取实名认证资料
   */
  load_smrz: function () {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/get_smrz',
      data: { openId: wx.getStorageSync('openId') },
      success(res) {
        var rpjosn = res.data.data;

        that.setData({
          p_name: rpjosn.p_name,
          p_sfid: rpjosn.p_sfid,
          p_phone: rpjosn.p_phone,
          img1: rpjosn.img1 == null ? '' : rpjosn.img1,
          img2: rpjosn.img2 == null ? '' : rpjosn.img2,
          img3: rpjosn.img3 == null ? '' : rpjosn.img3
        });


        if (rpjosn.audit_status == '1') {
          that.setData({
            audit_status: '审核通过',
            audit_rmk: rpjosn.audit_rmk == null ? '' : rpjosn.audit_rmk + ",请按审核驳回原由,编辑后重新提交资料!"
          });
        } else if (rpjosn.audit_status == '2') {
          that.setData({
            audit_status: '审核驳回',
            audit_rmk: rpjosn.audit_rmk == null ? '' : rpjosn.audit_rmk + ",请按审核驳回原由,编辑后重新提交资料!"
          });
        } else if (rpjosn.audit_status == '0') {
          that.setData({
            audit_status: '审核中',
            audit_rmk: rpjosn.audit_rmk == null ? '' : rpjosn.audit_rmk + ",请按审核驳回原由,编辑后重新提交资料!"
          });
        }

        wx.hideLoading();

      }
    });

  },
  /**
   * 取微信绑定的手机号码
   */
  getPhoneNumber: function (e) {
    var that = this;
    wx.login({
      success: function (ires) {
        app.util.request({
          'url': 'entry/wxapp/get_userinfo',//Userinfo
          data: { code: ires.code },
          success(res) {
            var rpjosn = res.data.data;
            wx.hideLoading();
            if (rpjosn != null) {
              //console.log('自请求');
              //console.log(rpjosn)
              //console.log("取openid:" + rpjosn.openid);
              //console.log("session_key:" + rpjosn.session_key);
              that.phone_api(rpjosn.session_key, e.detail.encryptedData, e.detail.iv);

              that.setData({
                openId: rpjosn.openid
              });
              app.globalData.openId = rpjosn.openid;
              wx.setStorageSync('openId', rpjosn.openid);


            } else {
              console.log('session_key 获取失败!')
            }
          }
        });
      }
    });

    // console.log(e.detail.errMsg)
    // console.log(e.detail.errMsg=='getPhoneNumber:ok')
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData)
  },
  phone_api: function (skey, edate, eiv) {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/get_wxphone',//Userinfo
      data: {
        skey: skey,
        edate: edate,
        eiv: eiv
      },
      success(res) {
        var json = res.data.data;
        console.log(json)
        if (json.gstage == '1') {
          var rdata = JSON.parse(json.rdata);
          that.setData({
            p_phone: rdata.phoneNumber
          });
          wx.showToast({
            title: '获取微信绑定手机号码成功!',
          });
        } else {
          wx.showToast({
            image: '../../resource/images/static/error.png',
            title: '获取失败,可再次点击或输入您的手机号码!',
          });

        }
      }
    });

  }
  ,
  /**
   * 表单提交
   */
  formSubmit: function (e) {
    var that = this;
    var formID = e.detail.formId;
    var formobj = e.detail.value;
    formobj.formID = formID;
    formobj.openId = wx.getStorageSync('openId');
    formobj.img1 = that.data.img1;
    formobj.img2 = that.data.img2;
    formobj.img3 = that.data.img3;

    console.log(formobj);

    var regName = /^[\u4e00-\u9fa5]{2,4}$/;
    var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var mobileRegex = /^(((1[3456789][0-9]{1})|(15[0-9]{1}))+\d{8})$/;
    if (formobj.openId == '') {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '你的用户信息为空,不可提交资料!',
      });
    } else if (formobj.p_name == '') {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '请输入真实姓名,不能为空!',
      });
    } else if (!regName.test(formobj.p_name)) {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '请输入真实姓名,中文2-4字!',
      });
    } else if (formobj.p_sfid == '') {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '请输入您的身份号码,不能为空!',
      });
    } else if (!regIdNo.test(formobj.p_sfid)) {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '请输入18位身份证!',
      });
    } else if (formobj.p_phone == '') {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '请输入您的手机号码,不能为空!',
      });
    } else if (!mobileRegex.test(formobj.p_phone)) {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '输入的手机号码不正确!',
      });
    } else if (formobj.img1 == '') {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '请选择身份证正面照片!',
      });
    } else if (formobj.img2 == '') {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '请选择身份证背面照片!',
      });
    } else if (formobj.img3 == '') {
      wx.showToast({
        image: '../../resource/images/static/error.png',
        title: '请选择手持身份证照片!',
      });
    } else {
      uploadUrl = that.zdy_url('entry/wxapp/smrz_submit_imgs');
      var imglist_sfz = new Array();
      if (that.data.c_img1 == '0') {
        imglist_sfz.push({
          'img': formobj.img1,
          'imgtype': 'img1',
          'openId': formobj.openId
        });
      }

      if (that.data.c_img2 == '0') {
        imglist_sfz.push({
          'img': formobj.img2,
          'imgtype': 'img2',
          'openId': formobj.openId
        });
      }

      if (that.data.c_img3 == '0') {
        imglist_sfz.push({
          'img': formobj.img3,
          'imgtype': 'img3',
          'openId': formobj.openId
        });
      }



      app.util.request({
        'url': 'entry/wxapp/smrz_submit',
        data: formobj,
        success(res) {
          var rpjosn = res.data.data;
          wx.hideLoading();
          if (rpjosn.dostatus == 1) {
            var title = "";
            if (rpjosn.dotype == 'add') {
              title = '提交实名认证资料成功!';
            } else if (rpjosn.dotype == 'edit') {
              title = '编辑实名认证资料成功!';
            }
            that.setData({ title: title });


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
              wx.showModal({
                title: '提示',
                content: that.data.title + ',确定后返回!',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1
                    });
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              });
            }

          } else {
            if (rpjosn.dotype == 'add') {
              wx.showToast({
                image: '../../resource/images/static/error.png',
                title: '发布实名认证资料失败!',
              });
            } else if (rpjosn.dotype == 'edit') {
              wx.showToast({
                image: '../../resource/images/static/error.png',
                title: '编辑实名认证资料失败!',
              });
            }
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
      formData: { 'imgtype': filePaths[i].imgtype, 'openId': filePaths[i].openId },
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
          wx.showModal({
            title: '提示',
            content: that.data.title + ',确定后返回!',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                });
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });


        }
        else {  //递归调用uploadDIY函数
          that.uploadDIY(filePaths, successUp, failUp, i, length);
        }
      },
    });
  },
  /**
   * 图标选择
   */
  choosePic: function (e) {
    var that = this;
    var img_type = e.currentTarget.dataset.img;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有//'original', 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        if (img_type == 'img1') {
          that.setData({
            img1: tempFilePaths[0],
            c_img1: '0'
          });
        } else if (img_type == 'img2') {
          that.setData({
            img2: tempFilePaths[0],
            c_img2: '0'
          });
        } else if (img_type == 'img3') {
          that.setData({
            img3: tempFilePaths[0],
            c_img3: '0'
          });
        }
      }
    });
  },
  /**
   * 删除相应图片
   */
  pic_remove: function (e) {
    var that = this;
    var img_type = e.currentTarget.dataset.img;
    wx.showModal({
      title: '提示',
      content: '是否删除图片?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          if (img_type == 'img1') {
            that.setData({ img1: '' });
          } else if (img_type == 'img2') {
            that.setData({ img2: '' });
          } else if (img_type == 'img3') {
            that.setData({ img3: '' });
          }
        }
      }
    });
  }



})