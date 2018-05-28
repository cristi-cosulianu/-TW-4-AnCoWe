
	/*
	*	EUGEN FILE 
 	*/

const sessionIdGenerator = require('./session-id-generator.js');
const userController = require('./userController.js').userController;
const sessionController = require('./sessionController').sessionController;
var md5 = require("blueimp-md5");
module.exports = {
	processRequest: function(params, callback) {
		if(params['username'] === undefined || params['password'] === undefined) {
			callback(405, 'invalid parameters');
			return;
    }
    
    var username = params['username'];
    var password = md5(params['password']);
    var validPassword, sessionId;
    
    userController.validPassword(username, password)
    	.then(valid => {
    		validPassword = valid;
    		return userController.getId(username);
    	})
    	.then(userId => {
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
    	.then(success => {
    		if(success === undefined) return;
    		
    		if(success == true) {
                // console.log('20000000');
		    	callback(200, sessionId);
		    } else {
		    	callback(405, 'database error');
		    }
    	})
    	.catch(err => {
    		console.log(err);
    		callback(405, 'error occured');
    	});
	}
};