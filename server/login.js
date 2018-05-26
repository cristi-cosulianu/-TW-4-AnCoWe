
	/*
	*	EUGEN FILE 
 	*/

const sessionIdGenerator = require('./session-id-generator.js');

module.exports = {
	processRequest: function(params) {
		if(params['username'] === undefined || params['password'] === undefined) {
			return { code: 405, message: 'invalid parameters' };
    }
    
    var uuid = sessionIdGenerator.getSessionId();
		
		return { code: 200, message: uuid };
	}
};