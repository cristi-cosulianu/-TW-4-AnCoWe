const fs = require('fs');
const gameData = require('./gameData.js');
const util = require('../scripts/util.js');

module.exports = {
	processRequest: function(params) {
		if(params['action'] === undefined || params['player'] === undefined) {
			return { code: 405, message: 'invalid parameters' };
		}
		
		switch(params['action']) {
			case 'start':
				return startGame(params['player'], params['info']);
				break;
			case 'key-pressed':
				return keyPressed(params['player'], params['keycode']);
				break;
			case 'key-released':
				return keyReleased(params['player'], params['keycode']);
				break;
			case 'resize':
				return resize(params['player'], params['info']);
				break;
			case 'get-data':
				return getData(params['player']);
				break;
		}
		
		return { code: 200, message: 'ok' };
	}
};

startGame = function(player, info) {
	// put start data here as JSON object
	// var data = queryParams['info'];
	data = new gameData();
    data.player = JSON.parse(info);
	fs.writeFile('server/data/' + player + '.txt', JSON.stringify(data), function (err) {
	  if (err) throw err;
	  //console.log('Saved!');
	});
	
	return { code: 200, message: 'startGame' };
};

keyPressed = function(player, keycode) {
	var data = JSON.parse(fs.readFileSync('server/data/' + player + '.txt'));
	// do stuff with data
    updateKeys(keycode , "pressed" ,data);
	fs.writeFile('server/data/' + player + '.txt', JSON.stringify(data), function (err) {
	  if (err) throw err;
	 // console.log('Saved!');
	});
	
	return { code: 200, message: 'key-pressed' };
}

keyReleased = function(player, keycode) {
	var data = JSON.parse(fs.readFileSync('server/data/' + player + '.txt'));
    updateKeys(keycode , "released" , data);
	fs.writeFile('server/data/' + player + '.txt', JSON.stringify(data), function (err) {
	  if (err) throw err;
	  //console.log('Saved!');
	});
	
	return { code: 200, message: 'key-released' };
}

resize = function(player, info) {
	var data = JSON.parse(fs.readFileSync('server/data/' + player + '.txt'));
	
	// do stuff with data
	
	fs.writeFile('server/data/' + player + '.txt', JSON.stringify(data), function (err) {
	  if (err) throw err;
	  //console.log('Saved!');
	});
	
	return { code: 200, message: 'resize' };
}

getData = function(player) {
	var data = fs.readFileSync('server/data/' + player + '.txt');
  
  return { code: 200, message: data };
};

updateKeys = function (keyCode, action , data) {
    if (keyCode == 37) {
        if(action === "pressed"){
            data.left = true;
        }
        else{
            data.left = false;
        }
    }
    if (keyCode == 39) {
        if(action === "pressed"){
            data.right = true;
        }
        else{
            data.right = false;
        }
    }
    if (keyCode == 32) {
        if(action === "pressed"){
            data.space = true;
        }
        else{
            data.space = false;
        }     
    }
}
