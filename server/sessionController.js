sql = require('./sqlconnect.js');

class SessionController {
    constructor() {
        this.conn = sql.conn;
    }
    
    exists(sessionId) {
        var queryString = "SELECT COUNT(*) AS nr FROM sessions WHERE session_id = '" + sessionId + "';";
        
        this.conn.query(queryString, function (err, result, fields) {
            if(err) {
                console.log(err);
                return -1;
            }
            
            return (result[0].nr > 0);
        });
    }
    
    create(userId, sessionId) {
        var queryString = "INSERT INTO sessions (user_id, session_id) VALUES ('" + userId + "', '" + sessionId + "');";
        
        return new Promise((resolve, reject) => {
            this.conn.query(queryString, function(err, result) {
                if(err) {
                    return reject(err);
                }
                
                resolve(true);
            });
        });
    }
    
    getUserId(sessionId) {
        var queryString = "SELECT user_id FROM sessions WHERE session_id = '" + sessionId + "';";
      
        return new Promise((resolve, reject) => {
            this.conn.query(queryString, function (err, result, fields) {
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
}

sessionController = new SessionController();

module.exports = {
    sessionController
}