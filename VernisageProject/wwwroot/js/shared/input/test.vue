<template>
	<p>"{{test}}"</p>
</template>

<script>
	module.exports = {
		data: function() {
			return {
				test: 'Make app great again'
			};
		}
	};
</script>

<style>
	p {
		font-size: 20px;
		color: red;
	}
</style>