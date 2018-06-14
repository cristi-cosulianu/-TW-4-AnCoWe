
const optionsController = require('./optionsController.js').optionsController;
const sessionController = require('./sessionController').sessionController;

function getKeyCodes(params, callback) {
  var sessionId = params['player'];
  
  if(sessionId === undefined) {
    callback(405, 'invalid parameters');
    return;
  }
  
  sessionController.getUserId(sessionId)
    .then(result => {
      if(result.length === 0) throw new Error("invalid sessionId");
      return optionsController.getAll(result[0].user_id);
    }).then(result => {
      callback(200, JSON.stringify(result));
    })
    .catch(err => {
      console.log(err);
      callback(405, err.message);
    });
}

function updateKeyCode(params, callback) {
  var sessionId = params['player'];
  var key = params['key'];
  var keyCode = params['code'];
  
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
    .then(result => {
      if(result.length === 0) throw new Error("invalid sessionId");
      return optionsController.update(result[0].user_id, column, keyCode);
    }).then(result => {
      callback(200, 'ok');
    })
    .catch(err => {
      console.log(err);
      callback(407, err.message);
    });
}

module.exports = {
  getKeyCodes,
  updateKeyCode
}