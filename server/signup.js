
	/*
	*	EUGEN FILE 
 	*/

const userController = require('./userController.js').userController;
const optionsController = require('./optionsController.js').optionsController;

module.exports = {
	processRequest: function(params, callback) {
		if(params['username'] === undefined || params['password'] === undefined) {
			callback(405, 'invalid parameters');
			return;
    }
    
    var username = params['username'];
    var password = params['password'];
    
		userController.create(username, password)
			.then(result => {
				return optionsController.create(result.insertId);
			})
			.then(result => {
				callback(200, 'ok');
			})
			.catch(err => {
				if(err.code == 'ER_DUP_ENTRY') {
					callback(405, 'username already exists');
				} else {
					console.log(err);
					callback(405, 'error');
				}
			});
	}
};