
  /*
  * EUGEN FILE
  */

const optionsController = require('./optionsController.js').optionsController;
const sessionController = require('./sessionController').sessionController;

module.exports = {
  processRequest: function(params, callback) {
    if(params['action'] === undefined) {
      callback(405, 'invalid parameters');
      return;
    }
    
    switch(params['action']) {
      case 'update':
        updateKeyCode(params['player'], params['key'], params['code'], callback);
        break;
      case 'get-all':
        getKeyCodes(params['player'], callback);
        break;
    }
  }
};

function getKeyCodes(sessionId, callback) {
  if(sessionId === undefined) {
    callback(405, 'invalid parameters');
    return;
  }
  
  sessionController.getUserId(sessionId)
    .then(userId => {
      if(userId === undefined) throw new Error("invalid sessionId");
      return optionsController.getAll(userId);
    }).then(result => {
      callback(200, JSON.stringify(result));
    })
    .catch(err => {
      console.log(err);
      callback(405, err.message);
    });
}

function updateKeyCode(sessionId, key, keyCode, callback) {
  if(sessionId === undefined || key === undefined || keyCode === undefined) {
    callback(405, 'invalid parameters');
    return;
  }
  
  var column;
  switch(key) {
      case 'leftKey':
        column = 'left_key'; break;
      case 'rightKey':
        column = 'right_key'; break;
      case 'downKey':
        column = 'down_key'; break;
      case 'jumpKey':
        column = 'jump_key'; break;
      case 'dashKey':
        column = 'dash_key'; break;
      case 'soundVolume':
        column = 'sound_volume'; break;
      case 'musicVolume':
        column = 'music_volume'; break;
      default:
        column = null; break;
    }
  
  if(column == null) {
    callback(405, 'invalid key');
    return;
  }
  
  sessionController.getUserId(sessionId)
    .then(userId => {
      if(userId === undefined) throw new Error("invalid sessionId");
      return optionsController.update(userId, column, keyCode);
    }).then(result => {
      callback(200, 'ok');
    })
    .catch(err => {
      console.log(err);
      callback(405, err.message);
    });
}