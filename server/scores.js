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
class ScoreController {
    constructor() {
        this.conn = sql.conn;
    }
    
    static update(player, newScore) {
        sql.conn.query("UPDATE scores SET score = " + newScore + " WHERE username = '" + player + "';");
        sql.conn.end();
    }
    
    static getScores(callback) {
        sql.conn.query("Select * from scores;",function (err, result, fields) {
            if(err){
                  callback(err, "")
            }else{
                  callback("", JSON.stringify(result))
            }
      
    });
    }
}
ScoreController.getScores(function(err, result){
        console.log(JSON.stringify(result));
           
        });
// use
ScoreController.update('loghin', 99999999);