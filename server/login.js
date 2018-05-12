sql = require('./sqlconnect.js');

class LoginController {
    constructor() {
        this.conn = sql.conn;
    }
    
    static insert(id, username, password) {
        sql.conn.query("INSERT INTO Users (id, username, password) VALUES (" + id + ", '" + username + "', '" + password +"');");
        sql.conn.end();
    }
    

}
LoginController.insert(3,"loghin","parola");