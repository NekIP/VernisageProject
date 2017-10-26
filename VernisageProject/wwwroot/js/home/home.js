(function () {
	alert("script");
	let v = new Vue({ el: '#vueApp', data: { hello: 'Hello world' } });
	console.log(v);
})();

$(function () {
	alert("jquery");
});
