const app = getApp()
const CONFIG = app.globalData.config;

Page({
	data: {
		// userInfo
		// logoWidth
		imgUrl: app.globalData.imgUrl,
		
	},

	onLoad: function (options) {
		if (app.globalData.userInfo) {
			this.setData({
				brandInfo: app.globalData.brandInfo,
				userInfo: app.globalData.userInfo
			})

			this.init();
		} else {
			app.userInfoReadyCallback = data => {
				this.setData({
					// 因为用户信息需要brandId数据返回后才能拿到~此处已经拿到了用户信息~所以品牌信息一定已经拿到了
					brandInfo: app.globalData.brandInfo,
					userInfo: data
				});

				this.init();
			}
		}

		this.initLogo();
	},

	init: function() {},

	initLogo: function() {
		const that = this;
		wx.createSelectorQuery().in(this).select('.logo').boundingClientRect(function (rect) {
			if (rect) {
				that.setData({
					logoHeight: rect.bottom - rect.top
				})
				console.log(`${that.data.imgUrl}temp_logo.png`);
				wx.getImageInfo({
					src: `${that.data.imgUrl}temp_logo.png`,
					success: (res) => {
						console.log(that.data.logoHeight);
						that.setData({
							logoWidth: res.width * (that.data.logoHeight / res.height)
						})
						// console.log(res.width)
						// console.log(res.height)
					}
				})
			}
		}).exec();
	},

	playAudio: function(e) {
		const id = e.currentTarget.dataset.id;
		const audioCtx = wx.createAudioContext(id);
		audioCtx.play();
	}
})
