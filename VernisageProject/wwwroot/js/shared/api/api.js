/**
 * Api для асинхронного взаимодействия с сервером
 * @param {String} url Url аддрес куда будет отправляться ajax запрос
 * @param {String} method Тип запроса ['GET', 'POST', 'JSON', 'PUT']
 */
export default function Api(url, method) {
	var self = this;

	function execute(parameters, callback) {
		switch (self.method.toLowerCase()) {
			case 'get':
				$.get(self.url, parameters, callback);
				break;
			case 'post':
				$.post(self.url, parameters, callback);
				break;
			case 'json':
				$.getJSON(self.url, parameters, callback);
				break;
			case 'put':
				$.put(self.url, parameters, callback);
				break;
		}
	}

	self.url = url;
	self.method = method;

	return self;
}