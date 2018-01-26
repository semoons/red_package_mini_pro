const app = getApp();

Component({

	properties: {
		showLoadingHover: {
			type: Boolean,
			value: true,
			observer: function (newVal, oldVal) {
				console.log(oldVal, newVal);
				if (!newVal) {
					this.setData({
						hidden: true
					})

					setTimeout(() => {
						this.setData({
							show: false
						})
					}, 320);
				}
			}
		}
	},

	data: {
		show: true,
		hidden: false
	}

})