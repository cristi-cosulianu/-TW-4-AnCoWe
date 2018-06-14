const scoreController = require('./scoresController.js').scoreController;


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

  scoreController.getnScores(firstN)
  .then(result => {
    var json = JSON.stringify(result);
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