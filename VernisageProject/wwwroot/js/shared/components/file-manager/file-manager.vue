<template>
	<div class="file-manager">
		<div>{{currentDirectory}}</div>
		<ul>
			<li v-for="file in files" :title="file.length + '/' + file.dateCreated">
				<i v-if="file.type === 'File'" class="fa fa-file" aria-hidden="true"></i>
				<i v-else class="fa fa-folder" aria-hidden="true"></i>
				<i @click="content(file)">{{file.name}}</i>
			</li>
		</ul>
	</div>
</template>

<script>
	import fileManagerApi from './file-manager-api';

	export default {
		props: [],
		data: function () {
			return {
				currentDirectory: "/",
				files: []
			}
		},
		created: function () {
			this.initFilesForCurrentDirectory();
		},
		methods: {
			initFilesForCurrentDirectory: function () {
				this.files = [];
				fileManagerApi.listFiles.execute({ currentDirectory: this.currentDirectory }, this.initFiles);
			},
			initFiles: function (data) {
				if (data && data.length) {
					for (var i = 0; i < data.length; i++) {
						var item = data[i];
						this.files.push({
							name: item.name,
							length: item.length,
							dateCreated: item.dateCreated,
							type: item.type,
							path: item.path,
							href: item.href
						});
					}
				};
				console.log(this.files);
			},
			content: function (file) {
				switch (file.type) {
					case 'Folder':
						this.initFilesForCurrentDirectory();
						break;
					case 'File':
						// TODO: Show content
						break;
				}
			}
		}
	}
</script>