const db = require('./databaseQuery.js').databaseQuery;

class ScoreController {
    add(player, time, deaths) {
      var query = "INSERT INTO scores(user_id , time , deaths) VALUES (?, ?, ?);";
      var args = [player, time, deaths]; 
       
      return db.insert(query, args);
    }
    
    getScores() {
      var queryString = "Select * from scores ORDER BY time, deaths;";
      var args = [];
          
      return db.select(queryString, args);
    }
        
    getnScores(firstN) {
      var queryString = "Select * from scores ORDER BY time, deaths LIMIT ?;";
      var args = [firstN];
      
      return db.select(queryString, args);
    }
}

scoreController = new ScoreController();
module.exports = {
  scoreController
}


// use
//ScoreController.update('loghin', 99999999);
//console.log(scoreController.getScores());