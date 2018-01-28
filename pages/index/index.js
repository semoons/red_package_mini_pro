const app = getApp()
const CONFIG = app.globalData.config;
const imgUrl = app.globalData.imgUrl;
Page({
	data: {
		// userInfo
		// tip
		// btnText
		// playCommand
		// redPackMoney
		// redPackCount
		servicePrice: '0.00',
		imgUrl: imgUrl,
		tabBarList: [{
			iconUrl: `${imgUrl}tab_bar/my_record_icon.png`,
			path: '/pages/record/record',
			text: '我的记录'
		}, {
			iconUrl: `${imgUrl}tab_bar/balance_icon.png`,
			path: '/pages/balance/balance',
			text: '余额提现'
		}, {
			iconUrl: `${imgUrl}tab_bar/problem_icon.png`,
			path: '/pages/record/record',
			text: '常见问题'
		}],

	},

	onLoad: function() {
		console.log(app.globalData);
		if (app.globalData.userInfo) {
			this.setData({
				brandInfo: app.globalData.brandInfo,
				userInfo: app.globalData.userInfo
			})

			this.loadData();
		} else {
			app.userInfoReadyCallback = data => {
				this.setData({
					// 因为用户信息需要brandId数据返回后才能拿到~此处已经拿到了用户信息~所以品牌信息一定已经拿到了
					brandInfo: app.globalData.brandInfo,
					userInfo: data
				});

				this.loadData();
			}
		}
	},

	loadData: function() {

		app.wxRequest({
			interfaceName: CONFIG.interfaceList.GET_USER_PLAY_INFO,
			reqData: {
				userId: this.data.userInfo.user_id,
				brandId: this.data.brandInfo.id
			},
			successCb: (res) => {
				const data = res.data;
				this.setData({
					playCommand: data.play_command,
					serviceChargeRate: data.service_charge_rate,
					money: this.getFloatStr(data.money),
				})
				console.log(res);
			}
		})
	},

	handleRedPackMoney: function(e) {
		const value = e.detail.value;
		if (value < 1 || this.data.redPackCount > 0 && value / this.data.redPackCount < 1) {
			console.log(value)
			this.setData({
				redPackMoney: value,
				servicePrice: this.getFloatStr(this.data.serviceChargeRate * value),
				tip: '每个红包金额不能低于1元',
				showErr: '1'
			});
		} else {
			this.setData({
				redPackMoney: value,
				servicePrice: this.getFloatStr(this.data.serviceChargeRate * value),
				showErr: '0'
			});
		}

		if ((1 + this.data.serviceChargeRate) * value - this.data.money > 0) {
			this.setData({
				btnText: `还需支付${this.getFloatStr((1 + this.data.serviceChargeRate) * value - this.data.money)}元`
			})
		} else {
			this.setData({
				btnText: ''
			})
		}
	},

	handleRedPackCount: function(e) {
		const value = e.detail.value;
		if (this.data.redPackMoney > 0 && this.data.redPackMoney / value < 1) {
			this.setData({
				redPackCount: value,
				tip: '每个红包金额不能低于1元',
				showErr: '1'
			});
		} else {
			this.setData({
				redPackCount: value,
				showErr: '0'
			});
		}
	},

	createCommand: function() {
		if (!this.data.redPackMoney) {
			this.setData({
				tip: '赏金不能为空',
				showErr: '1'
			});
			return
		} else if (!this.data.redPackCount) {
			this.setData({
				tip: '红包数不能为空',
				showErr: '1'
			});
			return;
		}
		app.wxRequest({
			interfaceName: CONFIG.interfaceList.CREATE_REDPACKET,
			bodyData: {
				userId: this.data.userInfo.user_id,
				content: this.data.playCommand,
				count: this.data.redPackCount,
				money: this.data.redPackMoney,
				brandId: this.data.brandInfo.id
			},
			successCb: (res) => {
				this.toPay(res.data);
				console.log(res);
			},
			extendsOptions: {
				method: "POST"
			}
		})
	},

	toPay: function(payInfo) {
		const that = this;
		console.log(payInfo);
		wx.requestPayment({
			'package': payInfo.package,
			'nonceStr': payInfo.nonce_str,
			'timeStamp': payInfo.time_stamp,
			'paySign': payInfo.pay_sign,
			'signType': payInfo.sign_type,
			'success': function(res) {
				wx.navigateTo({
					url: `/pages/share/share?command=${encodeURI(that.data.playCommand).toLowerCase()}&redpacket_send_id=${payInfo.redpacket_send_id}`
				});
			},
			'fail': function(res) {

				app.wxRequest({
					interfaceName: CONFIG.interfaceList.CANCEL_REDPACKET_ACTIVITY,
					reqData: {
						redpacketSendId: payInfo.redpacket_send_id
					},
					successCb: (res) => {
						setTimeout(() => {
							wx.showToast({
								title: '支付失败',
								image: '/images/common/err_tip_icon.png',
								duration: 2000
							});
						}, 320);
						wx.navigateTo({
							url: `/pages/share/share?command=${encodeURI(that.data.playCommand).toLowerCase()}&redpacket_send_id=${payInfo.redpacket_send_id}`
						});
					},
					extendsOptions: {
						method: "POST"
					}
				})
			},
		})
	},

	// 将数字转换为小数点后两位
	getFloatStr: function(num) {
		num += '';
		num = num.replace(/[^0-9|\.]/g, ''); //清除字符串中的非数字非.字符

		if (/^0+/) { //清除字符串开头的0
			num = num.replace(/^0+/, '');
		}

		if (!/\./.test(num)) { //为整数字符串在末尾添加.00
			num += '.00';
		}

		if (/^\./.test(num)) { //字符以.开头时,在开头添加0
			num = '0' + num;
		}

		num += '00'; //在字符串末尾补零
		num = num.match(/\d+\.\d{2}/)[0];
		return num;
	},
})