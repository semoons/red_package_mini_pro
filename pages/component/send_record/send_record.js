const app = getApp();

Component({

	properties: {
		recordData: {
			type: Object,
			value: {},
			observer: function (newVal, oldVal) {
				console.log(newVal, oldVal);
			}
		}
	},

	data: {
		userInfo: app.globalData.userInfo
	},

	ready: function () { },

	methods: {

	}

})