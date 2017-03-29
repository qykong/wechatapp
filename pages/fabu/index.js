Page({
    data: {
        array: ['求租', '出租'],
        index: 0,
        textLoc: "点击选择地址",
        content: "",
        wxid: "",
        other: "",
        lat: null,
        lon: null
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '租房信息发布'
        })
    },
    bindPickerChange: function (e) {
        console.log(e)
        this.setData({
            index: e.detail.value
        })
    },
    chooseLoc: function () {
        let that = this
        wx.chooseLocation({
          success: function(res){
            console.log(res)
            that.setData({
                textLoc: res.address,
                lat: res.latitude,
                lon: res.longitude
            })
          },
          fail: function(res) {
            that.setData({
                textLoc: "获取地址失败"
            })
          }
        })
    },
    content: function (e) {
        this.setData({
            content: e.detail.value
        })
    },
    wxid: function (e) {
        this.setData({
            wxid: e.detail.value
        })
    },
    other: function (e) {
        this.setData({
            other: e.detail.value
        })
    },
    release: function () {
        let that = this
        console.log({
            "content": that.data.content,
            "lat": that.data.lat? that.data.lat.toString() : null,
            "lon": that.data.lon? that.data.lon.toString() : null,
            "wechatid": that.data.wxid,
            "othercontact": that.data.other === ""? null : that.data.other,
            "forrent": that.data.index
          })
        wx.request({
          url: 'https://cbrcircle.com/api/zufang',
          data: {
            "content": that.data.content,
            "lat": that.data.lat? that.data.lat.toString() : null,
            "lon": that.data.lon? that.data.lon.toString() : null,
            "wechatid": that.data.wxid,
            "othercontact": that.data.other === ""? null : that.data.other,
            "forrent": that.data.index
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {'Content-Type': 'application/json'}, // 设置请求的 header
          success: function(res){
            wx.showToast({
                title: '发布成功',
                icon: 'success',
                duration: 2000
            })
            that.setData({
                index: 0,
                textLoc: "点击选择地址",
                content: "",
                wxid: "",
                other: "",
                lat: null,
                lon: null
            })
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
          }
        })
    }
})
