new Vue({
	el: '#vue-test',
	data: function () {
		var items = {
			1: "Январь",
			2: "Март",
			3: "Апрель",
			4: "Май",
			5: "Июнь",
			6: "Июль",
			7: "Август",
			8: "Сентябрь",
			9: "Октябрь",
			10: "Ноябрь",
			12: "Декабрь",
			13: "Январь",
			24: "Март",
			35: "Апрель",
			46: "Май",
			57: "Июнь",
			68: "Июль",
			79: "Август",
			80: "Сентябрь",
			97: "Октябрь",
			130: "Ноябрь",
			124: "Декабрь"
		};
		var items1 = {};

		var result = { value: 1 };
		var result1 = { value: 3 };

		return {
			items: items,
			result: result,
			items1: items1,
			result1: result1
		}
	},
	methods: {
		callback: function (newValue) {
			this.result = newValue;
		},

		generateItems: function () {
			alert(Object.keys(this.items1).length);
			for (var i = 0; i < 100; i++) {
				this.items1[i] = "ghjgh" + i;
			}
			alert(Object.keys(this.items1).length);
		}
	}
});
