<template>
	<div class="custom-select">
		<div class="current-value" role="button" @click="show">
			<div v-show="items && Object.keys(this.items).length > 0">
				<template v-if="result.value in items">{{ items[result.value] }}</template>
				<template v-else>Выберите элемент</template>
				<i class="fa fa-arrow-down" aria-hidden="true" v-show="!showSelector"></i>
				<i class="fa fa-arrow-up" aria-hidden="true" v-show="showSelector"></i>
			</div>
			<div v-show="!items || Object.keys(this.items).length == 0">
				Список пуст
			</div>
		</div>
		<transition name="slide-fade">
			<div class="selector" v-show="showSelector && items && Object.keys(this.items).length > 0">
				<div class="selector-item" v-for="(caption, value) in items" 
					 :class="{ 'selected' : value == result.value }" 
					 @click="select(value)">{{ caption }}</div>
			</div>
		</transition>
	</div>
</template>

<script>
	export default {
		props: ['items', 'result', 'callback'],
		data: function () {
			return {
				currentIndex: 0,
				showSelector: false,
				fromShow: false
			}
		},
		computed: {
			selectSize: function () {
				var keyLengths = this.items.map(function (item) { return item.key.length });
				return Math.max(keyLengths);
			}
		},
		methods: {
			show: function (event) {
				this.showSelector = !this.showSelector;
				if (this.showSelector) {
					this.fromShow = true;
					$(document).bind('click', this.forceHide);
					$(document).bind('keyup', this.keyPress);
				}
				else {
					$(document).unbind('click', this.forceHide);
					$(document).unbind('keyup', this.keyPress);
				}
			},
			forceHide: function (event) {
				if (!this.fromShow) {
					this.show();
				}
				else {
					this.fromShow = false;
				}
			},
			keyPress: function (event) {
				if (event.keyCode == 38) {
					this.up();
				}
				else if (event.keyCode == 40) {
					this.down();
				}
				else if (event.keyCode == 13) {	// enter
					this.show();
				}
				event.preventDefault();
				event.stopPropagation();
			},
			setResult: function (item) {
				this.result.value = item;
				if (this.callback) {
					this.callback(item);
				}
			},
			select: function (selected) {
				this.setResult(selected);
				this.show();
			},
			up: function () {
				this.calcCurrent();
				this.currentIndex--;
				if (this.currentIndex < 0) {
					this.currentIndex = Object.keys(this.items).length - 1;
				}
				this.move();
			},
			down: function () {
				this.calcCurrent();
				this.currentIndex++;
				if (this.currentIndex >= Object.keys(this.items).length) {
					this.currentIndex = 0;
				}
				this.move();
			},
			move: function () {
				var i = this.currentIndex;
				for (var key in this.items) {
					if (i <= 0) {
						this.setResult(key);
						return;
					}
					i--;
				}
			}, 
			calcCurrent: function () {
				var i = 0;
				for (var key in this.items) {
					if (key == this.result.value) {
						this.currentIndex = i;
					}
					i++;
				}
			}
		}
	}
</script>


