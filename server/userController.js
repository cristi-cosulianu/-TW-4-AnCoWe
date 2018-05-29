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
      // console.log(queryString);
      
      return new Promise((resolve, reject) => {
        this.conn.query(queryString, function (err, result, fields) {
          if(err) {
            return reject(err);
          }
          
          resolve(result[0].nr > 0);
        });
      });
    }
    
    create(username, password) {
    	var queryString = "INSERT INTO users (username, password) VALUES ('" + username + "', '" + password + "');";
      
      return new Promise((resolve, reject) => {
        this.conn.query(queryString, function (err, result) {
          if(err) {
            return reject(err);
          }
          
          // console.log(result);
          resolve(result);
        });
      });
    }
    
    getId(username) {
    	var queryString = "SELECT id FROM users WHERE username = '" + username + "';";
      
      return new Promise((resolve, reject) => {
        this.conn.query(queryString, function (err, result, fields) {
          if(err) {
            return reject(err);
          }
          
          if(result.length > 0) {
            resolve(result[0].id);
          } else {
            resolve(undefined);
          }
        });
      });
    }
}

userController = new UserController();

module.exports = {
	userController
}