const db = require('./databaseQuery.js').databaseQuery;

class SessionController {    
    create(userId, sessionId) {
        var queryString = "INSERT INTO sessions (user_id, session_id) VALUES (?, ?);";
        var args = [userId, sessionId];
        
        return db.insert(queryString, args);
    }
    
    getUserId(sessionId) {
        var queryString = "SELECT user_id FROM sessions WHERE session_id = ?;";
        var args = [sessionId];
      
        return db.select(queryString, args);
    }
    
    delete(sessionId) {
        var queryString = "DELETE FROM sessions WHERE session_id = ?;";
        var args = [sessionId];
        
        return db.delete(queryString, args);
    }
    
    deleteAll() {
        var queryString = "DELETE FROM sessions;";
        var args = [];
        
        return db.delete(queryString, args);
    }
}

sessionController = new SessionController();

module.exports = {
    sessionController
}