const app = getApp();
const CONFIG = app.globalData.config;
const queryHelper = require('../../utils/request_helper/request_helper.js');
const Base64 = require('../../utils/encode_helper/base64.js');

Page({

	data: {
		// canvasWidth
		// canvasHeight
		// miniProCode
		// commandText
	},

	onLoad: function(options) {
		const commandText = decodeURI(options.command);
		const redpacketSendId = decodeURI(options.redpacket_send_id);
		this.setData({
			commandText: commandText,
			redpacketSendId: redpacketSendId
		});
		const pathArg = Base64.encode(`pages/index/index`);
		const widthArg = Base64.encode('300');
		const sceneArg = Base64.encode('temp.jpg');
		const thumbArg = queryHelper.queryEncoded({
			'link': app.globalData.userInfo.avatarUrl
		});
		const miniProCode = `${CONFIG.interfaceDomin}${CONFIG.interfaceList.CREATE_MINI_PRO_CODE}/${pathArg}&${widthArg}&${sceneArg}`;

		const thumb = `${CONFIG.interfaceDomin}${CONFIG.interfaceList.PROXY_GET}/${thumbArg}`;

		this.setData({
			miniProCode: miniProCode,
			thumb: thumb
		});
	},

	onShow: function() {
		this.setData({
			brandCode: app.globalData.brandCode
		});
		console.log(this.data.brandCode);
		const that = this;
		wx.createSelectorQuery().select('#miniProCodeCanvasHide').boundingClientRect(function(rect) {
			that.setData({
				canvasWidth: rect.width,
				canvasHeight: rect.height
			})

			that.drawImage('miniProCodeCanvasHide', rect.width, rect.height, '/images/share/share_bg.jpg', rect.height);
		}).exec();
	},

	onShareAppMessage: function(res) {
		const that = this;
		wx.canvasToTempFilePath({
			canvasId: 'miniProCodeCanvas',
			success: function(res) {
				const filePath = res.tempFilePath;
				console.log(filePath);
				return {
					title: '福福福福福福福利',
					path: `/pages/success_list/success_list?redpacket_send_id=${that.data.redpacketSendId}&brand_code=${that.data.brandCode}`,
					imageUrl: filePath,
					success: function(res) {},
					fail: function(res) {
						console.log(res);
					}
				}
			}
		})
	},

	drawImage: function(canvasSelect, canvasWidth, canvasHeight, bgUrl, bgHeight, cb) {
		const that = this;
		wx.downloadFile({
			url: this.data.miniProCode,
			success(down_res) {

				const avatarWidth = Math.floor(0.18 * canvasWidth);
				const avatarX = Math.floor(canvasWidth / 2); // 绘制圆形头像区域的圆点x
				const avatarY = Math.floor(canvasHeight * 0.036 + avatarWidth / 2); // 绘制圆形头像区域的圆点y

				const miniProCodeWidth = Math.floor(0.28 * canvasWidth);
				const miniProCodeX = Math.floor(canvasWidth / 2);
				const miniProCodeY = Math.floor(canvasHeight * 0.56);

				const coreWidth = Math.floor(0.108 * canvasWidth);

				const commandText = that.data.commandText;
				const commandTextArr = commandText.length > 12 ? [commandText.slice(0, 12), commandText.slice(12)] : [commandText];
				const textY = commandText.length > 12 ? 0.32 * canvasHeight : 0.36 * canvasHeight;

				const miniProCodeFilePath = down_res.tempFilePath;
				const ctx = wx.createCanvasContext(canvasSelect);

				ctx.drawImage(bgUrl, 0, 0, canvasWidth, bgHeight);
				commandTextArr.forEach((item, index) => {
					that.writeText(ctx, item, 24, '#fbe194', (canvasWidth - 24 * item.length) / 2, textY + 34 * index);
				});

				that.drawMiniProCode(ctx, that.data.miniProCode, miniProCodeX, miniProCodeY, miniProCodeWidth / 2, {
					lineWidth: 6,
					borderColor: '#bb2b2a'
				});

				that.drawCircle(ctx, '/images/share/core_icon.png', miniProCodeX, miniProCodeY, coreWidth / 2);

				wx.downloadFile({
					url: that.data.thumb,
					success(down_res) {
						const thumbFilePath = down_res.tempFilePath;
						that.drawCircle(ctx, thumbFilePath, avatarX, avatarY, avatarWidth / 2, {
							lineWidth: 3,
							borderColor: '#d87348'
						});
						ctx.draw(false, () => {
							typeof cb === 'function' && cb();
						});
					}
				})
			}
		})
	},

	writeText: function(ctx, text, fontSize, color, x, y) {
		ctx.setFontSize(fontSize || 26);
		ctx.setFillStyle(color || '#333');
		ctx.fillText(text, x, y)
	},

	drawCircle: function(ctx, thumbTempFilePath, x, y, r, borderStyle) {

		ctx.save(); // 保存当前ctx的状态
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.clip(); //裁剪上面的圆形
		ctx.drawImage(thumbTempFilePath, x - r, y - r, 2 * r, 2 * r); // 在刚刚裁剪的园上画图
		ctx.restore();

		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		if (borderStyle) {
			ctx.setLineWidth(borderStyle.lineWidth);
			ctx.setStrokeStyle(borderStyle.borderColor);
		}

		ctx.stroke();
	},

	drawMiniProCode: function(ctx, thumbTempFilePath, x, y, r, borderStyle) {
		const radii = (borderStyle ? +borderStyle.lineWidth || 0 : 0) + r;

		ctx.save(); // 保存当前ctx的状态
		ctx.arc(x, y, radii, 0, 2 * Math.PI);
		ctx.setFillStyle('#FFFFFF');
		ctx.fill()
		ctx.clip(); //裁剪上面的圆形
		ctx.drawImage(thumbTempFilePath, x - r, y - r, 2 * r, 2 * r); // 在刚刚裁剪的园上画图
		ctx.restore();

		ctx.beginPath();
		ctx.arc(x, y, radii, 0, 2 * Math.PI);
		if (borderStyle) {
			ctx.setLineWidth(borderStyle.lineWidth);
			ctx.setStrokeStyle(borderStyle.borderColor);
		}

		ctx.stroke();
	},

	handleShowBigImg: function(e) {

		wx.canvasToTempFilePath({
			canvasId: 'miniProCodeCanvasHide',
			success: function(res) {
				const filePath = res.tempFilePath;
				wx.previewImage({
					current: filePath, // 当前显示图片的http链接
					urls: [filePath] // 需要预览的图片http链接列表
				})
			}
		})
	},
})