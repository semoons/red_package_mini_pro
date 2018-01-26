const app = getApp();
const CONFIG = app.globalData.config;
const queryHelper = require('../../utils/request_helper/request_helper.js');
const Base64 = require('../../utils/encode_helper/base64.js');

Page({

	data: {
		// canvasWidth
		// canvasHeight
		// qrCode
		// doubleLine
		logoText: '歌莉娅',
		couponText: '满5.01减5代金券',
		imgUrl: app.globalData.imgUrl,
	},

	onLoad: function (options) {
		const pathArg = Base64.encode(`/pages/index/index`);
		const widthArg = Base64.encode('300');
		const thumbArg = queryHelper.queryEncoded({ 'link': app.globalData.userInfo.avatarUrl });
		const qrCode = `${CONFIG.interfaceDomin}${CONFIG.interfaceList.CREATE_QR_CODE}/${pathArg}&${widthArg}`;
		const thumb = `${CONFIG.interfaceDomin}${CONFIG.interfaceList.PROXY_GET}/${thumbArg}`;

		this.setData({
			qrCode: qrCode,
			thumb: thumb,
			doubleLine: this.data.couponText.length > 12 ? '1' : '0'
		});
	},

	onShow: function () {
		// setTimeout模拟接口延时~待数据返回后需根据优惠券文字~判断是一行还是两行~对应设置canvas高度
		setTimeout(() => {
			this.init();
		}, 1000);
	},

	init: function() {
		const that = this;
		wx.createSelectorQuery().select('#qrCanvas').boundingClientRect(function (rect) {
			that.setData({
				canvasWidth: rect.width,
				canvasHeight: rect.height
			})
			that.drawImage();
		}).exec();
	},

	drawImage: function () {
		const that = this;

		wx.downloadFile({
			url: this.data.qrCode,
			success(down_res) {
				const canvasWidth = that.data.canvasWidth;
				const canvasHeight = that.data.canvasHeight;

				const couponText = that.data.couponText;
				const logoText = that.data.logoText;

				const qrBoxWidth = Math.floor(0.42 * canvasWidth);
				const qrBoxX = Math.floor((canvasWidth - qrBoxWidth) / 2);
				const qrBoxY = couponText.length > 12 ? canvasHeight * 0.62 : canvasHeight * 0.54;

				const logoWidth = Math.floor(0.18 * canvasWidth);
				const logoX = Math.floor(canvasWidth / 2); // 绘制圆形头像区域的圆点x
				const logoY = Math.floor(canvasHeight * 0.249); // 绘制圆形头像区域的圆点y


				const tempFilePath = down_res.tempFilePath;
				const ctx = wx.createCanvasContext('qrCodeCanvas');

				const couponTextY = 0.49 * canvasHeight;

				ctx.drawImage('/images/other/red_package_bg.png', 0, 0, that.data.canvasWidth, that.data.canvasHeight);
				ctx.drawImage(tempFilePath, qrBoxX, qrBoxY, qrBoxWidth, qrBoxWidth);

				that.writeText(ctx, logoText, canvasWidth / 2, 0.38 * canvasHeight, 14);
				const couponTextArr = couponText.length > 12 ? [couponText.slice(0, 12), couponText.slice(12)] : [couponText];
				couponTextArr.forEach((item, index) => {
					that.writeText(ctx, item, canvasWidth / 2, couponTextY + index * 36, 30);
				});
				
				wx.downloadFile({
					url: that.data.thumb,
					success(down_res) {
						const logoFilePath = down_res.tempFilePath;
						that.drawLogo(ctx, logoFilePath, logoX, logoY, logoWidth / 2);
						ctx.draw();
					}
				})
			}
		})
	},

	writeText: function (ctx, text, x, y, fontSize) {
		ctx.setTextAlign('center');
		ctx.setFontSize(fontSize || 14);
		ctx.fillText(text, x, y)
	},

	drawLogo: function (ctx, logoFilePath, x, y, r) {
		ctx.save(); // 保存当前ctx的状态
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.clip(); //裁剪上面的圆形
		ctx.drawImage(logoFilePath, x - r, y - r, 2 * r, 2 * r); // 在刚刚裁剪的园上画图
		ctx.restore();
	},

	saveImage: function () {
		wx.canvasToTempFilePath({
			canvasId: 'qrCodeCanvas',
			success: function (res) {
				const filePath = res.tempFilePath;
				console.log(filePath);

				wx.saveImageToPhotosAlbum({
					filePath: filePath,
					success(res) {
						try {
							wx.showToast({
								title: '图片保存成功',
							});
						} catch (e) {
							console.log(e);
						}

					},
					fail(res) {
						wx.showToast({
							"title": '保存失败'
						})
					}
				})
			}
		})
	}
})