<template>
	<div class="file-loader">
		<div class="file-loader-canvas" :class="{ 'dragable' : dragable }"
			 v-on:dragenter="dragenter" v-on:dragleave="dragleave" v-on:dragover="dragOver" v-on:drop="drop">
			<div class="file-loader-interface" v-show="!dragable">
				<input type="file" multiple="multiple" @change="change">
				<input type="submit" @click="send">
			</div>
			<div class="file-loader-interface" v-show="dragable">
				Отпустите для загрузки
			</div>
		</div>
	</div>
</template>

<script>
	import fileLoaderApi from './file-loader-api';

	export default {
		props: [],
		data: function () {
			return {
				files: [],
				currentPath: "/",
				dragable: false
			}
		},
		computed: {

		},
		methods: {
			change: function (event) {
				var element = event.target;
				this.files = element.files;
			},
			send: function () {
				var data = new FormData();
				$.each(this.files, function (key, value) {
					data.append(key, value);
				});
				fileLoaderApi.sendFile.execute(data, function (data) {
					alert("complete");
				});
			},
			drop: function () {
				event.preventDefault();
				if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
					this.files = event.dataTransfer.files;
					this.send();
				}
				else {
					alert("Не файл");
				}
				this.dragable = false;
			},
			dragenter: function (event) {
				this.dragable = true;
			},
			dragleave: function (event) {
				this.dragable = false;
			},
			dragOver: function () {
				event.returnValue = false;	// нужна для работы ondrop
				this.dragable = true;
			}
		}
	}
</script>
