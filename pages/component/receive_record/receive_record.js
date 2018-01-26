const app = getApp();

Component({

	properties: {
		recordData: {
			type: Object,
			value: {}
		}
	},

	data: {
		userInfo: app.globalData.userInfo
	},

	ready: function () { },

	methods: {

	}

})