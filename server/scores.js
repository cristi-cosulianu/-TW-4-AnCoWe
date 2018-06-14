const scoreController = require('./scoresController.js').scoreController;
const userController = require('./userController.js').userController;

function firstN(params, callback) {
  if(params['firstN'] == undefined) {
    callback(405, 'invalid parameters');
    return;
  }

  var firstN = parseInt(params['firstN']);
  
  if(isNaN(firstN)) {
    callback(405, 'invalid parameters');
    return;
  }

  var scoreList;

  scoreController.getnScores(firstN)
  .then(result => {
    scoreList = result;
    return userController.getAll();
  }).then(result => {
    scoreList.forEach(scoreListRow => {
      result.forEach(resultRow => {
        if(scoreListRow.user_id == resultRow.id) {
          scoreListRow.username = resultRow.username;
        }
      });
    });
    
    var json = JSON.stringify(scoreList);
    callback(200, json);
  })
  .catch(err => {
    console.log(err);
    callback(405, 'error ocured');
  });
}


module.exports = {
  firstN
}