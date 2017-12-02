//title 为分享消息消息明细前缀
var title='堪城圈';
//统一文字大小到app.wxss最底部修改
//颜色方案下标
var plan_id = 4;
//小程序头部颜色配置方案
var appColorplan=[
  //微信色主题 字体颜色/背景颜色 下标：0
  { frontColor: '#ffffff', backgroundColor:'#1AAD16'},
  //黄色主题 字体颜色/背景颜色 下标：1
  { frontColor: '#000000', backgroundColor: '#fdd600' },
  //暗红色主题 字体颜色/背景颜色 下标：2
  { frontColor: '#ffffff', backgroundColor: '#CC0033' },
  //橙色主题 字体颜色/背景颜色 下标：3
  { frontColor: '#ffffff', backgroundColor: '#FF5A00' },
  //橙色主题 字体颜色/背景颜色 下标：4
  { frontColor: '#ffffff', backgroundColor: '#62bae2' },
  
  //"backgroundTextStyle":"light",
  //"navigationBarBackgroundColor": "#FF5A00",
];
App({
	onLaunch: function () {
	},
	onShow: function () {
    var that=this;
    //颜色方案设置 输入下标数字
    that.setAppColor();
	},
  setAppColor:function(){
    wx.setNavigationBarColor({
      frontColor: appColorplan[plan_id].frontColor,
      backgroundColor: appColorplan[plan_id].backgroundColor
    });
  },
	onHide: function () {
		console.log(getCurrentPages())
	},
	onError: function (msg) {
		console.log(msg)
	},
	util: require('we7/resource/js/util.js'), 
	globalData:{
    qqmap_key:'',
    wx_model_name:'wys_tongcheng',
    openId:'',
    unionId: '',
		userInfo : null,
    nomoretext:'没有更多了',
    share_name:title,
    store:true,
    pinche: false

	},
  siteInfo: { "name": "\u5fae\u540c\u57ce", "uniacid": "2", "acid": "2", "multiid": "1", "version": "3.1.4", "siteroot":"https://www.canberracircle.com/app/index.php","design_method":"1"}
});
      // {
      //   "pagePath": "wys_tongcheng/tc_store/pages/store_list/page",
      //   "iconPath": "wys_tongcheng/resource/images/menu/store.png",
      //   "selectedIconPath": "wys_tongcheng/resource/images/menu/store_ok.png",
      //   "text": "商家"
      // },