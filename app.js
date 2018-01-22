const CONFIG = require('./base_config.js').config;
const queryHelper = require('./utils/request_helper/request_helper.js');

App({

    // 定义一下当前类需要用到的变量
    appData: {
        // code
    },

    globalData: {
        // globalData
        // userInfo
        imgUrl: CONFIG.imgUrl,
        config: CONFIG,
    },

    onLaunch: function (options) {

        this.handleCookieId();
        this.handleUserInfo();

    },

    handleCookieId: function () {
        try {
            let systemInfoArr = wx.getSystemInfoSync().system.split(' ');
            this.appData.sysType = systemInfoArr[0].toUpperCase();
            this.appData.sysVersion = systemInfoArr[1];
            let cookieId = wx.getStorageSync('cookie_id');
            if (!cookieId) {
                cookieId = new Date().getTime();
                wx.setStorageSync('cookie_id', cookieId);
            }
            this.appData.cookieId = cookieId;
            this.globalData.cookieId = cookieId;

        } catch (e) { }
    },

    handleUserInfo: function () {
        try {
            const userInfo = wx.getStorageSync('USER_INFO');
            if (userInfo) {
                this.globalData.userInfo = userInfo;
            } else {
                // 登录
                wx.login({
                    success: res => {
                        this.appData.code = res.code;
                        // 获取用户信息
                        wx.getSetting({
                            success: res => {
                                this.getUserInfo();
                            }
                        })
                    }
                })
            }
        } catch (e) { }
    },

    getUserInfo: function () {
        console.log('调用了请求用户信息接口');
        wx.getUserInfo({
            success: res => {
                res.userInfo.code = this.appData.code;
                let userInfo = res.userInfo;

                // todo-------------------------以下设置用户信息的代码将来对接到具体接口的成功回调函数中
                this.globalData.userInfo = userInfo;
                wx.setStorage({
                    key: 'USER_INFO',
                    data: userInfo
                });
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况（其实就是确保异步返回的用户信息数据可以渲染到页面上）
                if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(userInfo)
                }
                // todo end-------------------------------------------------------------------------

            },
            fail: res => {
                wx.openSetting({
                    success: (res) => {
                        this.getUserInfo();
                    },
                    fail: (res) => {
                        console.log(res);
                    }
                })
            }
        })
    },

    // 数据请求函数
    wxRequest: function ({
		interfaceName,
        reqData,
        bodyData,
        successCb,
        failCb = (res) => {
            console.log('请求失败~具体信息为：', res);
            wx.showToast({
                title: res.msg.length > 7 ? '接口请求错误' : res.msg,
                image: '/images/common/err_tip_icon.png',
                duration: 2000
            })
        },
        isShowLoad = 1,
        extendsOptions = {}
	}) {

        if (isShowLoad === 1) {
            wx.showLoading({
                title: '加载中...',
            });
        }

        // 根据域名,接口名和请求参数组成最后的请求url
        // domin + interfaceName + queryHelper.queryEncoded(reqData)
        // 如果而外配置中传入noHeaderArg表示此次请求的请求参数要放到请求体中而不是url中~故无需编码拼接
        const domin = CONFIG.interfaceDomin;
        const reqUrl = reqData ?
            `${domin}${interfaceName}/${queryHelper.queryEncoded(reqData)}` :
            `${domin}${interfaceName}`;

        console.log('请求信息：', reqUrl, reqData);

        wx.request({
            url: reqUrl,
            data: bodyData || '',
            method: extendsOptions.method || CONFIG.reqMethod,
            header: {
                ...CONFIG.header,
                sys_type: this.appData.sysType,
                sys_version: this.appData.sysVersion,
                cookie_id: this.appData.cookieId
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code === '1') {
                    typeof successCb == "function" && successCb(res.data);
                } else {
                    failCb(res.data);
                }

            },
            fail: function (res) {
                wx.hideLoading();
                failCb(res.data);
            }
        })
    },

})