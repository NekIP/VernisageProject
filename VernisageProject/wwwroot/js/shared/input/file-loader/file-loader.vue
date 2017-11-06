<template>
	<div class="file-loader">
		<input type="file" multiple="multiple" @change="change">
		<input type="submit" @click="send">
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
				console.log(this.files);
			},
			send: function () {
				var data = new FormData();
				$.each(this.files, function (key, value) {
					data.append(key, value);
				});
				
				fileLoaderApi.sendFile.execute(data, function (data) {
					
				});
			}
		}
	}
</script>
