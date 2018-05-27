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
        // sql.conn.query(queryString,function (err, result, fields){
        //   if(err) {
        //     console.log(err);
        //     return -1;
        //   }



        //   return { code: 200, message: 'ok' };
        // });
        // sql.conn.end();
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
    //     sql.conn.query("Select * from scores ORDER BY time desc;",function (err, result, fields) {
    //         if(err){
    //               callback(err, "")
    //         }else{
    //               callback("", JSON.stringify(result))
    //         }
      
    // });
    }
        static getnScores(callback,firstN) {
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
        // sql.conn.query("Select top" + firstN +  "* from scores ORDER BY score time;",function (err,result, fields){
        //    if(err){
        //        callback(err, "")
        //    }else{
        //        callback("",JSON.stringify(result))
        //    } 
            
        // });
    }

}

scooreController = new ScoreController();
module.exports = {
  ScoreController
}


// use
//ScoreController.update('loghin', 99999999);