sql = require('./sqlconnect.js');

class UserController {
    constructor() {
        this.conn = sql.conn;
    }
    
    exists(username) {
    	
    	return false;
    }
    
    validPassword(username, password) {
    	var queryString = "SELECT COUNT(*) AS nr FROM users WHERE username = '" + username + "' AND password = '" + password + "';";
      
      return new Promise((resolve, reject) => {
        this.conn.query(queryString, function (err, result, fields) {
          if(err) {
            return reject(err);
          }
          
          resolve(result[0].nr > 0);
        });
      });
    }
    
    add(username, password) {
    	
    }
    
    getId(username) {
    	return 'fwfwe';
    }
}

userController = new UserController();

module.exports = {
	userController
}