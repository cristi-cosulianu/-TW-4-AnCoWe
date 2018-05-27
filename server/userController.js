sql = require('./sqlconnect.js');

class UserController {
    constructor() {
        this.conn = sql.conn;
    }
    
    exists(username) {
    	return false;
    }
    
    validPassword(username, password) {
    	return true;
    }
    
    add(username, password) {
    	
    }
    
    getId(username) {
    	
    }
}

userController = new UserController();

module.exports = {
	userController
}