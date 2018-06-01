sql = require('./sqlconnect.js');

class ScoreController {
    constructor() {
        this.conn = sql.conn;
    }
    
    add(player, time, deaths) {
      var query = "INSERT INTO scores(user_id , time , deaths) VALUES (?, ?, ?);";
      var args = [player, time, deaths]; 
       
      return new Promise((resolve, reject) => {
        this.conn.query(query, args, function (err, result) {
          if(err) {
            return reject(err);
          }
          
          // console.log(result);
          resolve(result);
        });
      });
    }
    
    
    getScores() {
      var queryString = "Select * from scores ORDER BY time desc;";
          
      return new Promise((resolve, reject) => {
        this.conn.query(queryString, function (err, result, fields) {
          if(err) {
            return reject(err);
          }
          if(result.length > 0) {
            console.log(result);
            resolve(result);
          } else {
            resolve(undefined);
          }
        });
      });
    }
        
    getnScores(firstN) {
      var queryString = "Select * from scores ORDER BY time desc LIMIT ?;";
      var args = [firstN];
      
      return new Promise((resolve, reject) => {
        this.conn.query(queryString, args, function (err, result, fields) {
          if(err) {
            return reject(err);
          }
            if(result.length > 0) {
                console.log(result);
            resolve(result);
          } else {
            resolve(undefined);
          }
        });
      });
    }
}

scoreController = new ScoreController();
module.exports = {
  scoreController
}


// use
//ScoreController.update('loghin', 99999999);
//console.log(scoreController.getScores());