const randomUuid = require('uuid/v4');

function getSessionId() {
	var uuid = randomUuid();
	return uuid;
}

module.exports = {
	getSessionId
}