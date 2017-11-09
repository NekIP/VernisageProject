import Api from '../../api/api.js';

export default {
	listFiles: new Api('file-manager/list', 'GET')
}