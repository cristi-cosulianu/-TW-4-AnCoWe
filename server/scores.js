const scoreController = require('./scoresController.js').scoreController;

module.exports ={
    processRequest: function(params, callback) {
    if(params['firstN'] == undefined){
      callback(405, 'invalid parameters');
      return;
    }

    var firstN = params['firstN'];

    scoreController.getnScores(firstN)
      .then(scores => {
          if(scores === undefined) return;
          
          var json = JSON.stringify(scores);
          callback(200,json);
      })
      .catch(err =>{
        conosle.log(err);
        callback(405, 'error ocured');
      });



  }
};