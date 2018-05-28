sql = require('./sqlconnect.js');

class ScoreController {
    constructor() {
        this.conn = sql.conn;
    }
    
    add(player,time,deaths) {
      var query = "INSERT INTO scores VALUES ('" + player + "', '" + time  + "', '" + deaths + "');"; 
       
      return new Promise((resolve, reject) => {
        this.conn.query(query, function (err, result) {
          if(err) {
            return reject(err);
          }
          
          // console.log(result);
          resolve(result);
        });
      });
    }
    
    
    getScores() {
      var query = "Select * from scores ORDER BY time desc;";
          
      return new Promise((resolve, reject) => {
        this.conn.query(query, function (err, result) {
          if(err) {
            return reject(err);
          }
          
          // console.log(result);
          resolve(result);
        });
      });
    }
        
    getnScores(callback,firstN) {
      var string = "Select top" + firstN +  "* from scores ORDER BY score time;";
      
      return new Promise((resolve, reject) => {
        this.conn.query(query, function (err, result) {
          if(err) {
            return reject(err);
          }
          
          // console.log(result);
          resolve(result);
        });
      });
    }
}

scooreController = new ScoreController();
module.exports = {
  ScoreController
}


// use
//ScoreController.update('loghin', 99999999);