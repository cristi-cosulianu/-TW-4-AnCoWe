const db = require('./databaseQuery.js').databaseQuery;

class OptionsController {
    create(userId) {
      var columns = "(user_id, left_key, right_key, down_key, jump_key, dash_key, music_volume, sound_volume)";
      var values = "(?, 37, 39, 40, 32, 16, 0.4, 0.1)";
      var queryString = "INSERT INTO options " + columns + " VALUES " + values + ";";
      var args = [userId];
      
      return db.insert(queryString, args);
    }
    
    update(userId, column, keyCode) {
      var queryString = "UPDATE options SET " + column + " = ? WHERE user_id = ?;";
      var args = [keyCode, userId];
      
      return db.update(queryString, args);
    }
    
    getAll(userId) {
      var queryString = "SELECT * FROM options WHERE user_id = ?;";
      var args = [userId];
      // console.log(queryString);
      
      return db.select(queryString, args);
    }
    
    // I don't think we need that, but don't delete it yet :)
    // getId(username) {
    //   var queryString = "SELECT id FROM users WHERE username = '" + username + "';";
      
    //   return new Promise((resolve, reject) => {
    //     this.conn.query(queryString, function (err, result, fields) {
    //       if(err) {
    //         return reject(err);
    //       }
          
    //       resolve(result[0].id);
    //     });
    //   });
    // }
}

optionsController = new OptionsController();

module.exports = {
  optionsController
}