const app = getApp()
const CONFIG = app.globalData.config;

Page({
    data: {
        // userInfo
		imgUrl: app.globalData.imgUrl
    },
    
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo
            })
        } else {
            app.userInfoReadyCallback = data => {
                this.setData({
                    userInfo: data
                });
            }
        }
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})
