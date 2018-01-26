const app = getApp()
const CONFIG = app.globalData.config;

Page({

	data: {
		// userId
		tabIndex: 0,
		interFaceNameList: [CONFIG.interfaceList.GET_SEND_RED_PACKAGE, CONFIG.interfaceList.GET_RECEIVED_RED_PACKAGE],
		tabList: [
			{
				text: '我发出的',
				totalCount: '11',
				totalMoney: '11',
				recordList: [],
				hasMore: true,
				pageIndex: 1
			}, {
				text: '我收到的',
				totalCount: '',
				totalMoney: '',
				recordList: [],
				hasMore: true,
				pageIndex: 1
			}
		]
	},

	onLoad: function (options) {
		this.setData({
			userId: app.globalData.userInfo.user_id
		});
	},

	onShow: function () {
		this.loadData(this.data.interFaceNameList[this.data.tabIndex]);
	},

	loadData: function(interFaceName) {
		if(!this.data.tabList[this.data.tabIndex].hasMore) {
			return;
		}
		interFaceName = interFaceName || CONFIG.interfaceList.GET_SEND_RED_PACKAGE
		app.wxRequest({
			interfaceName: interFaceName,
			reqData: {
				userId: this.data.userId,
				pageIndex: this.data.tabList[this.data.tabIndex].pageIndex,
				pageSize: CONFIG.pageSize
			},
			successCb: (res) => {
				const data = res.data;
				const tabIndex = this.data.tabIndex;
				const tabList = this.data.tabList;

				console.log(tabList[tabIndex], data);
				if (data.redpacket_list.length > 0) {
					tabList[tabIndex].pageIndex = tabList[tabIndex].pageIndex + 1;
				} else {// 没有更多数据
					tabList[tabIndex].hasMore = false;
					this.setData({
						tabList: tabList,
					});
					return;
				}
				tabList[tabIndex].totalCount = data.total_send_count >= 0 ? data.total_send_count : data.total_received_count;
				tabList[tabIndex].totalMoney = data.total_send_money >= 0 ? data.total_send_money : data.total_received_money; 
				tabList[tabIndex].recordList = [...tabList[tabIndex].recordList, ...data.redpacket_list];
				console.log(tabList);
				this.setData({
					tabList: tabList,
				});

				console.log(res);

			}
		})
	},

	toggleTab: function(e) {
		console.log(e.currentTarget);
		const index = e.currentTarget.dataset.index;
		this.setData({
			tabIndex: index
		});
	},

	handleChange: function(e) {
		this.setData({
			tabIndex: e.detail.current
		});
		console.log(this.data.tabList[this.data.tabIndex].recordList);
		if (this.data.tabList[this.data.tabIndex].recordList.length <= 0) {
			this.loadData(this.data.interFaceNameList[this.data.tabIndex]);
		}
	},

	onReachBottom: function () {
		this.loadData(this.data.interFaceNameList[this.data.tabIndex]);
	},
})