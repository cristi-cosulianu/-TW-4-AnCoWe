
	/*
	*	EUGEN FILE 
 	*/

const fs = require('fs');
const gameData = require('./gameData.js');
const util = require('../scripts/util.js');


module.exports = {
	processRequest: function(params) {
		if(params['key'] === undefined || params['code'] === undefined) {
			return { code: 405, message: 'invalid parameters' };
        }
        		
		var dataFile = fs.readFileSync('server/data/' + params['player'] + '.txt', 'utf8');
		if(util.isValidJson(dataFile)){
			var data = JSON.parse(dataFile);

			switch(params['key']) {
				case 'leftKey':
				data.leftKeyCode = params['code']; break;
				case 'rightKey':
				data.rightKeyCode = params['code']; break;
				case 'downKey':
				data.downKeyCode = params['code']; break;
				case 'jumpKey':
				data.jumpKeyCode = params['code']; break;
				case 'dashKey':
				data.dashKeyCode = params['code']; break;
			}

			fs.writeFileSync('server/data/' + params['player'] + '.txt', JSON.stringify(data), function (err) {
			if (err) throw err;
				//console.log('Saved!');
			});
		}
		
		return { code: 200, message: 'ok' };
	}
};