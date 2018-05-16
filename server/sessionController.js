sql = require('./sqlconnect.js');


	/*
	*	Redenumeste fisierul asta in scoresController.js (#Eugen) 
 	*/


//console.log(sql.conn.query);
//sql.conn.query("Select * from scores;",function (err, result, fields) {
//    
//    console.log(JSON.stringify(result));
//    
//});
//console.log("after query");
class SessionController {
    constructor() {
        this.conn = sql.conn;
    }
    
    static exists(sessionId) {
        var queryString = "SELECT COUNT(*) AS nr FROM sessions WHERE session_id = '" + sessionId + "';";
        
        sql.conn.query(queryString, function (err, result, fields) {
            if(err) {
                console.log(err);
                return -1;
            }
            
            return (result[0].nr > 0);
        });
    }
    
    static add(userId, sessionId) {
        var queryString = "INSERT INTO sessions VALUES ('" + userId + "', '" + sessionId + "');";
        
        sql.conn.query(queryString, function(err, result) {
            if(err) {
                console.log("my err: " + err);
            } else {
                console.log(result.affectedRows);
            }
        });
    }
}

module.exports = {
    SessionController
}