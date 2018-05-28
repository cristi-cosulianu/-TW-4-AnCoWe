//Importing modules from previous scripts and the data model from `gameData`
const fs = require('fs');
const gameData = require('./gameData.js');
const util = require('../scripts/util.js');
const score = require('./scoresController.js').scoreController;
const sessions = require('./sessionController.js').sessionController;
var deathTime;
//Main Class that will handle socket events and data model manipulation
class GameController {
    //Setting up the data model for the server
    static start(player, info) {
        var data = new gameData();
        if (data.startTime === undefined) {
            let timer = new Date();
            data.startTime = timer.getTime();
            data.currentTime = data.startTime;
        }
        data.canvasWidth = JSON.parse(info[0]);
        data.canvasHeight = JSON.parse(info[1]);
        // Value at which the level was created initially scaling base out of that
        data.referenceScale = 750;
        data.player = new util.MovableGameObject(undefined, data.canvasWidth / 2 - 100, data.defaultGroundX, Math.floor(64 * data.canvasHeight / data.referenceScale), Math.floor(64 * data.canvasHeight / data.referenceScale));
        data.defaultGroundX = ((data.referenceScale - 50 - 64) * data.canvasHeight) / data.referenceScale;
        data.player.groundBase = data.defaultGroundX;
        data.objects = GameController.readLevel("1");
        data.objects.push(new util.GameObject("flag", 500, data.defaultGroundX - 64 - 32 - 78, 32, 256));
        //fs.writeFileSync('levels/1.txt', JSON.stringify(data.objects));
        util.scaleWorldObjects(data);
        data.gravity.y = util.getAspectRatio(data.gravity.y, data.referenceScale, data.canvasHeight, false);
        data.speed = util.getAspectRatio(data.speed, data.referenceScale, data.canvasHeight, false);
        this.writeData(data, player);
    };
    //KeyPressed controller 
    static keyPressed(player, keycode) {
        var data = this.readData(player);
        if (data === undefined) return {
            code: 404,
            message: 'file not found'
        };

        this.updateKeys(keycode, "pressed", data);
        this.writeData(data, player);
    }
    //KeyReleased controller
    static keyReleased(player, keycode) {
        var data = this.readData(player);
        if (data === undefined) return {
            code: 404,
            message: 'file not found'
        };

        this.updateKeys(keycode, "released", data);
        this.writeData(data, player);
    }
    //WindowResize event controller
    static resize(player, info) {
        var data = this.readData(player);
        if (data === undefined) return {
            code: 404,
            message: 'file not found'
        };
    }
    //Function for providing data to be displayed by the client
    static getData(player) {
        var data = this.readData(player);
        if (data === undefined) return {
            code: 404,
            message: 'file not found'
        };

        return JSON.stringify(data);
    };
    //DataUpdate controller
    static updateData(player) {
        var data = this.readData(player);
        if (data === undefined) return {
            code: 404,
            message: 'file not found'
        };
        try {
            var state = this.update(data, player);
            if (state === "finish") {
                return "finish";
            }
        } catch (e) {
            console.log(e);
        }
        this.writeData(data, player);
    }
    //Utilitary function for file reading , since data is stored in JSON format
    static readData(player) {
        try {
            return JSON.parse(fs.readFileSync('server/data/' + player + '.txt', 'utf8'));
        } catch (e) {
            console.log(e);
        }
    }
    //Utilitary function for file writing , since data is stored in JSON format
    static writeData(data, player) {
        try {
            fs.writeFileSync('server/data/' + player + '.txt', JSON.stringify(data));
        } catch (e) {
            console.log(e);
        }
    }

    static readLevel(level) {
        try {
            return JSON.parse(fs.readFileSync('levels/' + level + '.txt', 'utf8'));
        } catch (e) {
            console.log(e);
        }
    }
    //Utilitary function for key updates
    static updateKeys(keyCode, action, data) {
        if (action !== "pressed") {
            data.animation_stage = 0;
        }
        if (keyCode == data.leftKeyCode) {
            if (action === "pressed") {
                data.left = true;
            } else {
                data.left = false;
            }
        }
        if (keyCode == data.rightKeyCode) {
            if (action === "pressed") {
                data.right = true;
            } else {
                data.right = false;
            }
        }
        if (keyCode == data.jumpKeyCode) {
            if (action === "pressed") {
                data.space = true;
            } else {
                data.space = false;
            }
        }
    }
    //Server side game computation for player movement
    static updatePlayerPosition(data) {
        let player = data.player;
        player.position = new util.Vector2(data.player.position.x, data.player.position.y);
        let dir = new util.Vector2(data.player.dir.x, data.player.dir.y);
        let gravity = new util.Vector2(data.gravity.x, data.gravity.y);
        if (data.objects.length > 0) {
            if (player.position.y < data.player.groundBase || !data.player.onPlatform) {
                if (!data.isDead) {
                    data.player.groundBase = data.defaultGroundX;
                }
            }
            if (util.getRight(player) < util.getLeft(data.objects[data.player.currentPlatformIndex]) + data.backgroundX || util.getLeft(player) > util.getRight(data.objects[data.player.currentPlatformIndex]) + data.backgroundX) {
                data.player.onPlatform = false;
            }
        }
        if (player.position.y < data.player.groundBase) {
            data.animation_stage = 25;
            data.player.inAir = true;
            if (Math.abs(dir.y) < util.getAspectRatio(12, data.referenceScale, data.canvasHeight)) {
                dir.add(gravity);
            }
            player.position.add(dir);
            data.player.currentPlatformIndex = 0;
        }
        if (player.position.y >= data.player.groundBase) {
            dir.x = 0;
            dir.y = 0;
            gravity.x = 0;
            gravity.y = util.getAspectRatio(0.31, data.referenceScale, data.canvasHeight);
            player.position.y = data.player.groundBase;
            data.double_jump = 0;
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
        if (data.double_jump < 1 && Math.abs(dir.y) <= dir.y < 6) {
            if (data.space && data.left === false && data.right === false) {
                ++data.double_jump;
                dir.y = -1;
                dir.x = 0;
                dir.mul(util.getAspectRatio(7, data.referenceScale, data.canvasHeight, false));
                player.position.add(dir);
            }
            if (data.space && (data.left === true || data.right === true)) {
                ++data.double_jump;
                dir.y = -1;
                dir.x = 0;
                dir.mul(util.getAspectRatio(7, data.referenceScale, data.canvasHeight, false));
                player.position.add(dir);
            }
        }
        if (!data.right && !data.left) {
            dir.x = 0;
        }
        data.player.dir = dir;
        data.player.position = player.position;
    }
    //Server side game computation for enemy movement
    static updateEnemyPosition(data) {
        let enemySpeed = util.getAspectRatio(2, data.referenceScale, data.canvasHeight, false);
        for (let i = 0; i < data.objects.length; ++i) {
            if (data.objects[i].type === "goomba") {
                let previousValue = data.objects[i].position.x;
                data.objects[i].position.x += data.backgroundX;
                if (data.objects[i].position.y < data.objects[i].groundBase || !data.objects[i].onPlatform) {
                    data.objects[i].groundBase = data.defaultGroundX;
                }
                if (util.getRight(data.objects[i]) < util.getLeft(data.objects[data.objects[i].currentPlatformIndex]) + data.backgroundX || util.getLeft(data.objects[i]) > util.getRight(data.objects[data.objects[i].currentPlatformIndex]) + data.backgroundX) {
                    data.objects[i].onPlatform = false;
                }
                if (data.objects[i].position.y < data.objects[i].groundBase) {
                    data.objects[i].inAir = true;
                    data.objects[i].dir.x = 0;
                    if (Math.abs(data.objects[i].dir.y) < util.getAspectRatio(12, data.referenceScale, data.canvasHeight, false)) {
                        data.objects[i].dir.y += data.gravity.y;
                    }
                } else {
                    data.objects[i].dir.y = 0;
                }
                if (data.objects[i].position.y > data.objects[i].groundBase) {
                    data.objects[i].position.y = data.objects[i].groundBase;
                    data.objects[i].inAir = false;
                    data.objects[i].dir.x = -enemySpeed;
                }
                if (this.checkCollision(data, data.objects[i], "enemy").length) {
                    if (data.objects[i].rightCollision || data.objects[i].leftCollision) {
                        if (data.objects[i].dir.x > 0) {
                            data.objects[i].dir.x = -enemySpeed;
                        } else {
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
    //Collision checking for all `GameObject` contained in the level
    static checkCollision(data, object, takeAction) {
        let response = [];
        for (let i = 0; i < data.objects.length; ++i) {
            /*        if (util.getLeft(data.objects[i]) + data.backgroundX > data.canvasWidth) {
                       continue;
                    }*/
            if (takeAction === "enemy" && data.objects[i].hasOwnProperty("dir")) continue;

            if (util.getTop(object) + object.height * 6 / 10 < util.getTop(data.objects[i]) && util.getBottom(object) > util.getTop(data.objects[i]) && ((util.getRight(object) - 10 > util.getLeft(data.objects[i]) + data.backgroundX && util.getRight(object) < util.getRight(data.objects[i]) + data.backgroundX) || (util.getLeft(object) + 10 < util.getRight(data.objects[i]) + data.backgroundX && util.getLeft(object) > util.getLeft(data.objects[i]) + data.backgroundX))) {
                if (takeAction === "enemy") {
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
                    data.player.inAir = false;
                    data.player.topCollision = true;

                }
                response.push(data.objects[i]);
            }
            if (util.getBottom(object) > util.getBottom(data.objects[i]) && util.getTop(object) < util.getBottom(data.objects[i]) && util.getRight(object) > util.getLeft(data.objects[i]) + data.backgroundX + object.width * 1 / 4 && util.getLeft(object) < util.getRight(data.objects[i]) + data.backgroundX - object.width * 1 / 4) {
                if (takeAction === "enemy") {
                    object.bottomCollision = true;
                }
                if (takeAction === "player") {
                    data.player.dir.x = 0;
                    data.player.dir.y = 1;
                    data.double_jump = 1;
                    data.player.bottomCollision = true;
                }
                response.push(data.objects[i]);
            }
            if (util.getRight(object) > util.getLeft(data.objects[i]) + data.backgroundX && util.getRight(data.objects[i]) + data.backgroundX > util.getRight(object) && util.getTop(object) < util.getBottom(data.objects[i]) && util.getBottom(object) > util.getTop(data.objects[i]) + 5) {
                if (takeAction === "enemy") {
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
                response.push(data.objects[i]);
            }
            if (util.getLeft(object) < util.getRight(data.objects[i]) + data.backgroundX && util.getLeft(data.objects[i]) + data.backgroundX < util.getLeft(object) && util.getTop(object) < util.getBottom(data.objects[i]) && util.getBottom(object) > util.getTop(data.objects[i]) + 5) {
                if (takeAction === "enemy") {
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
                response.push(data.objects[i]);
            }
        }
        return response;
    }
    //Main update function for all the game data
    static update(data, player) {
        let timer = new Date();
        data.currentTime = timer.getTime();
        if (data.isDead) {
            if (data.currentTime - deathTime < 3000) {
                this.updatePlayerPosition(data);
                this.updateEnemyPosition(data);
            } else {
                this.resetLevel(data, "1");
            }
            return;
        }
        var collidingWith = this.checkCollision(data, data.player, "player");

        if (this.collisionAction(collidingWith, data , player) === "finish") return "finish";

        if (collidingWith.length) {
            data.cameraSpeed = 0;
            if (data.player.rightCollision && !data.bounce) {
                data.movementSpeed = 0;
                if (data.right) {
                    data.movementSpeed = data.speed;
                }
            } else if (data.player.leftCollision && !data.bounce) {
                data.movementSpeed = 0;
                if (data.left) {
                    data.movementSpeed = data.speed;
                }
            }
            if (data.bounce) {
                data.movementSpeed = data.speed;
            }
        } else {
            if (Math.abs(data.cameraSpeed + data.player.dir.x / 10) <= data.movementSpeed) {
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
        this.updatePlayerPosition(data);
        this.updateEnemyPosition(data);
        if (data.bounce) {
            this.inertia(data);
        }
        if (data.player.position.x + data.player.width < data.player.width) {
            data.player.position.x = 0;
        }
        if (data.player.position.x + data.player.width > data.canvasWidth / 2) {
            data.player.position.x = data.canvasWidth / 2 - data.player.width;
        }
        return "play";
    }
    static inertia(data) {
        if (data.player.leftCollision) {
            data.player.dir.x -= data.movementSpeed;
            data.player.dir.y = -util.getAspectRatio(7, data.referenceScale, data.canvasHeight, false);
        }
        if (data.player.rightCollision) {
            data.player.dir.x += data.movementSpeed;
            data.player.dir.y = -util.getAspectRatio(7, data.referenceScale, data.canvasHeight, false);
        }
        data.gravity.y = util.getAspectRatio(0.28, data.referenceScale, data.canvasHeight, false);
        data.bounce = false;
    }

    static resetLevel(data, level) {
        let tempData = fs.readFileSync("levels/" + level + ".txt", "UTF-8");
        if (isValidJson(tempData)) {
            data.objects = JSON.parse(tempData);
            data.player.position.x = data.canvasWidth / 2 - 100;
            data.player.position.y = data.defaultGroundX;
            data.player.groundBase = data.defaultGroundX;
            data.player.rightCollision = false;
            data.player.leftCollision = false;
            data.player.topCollision = false;
            data.player.bottomCollision = false;
            data.player.dir.x = 1;
            data.player.dir.y = 0;
            data.player.inAir = false;
            data.space = false;
            data.player.currentPlatformIndex = 0;
            data.player.onPlatform = false;
            data.backgroundX = 0;
            data.double_jump = 0;
            util.scaleWorldObjects(data);
            data.isDead = false;
            ++data.deaths;
        }
    }

    static collisionAction(collidingWith, data , player) {
        var actionType = "";
        for (let i = 0; i < collidingWith.length; ++i) {
            if (collidingWith[i].type === "goomba" || collidingWith[i].type === "spikes") {
                actionType = "death";

            }
            if (collidingWith[i].type === "flag") {
                actionType = "flag";
                break;
            }
        }
        switch (actionType) {
            case "death":
                {
                    data.isDead = true;
                    let timer = new Date();
                    deathTime = timer.getTime();
                    data.player.groundBase = Number.MAX_SAFE_INTEGER;
                    data.space = true;
                    data.player.inAir = true;
                    data.double_jump = 0;
                }
                break;
            case "flag":
                sessions.getUserId(player).then(userId =>{
                    if(userId != undefined){
                        score.add(userId , data.currentTime - data.startTime , data.deaths);
                    }
                })
                data.objects = undefined;
                return "finish";
                break;
        }
    }
}
//Exporting `processRequest` for `server.js` in order to procces `socket.io`events
module.exports = {
    processRequest: function (params) {
        if (params['action'] === undefined || params['player'] === undefined) {
            return {
                code: 405,
                message: 'invalid parameters'
            };
        }
        switch (params['action']) {
            case 'start':
                GameController.start(params['player'], params['info']);
                return 'start';
            case 'key-pressed':
                GameController.keyPressed(params['player'], params['keycode']);
                break;
            case 'key-released':
                GameController.keyReleased(params['player'], params['keycode']);
                break;
            case 'resize':
                GameController.resize(params['player'], params['info']);
                break;
            case 'get-data':
                return GameController.getData(params['player']);
            case 'update-data':
                return GameController.updateData(params['player']);
        }
    }
};
