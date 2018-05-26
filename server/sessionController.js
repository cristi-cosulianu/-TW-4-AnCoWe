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
    
    add(userId, sessionId) {
        var queryString = "INSERT INTO sessions VALUES ('" + userId + "', '" + sessionId + "');";
        
        this.conn.query(queryString, function(err, result) {
            if(err) {
                console.log(err);
            } else {
                // console.log(result.affectedRows);
            }
        });
    }
}

sessionController = new SessionController();

module.exports = {
    sessionController
}