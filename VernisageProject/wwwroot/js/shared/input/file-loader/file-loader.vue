<template>
	<div id="rrrt" class="file-loader" v-on:dragenter="dragenter" v-on:dragleave="dragleave" v-on:dragover="dragOver" v-on:drop="drop">
		<div class="file-loader-interface">
			<input type="file" multiple="multiple" @change="change">
			<input type="submit" @click="send">
		</div>
	</div>
</template>

<script>
	import fileLoaderApi from './file-loader-api';

	export default {
		props: [],
		data: function () {
			return {
				files: []
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
				this.files = event.dataTransfer.files;
				this.send();
			},
			dragenter: function (event) {
				var element = $(event.target);
			},
			dragleave: function (event) {
				var element = $(event.target);
			},
			dragOver: function () {
				event.returnValue = false;	// нужна для работы ondrop
			}
		}
	}
</script>
