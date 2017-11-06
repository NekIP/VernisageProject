import Api from '../../api/api.js';

export default {
	sendFile: new Api('file-manager/load', 'POST')
}