
	/*
	*	EUGEN FILE 
 	*/

const sessionIdGenerator = require('./session-id-generator.js');
const userController = require('./userController.js').userController;
const sessionController = require('./sessionController').sessionController;

module.exports = {
	processRequest: function(params) {
		if(params['username'] === undefined || params['password'] === undefined) {
			return { code: 405, message: 'invalid parameters' };
    }
    
    var username = params['username'];
    var password = params['password'];
    
    if(!userController.validPassword(username, password)) {
    	return { code: 200, message: 'invalid username or password' };
    }
    
    var uuid = sessionIdGenerator.getSessionId();
    if(uuid === "") {
    	
    }
    
    // var userId = userController.getId(username);
    // sessionController.add(userId, uuid);
		
		return { code: 200, message: uuid };
	}
};