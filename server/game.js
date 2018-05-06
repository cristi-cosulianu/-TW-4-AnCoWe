const fs = require('fs');
const gameData = require('./gameData.js');
const util = require('../scripts/util.js');

module.exports = {
	processRequest: function(params) {
		if(params['action'] === undefined || params['player'] === undefined) {
			return { code: 405, message: 'invalid parameters' };
		}
        
        // console.log(params['player'] + ' ' + params['action']);
		
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
            case 'update-data':
                return updateData(params['player']);
		}
		
		return { code: 200, message: 'ok' };
	}
};

startGame = function(player, info) {
	// put start data here as JSON object
	// var data = queryParams['info'];
	data = new gameData();
    data.player = JSON.parse(info[0]);
    data.objects = JSON.parse(info[1]);
    data.defaultGroundX = JSON.parse(info[2]);
    data.canvasWidth = JSON.parse(info[3]);
    data.canvasHeight = JSON.parse(info[4]);
    data.player.groundBase = data.defaultGroundX;
	fs.writeFile('server/data/' + player + '.txt', JSON.stringify(data), function (err) {
	  if (err) throw err;
	  //console.log('Saved!');
	});
	
	return { code: 200, message: 'startGame' };
};

keyPressed = function(player, keycode) {
	var data = fs.readFileSync('server/data/' + player + '.txt' , 'utf8');
	// do stuff with data
    if(util.isValidJson(data)){
        data = JSON.parse(data);
        updateKeys(keycode , "pressed" ,data);
	    fs.writeFileSync('server/data/' + player + '.txt', JSON.stringify(data), function (err) {
        if (err) throw err;
	   });   
    }
	
	return { code: 200, message: 'key-pressed' };
}

keyReleased = function(player, keycode) {
	var data = fs.readFileSync('server/data/' + player + '.txt' , 'utf8');
    if(util.isValidJson(data)){
        data = JSON.parse(data);
        updateKeys(keycode , "released" , data);
        fs.writeFileSync('server/data/' + player + '.txt', JSON.stringify(data), function (err) {
        if (err) throw err;
        //console.log('Saved!');
	   });
    } 
	return { code: 200, message: 'key-released' };
}

resize = function(player, info) {
	var data = fs.readFileSync('server/data/' + player + '.txt' , 'utf8');
	if(util.isValidJson(data)){
	   // do stuff with data
    }
	return { code: 200, message: 'resize' };
}

getData = function(player) {
	var dataFile = fs.readFileSync('server/data/' + player + '.txt' , 'utf8');
    // if(!isValidJson(dataFile)) console.log("file: " + dataFile);
    return { code: 200, message: dataFile };
};

updateData = function(player){  
    var dataFile = fs.readFileSync('server/data/' + player + '.txt' , 'utf8');
    if(util.isValidJson(dataFile)){
        var data = JSON.parse(dataFile);
        try{
            update(data);
        }catch(e){
            console.log(e);
        }
        fs.writeFileSync('server/data/' + player + '.txt', JSON.stringify(data), function (err) {
        if (err) throw err;
	       //console.log('Saved!');
        });
    }
    return { code: 200, message: "Data updated" };
}

function updateKeys(keyCode, action , data) {
    if(action !== "pressed"){
        data.animation_stage = 0;
    }
    if (keyCode == data.leftKeyCode) {
        if(action === "pressed"){
            data.left = true;
        }
        else{
            data.left = false;
        }
    }
    if (keyCode == data.rightKeyCode) {
        if(action === "pressed"){
            data.right = true;
        }
        else{
            data.right = false;
        }
    }
    if (keyCode == data.jumpKeyCode) {
        if(action === "pressed"){
            data.space = true;
        }
        else{
            data.space = false;
        }     
    }
}

function updatePlayerPosition(data){
    let player  = data.player;
    player.position = new util.Vector2(data.player.position.x , data.player.position.y);
    let dir = new util.Vector2(data.player.dir.x , data.player.dir.y);
    let gravity = new util.Vector2(data.gravity.x , data.gravity.y);
    if (data.objects.length > 0) {
    if (player.position.y < data.player.groundBase || !data.player.onPlatform) {
            data.player.groundBase = data.defaultGroundX;
    }
    if (util.getRight(player) < util.getLeft(data.objects[data.player.currentPlatformIndex]) + data.backgroundX || util.getLeft(player) > util.getRight(data.objects[data.player.currentPlatformIndex]) + data.backgroundX) {
            data.player.onPlatform = false;
        }
    }
    if (player.position.y < data.player.groundBase) {
        data.animation_stage = 25;
        data.player.inAir = true;
        if (Math.abs(dir.y) < 12) {
            dir.add(gravity);
        }
        player.position.add(dir);
        data.player.currentPlatformIndex = 0;
    }
    if (player.position.y > data.player.groundBase) {
            dir.x = 0;
            dir.y = 0;
            gravity.x = 0;
            gravity.y = 0.31;
            player.position.y = data.player.groundBase;
            data.double_jump = 0;
            data.willColideTop = false;
            data.movementSpeed = data.speed;
            data.player.inAir = false;
    }
    if (data.right === true && data.left === false && dir.y < 12) {
        if (dir.x === 0 && !data.player.inAir) {
            dir.x = data.movementSpeed;
        }
        if (!data.player.inAir) {
            dir.x = Math.abs(dir.x);
        } else {
            if (dir.x < data.movementSpeed) {
                if (dir.x > 0 && dir.x + 0.5 < data.movementSpeed) {
                    dir.x += 0.5
                } else if (dir.x < data.movementSpeed) {
                    dir.x += 0.25;
                }
            }
        }
        ++data.animation_stage;
        player.position.add(dir);
    }
    if (data.left === true && data.right === false && dir.y < 12) {
        if (dir.x === 0 && !data.player.inAir) {
            dir.x = -data.movementSpeed;
        }
        if (!data.player.inAir) {
            dir.x = -Math.abs(dir.x);
        } else {
            if (dir.x > -data.movementSpeed) {
                if (dir.x < 0 && dir.x - 0.5 > -data.movementSpeed) {
                    dir.x -= 0.5;
                } else if (dir.x > -data.movementSpeed) {
                    dir.x -= 0.25;
                }
            }
        }
        ++data.animation_stage;
        player.position.add(dir);
    }
    if (data.double_jump < 1 && Math.abs(dir.y) <= 6) {
        if (data.space && data.left === false && data.right === false) {
            ++data.double_jump;
            dir.y = -1;
            dir.x = 0;
            dir.mul(7);
            player.position.add(dir);
        }
        if (data.space && (data.left === true || data.right === true)) {
            ++data.double_jump;
            dir.y = -1;
            dir.x = 0;
            dir.mul(7);
            player.position.add(dir);
        }
    }
    if(!data.right && !data.left){
        dir.x = 0;
    }
    data.player.dir = dir;
    data.player.position = player.position;
}

function updateEnemyPosition(data){
    let enemySpeed = 2;
    for(let i = 0; i < data.objects.length; ++i){
        if(data.objects[i].type === "goomba"){
                let previousValue = data.objects[i].position.x;
                data.objects[i].position.x += data.backgroundX;
                if (data.objects[i].position.y < data.objects[i].groundBase || !data.objects[i].onPlatform) {
                data.objects[i].groundBase = data.defaultGroundX;
                }
                if (util.getRight(data.objects[i]) < util.getLeft(data.objects[data.objects[i].currentPlatformIndex]) + data.backgroundX || util.getLeft(data.objects[i]) > util.getRight(data.objects[data.objects[i].currentPlatformIndex]) + data.backgroundX) {
                    data.objects[i].onPlatform = false;
                }
            //console.log(data.objects[i].position);

            if (data.objects[i].position.y < data.objects[i].groundBase) {
                data.objects[i].inAir = true;
                data.objects[i].dir.x = 0;
                if (Math.abs(data.objects[i].dir.y) < 12) {
                    data.objects[i].dir.y += data.gravity.y;
                }
            }
            else{
                data.objects[i].dir.y = 0;
            }
            if (data.objects[i].position.y > data.objects[i].groundBase) {
                    data.objects[i].position.y = data.objects[i].groundBase;
                    data.objects[i].inAir = false;
                    data.objects[i].dir.x = -enemySpeed;
            }
            if(checkCollision(data , data.objects[i] , "enemy")){
                if(data.objects[i].rightCollision || data.objects[i].leftCollision){    
                    if(data.objects[i].dir.x > 0){
                        data.objects[i].dir.x = -enemySpeed;
                    }
                    else{
                        data.objects[i].dir.x = enemySpeed;
                    }   
                }
            }
            data.objects[i].position.x = previousValue
            data.objects[i].position.x += data.objects[i].dir.x;
            data.objects[i].position.y += data.objects[i].dir.y;
        }
    }
    
}


function checkCollision(data , object, takeAction) {
    let response = false;
    for (let i = 0; i < data.objects.length; ++i) {
//        if (util.getLeft(data.objects[i]) + data.backgroundX > data.canvasWidth) {
//            continue;
//        }
        if(takeAction === "enemy" && data.objects[i].type === "goomba")
            continue;
        if (util.getTop(object) + object.height * 6 / 10 < util.getTop(data.objects[i]) && util.getBottom(object) > util.getTop(data.objects[i]) && ((util.getRight(object) - 10 > util.getLeft(data.objects[i]) + data.backgroundX && util.getRight(object) < util.getRight(data.objects[i]) + data.backgroundX) || (util.getLeft(object) + 10 < util.getRight(data.objects[i]) + data.backgroundX && util.getLeft(object) > util.getLeft(data.objects[i]) + data.backgroundX))) {
            if(takeAction === "enemy"){
                object.topCollision = true;
                object.groundBase = util.getTop(data.objects[i]) - object.height;
                object.onPlatform = true;
                object.inAir = false;
                object.currentPlatformIndex = i;
                object.dir.y = 0;
                
            }
            if (takeAction === "player") {
                data.player.groundBase = util.getTop(data.objects[i]) - object.height;
                data.player.onPlatform = true;
                data.player.currentPlatformIndex = i;
                //dir.y = 1;
                data.player.inAir = false;
                data.player.topCollision = true;

            } else {
                data.willColideTop = true;
            }
            response = true;
        }
        if (util.getBottom(object) > util.getBottom(data.objects[i]) && util.getTop(object) < util.getBottom(data.objects[i]) && util.getRight(object) > util.getLeft(data.objects[i]) + data.backgroundX + object.width * 1 / 4 && util.getLeft(object) < util.getRight(data.objects[i]) + data.backgroundX - object.width * 1 / 4) {
            if(takeAction === "enemy"){
                 object.bottomCollision = true;
            }
            if (takeAction === "player") {
                data.player.dir.x = 0;
                data.player.dir.y = 1;
                data.double_jump = 1;
                data.player.bottomCollision = true;
            }
            //console.log("bottom");
            response = true;
        }
        if (util.getRight(object) > util.getLeft(data.objects[i]) + data.backgroundX && util.getRight(data.objects[i]) + data.backgroundX > util.getRight(object) && util.getTop(object) < util.getBottom(data.objects[i]) && util.getBottom(object) > util.getTop(data.objects[i]) + 5) {
            if(takeAction === "enemy"){
                object.leftCollision = true;
            }
            if (takeAction === "player") {
                if (data.player.inAir && data.space && !data.player.bottomCollision && data.objects[i].type === "wall") {
                    data.double_jump = 0;
                    data.bounce = true;
                    data.player.dir.y = 0;
                } else {
                    data.player.dir.x = 0;
                }
                data.player.leftCollision = true;

            }
            response = true;
        }
        if (util.getLeft(object) < util.getRight(data.objects[i]) + data.backgroundX && util.getLeft(data.objects[i]) + data.backgroundX < util.getLeft(object) && util.getTop(object) < util.getBottom(data.objects[i]) && util.getBottom(object) > util.getTop(data.objects[i]) + 5) {
            if(takeAction === "enemy"){
                object.rightCollision = true;
            }
            if (takeAction === "player") {
                if (data.player.inAir && data.space && !data.player.bottomCollision && data.objects[i].type === "wall") {
                    data.double_jump = 0;
                    data.bounce = true;
                    data.player.dir.y = 0;
                } else {
                    data.player.dir.x = 0;
                }
                data.player.rightCollision = true;
            }
            response = true;
        }
    }
    return response;
}


function update(data){
    if (checkCollision(data , data.player, "player")) {
        data.cameraSpeed = 0;
        //player = oldplayer;
        if (data.player.rightCollision && !data.bounce) {
            //left = false
            data.movementSpeed = 0;
            if (data.right) {
                data.movementSpeed = data.speed;
            }
        } else if (data.player.leftCollision && !data.bounce) {
            //right = false;
            data.movementSpeed = 0;
            if (data.left) {
                data.movementSpeed = data.speed;
            }
        }
        if (data.bounce) {
            data.movementSpeed = data.speed;
        }
    } else {
        if (Math.abs(data.cameraSpeed + data.player.dir.x / 10) <= 2) {
            if (!data.right || !data.left)
                data.cameraSpeed += data.player.dir.x / 10;
        }
        if (data.backgroundX - data.cameraSpeed * 2.75 < 0 && (data.right || data.left)) {
            if (!data.right || !data.left)
                data.backgroundX -= data.cameraSpeed * 2.75;
        }
        data.player.rightCollision = false;
        data.player.leftCollision = false;
        data.player.topCollision = false;
        data.player.bottomCollision = false;
        data.movementSpeed = data.speed;
    }
    updatePlayerPosition(data);
    updateEnemyPosition(data);
    if(data.bounce){
        inertia(data);
    }
    if (data.player.position.x + data.player.width < data.player.width) {
        data.player.position.x = 0;
    }
    if (data.player.position.x + data.player.width > data.canvasWidth / 2) {
        data.player.position.x = data.canvasWidth / 2 - data.player.width;
    }
}

function inertia(data) {
    if (data.player.leftCollision) {
        data.player.dir.x -= data.movementSpeed;
        data.player.dir.y = -7;
    }
    if (data.player.rightCollision) {
        data.player.dir.x += data.movementSpeed;
        data.player.dir.y = -7;
    }
    data.gravity.y = 0.28;
    data.bounce = false;
}

   
