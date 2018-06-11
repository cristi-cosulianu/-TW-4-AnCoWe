sql = require('./sqlconnect.js');

class SessionController {
    constructor() {
        this.conn = sql.conn;
    }
    
    exists(sessionId) {
        var queryString = "SELECT COUNT(*) AS nr FROM sessions WHERE session_id = ?;";
        var args = [sessionId];
        
        this.conn.query(queryString, args, function (err, result, fields) {
            if(err) {
                console.log(err);
                return -1;
            }
            
            return (result[0].nr > 0);
        });
    }
    
    create(userId, sessionId) {
        var queryString = "INSERT INTO sessions (user_id, session_id) VALUES (?, ?);";
        var args = [userId, sessionId];
        
        return new Promise((resolve, reject) => {
            this.conn.query(queryString, args, function(err, result) {
                if(err) {
                    return reject(err);
                }
                
                resolve(true);
            });
        });
    }
    
    getUserId(sessionId) {
        var queryString = "SELECT user_id FROM sessions WHERE session_id = ?;";
        var args = [sessionId];
      
        return new Promise((resolve, reject) => {
            this.conn.query(queryString, args, function (err, result, fields) {
                if(err) {
                    return reject(err);
                }
                
                // console.log(result);
                  
                if(result.length > 0) {
                    resolve(result[0].user_id);
                } else {
                    resolve(undefined);
                }
            });
        });
    }
    
    delete(sessionId) {
        var queryString = "DELETE FROM sessions WHERE session_id = ?;";
        var args = [sessionId];
        
        return new Promise((resolve, reject) => {
            this.conn.query(queryString, args, function (err, result, fields) {
                if(err) {
                    return reject(err);
                }
                
                resolve(result);
            });
        });
    }
    
    deleteAll() {
        var queryString = "DELETE FROM sessions;";
        var args = [];
        
        return new Promise((resolve, reject) => {
            this.conn.query(queryString, args, function (err, result, fields) {
                if(err) {
                    return reject(err);
                }
                
                resolve(result);
            });
        });
    }
}

sessionController = new SessionController();

module.exports = {
    sessionController
}