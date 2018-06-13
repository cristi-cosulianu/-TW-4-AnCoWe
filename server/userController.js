const db = require('./databaseQuery.js').databaseQuery;

class UserController {
    exists(username) {
    	return false;
    }
    
    validPassword(username, password) {
    	var queryString = "SELECT COUNT(*) AS nr FROM users WHERE username = ? AND password = ?;";
      var args = [username, password];
      
      return db.select(queryString, args);
    }
    
    create(username, password) {
    	var queryString = "INSERT INTO users (username, password) VALUES (?, ?);";
      var args = [username, password];
      
      return db.insert(queryString, args);
    }
    
    getId(username) {
    	var queryString = "SELECT id FROM users WHERE username = ?;";
      var args = [username];
      
      return db.select(queryString, args);
    }
}

userController = new UserController();

module.exports = {
	userController
}