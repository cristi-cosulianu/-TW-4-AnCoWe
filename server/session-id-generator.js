const randomUuid = require('uuid/v4');
const sessionController = require('./sessionController').sessionController;

function getSessionId() {
	// should return from the first iteration
	for(var i = 1; i <= 10; ++i) {
		var uuid = randomUuid();
		// console.log(i);
		
		if(!sessionController.exists(uuid)) {
			return uuid;
		}
	}
	
	return "";
}

module.exports = {
	getSessionId
}