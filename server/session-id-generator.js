const randomUuid = require('uuid/v4');

function getSessionId() {
	return randomUuid();
}

module.exports = {
	getSessionId
}