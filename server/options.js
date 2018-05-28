
	/*
	*	EUGEN FILE
 	*/

const optionsController = require('./optionsController.js').optionsController;
const sessionController = require('./sessionController').sessionController;

module.exports = {
	processRequest: function(params, callback) {
		if(params['key'] === undefined || params['code'] === undefined || params['player'] === undefined) {
			callback(405, 'invalid parameters');
			return;
    }
    
    var sessionId = params['player'];
    var keyCode = params['code'];
    var column;
    
    switch(params['key']) {
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
};