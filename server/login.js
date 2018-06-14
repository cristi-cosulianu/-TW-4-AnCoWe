const sessionIdGenerator = require('./session-id-generator.js');
const userController = require('./userController.js').userController;
const sessionController = require('./sessionController').sessionController;
const md5 = require("blueimp-md5");

function login(params, callback) {
	if(params['username'] === undefined || params['password'] === undefined) {
		callback(405, 'invalid parameters');
		return;
    }
    
    var username = params['username'];
    var password = md5(params['password']);
    var validPassword, sessionId;
    
    userController.validPassword(username, password)
	.then(result => {
		validPassword = (result[0].nr > 0);
		return userController.getId(username);
	})
	.then(result => {
        var userId = (result.length > 0 ? result[0].id : undefined);
        
		if(!validPassword) {
			callback(405, 'invalid username or password');
		} else {
			sessionId = sessionIdGenerator.getSessionId();
			
			  if(sessionId === "") {
		    	callback(405, 'could not generate session id');
		    } else {
		    	return sessionController.create(userId, sessionId);
		    }
		}
	})
	.then(result => {
    	callback(200, sessionId);
	})
	.catch(err => {
		console.log(err);
		callback(405, 'error occured');
	});
}

module.exports = {
    login
}