const app = getApp()
const CONFIG = app.globalData.config;

Page({
	data: {
		// userInfo
		// logoWidth
		imgUrl: app.globalData.imgUrl,
		
	},

	onLoad: function (options) {
		this.initLogo();
	},

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
