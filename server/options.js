const fs = require('fs');
const gameData = require('./gameData.js');

module.exports = {
	processRequest: function(params) {
		if(params['key'] === undefined || params['code'] === undefined) {
			return { code: 405, message: 'invalid parameters' };
        }
        
        console.log(params);
		
		switch(params['key']) {
			case 'leftKey':
				data.leftKeyCode = params['code']; break;
			case 'rightKey':
				data.leftKeyCode = params['code']; break;
			case 'downKey':
				data.leftKeyCode = params['code']; break;
			case 'jumpKey':
				data.leftKeyCode = params['code']; break;
			case 'dashKey':
				data.leftKeyCode = params['code']; break;
		}
		
		return { code: 200, message: 'ok' };
	}
};