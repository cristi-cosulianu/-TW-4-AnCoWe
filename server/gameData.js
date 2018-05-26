const util = require('../scripts/util.js');
class gameData {
    constructor() {
        this.player = NaN;
        //this.dir = new util.Vector2(1, 0);
        this.right = false;
        this.left = false;
        this.space = false;
        this.objects = [];
        this.backgroundX = 0;
        this.animation_stage = 0;
        this.bounce = false;
        this.speed = 2;
        this.cameraSpeed = 0;
        this.gravity = new util.Vector2(0, 0.31);
        this.defaultGroundX = 606;
        this.movementSpeed = 0;
        this.double_jump = 0;
        this.canvasWidth = 1280;
        this.canvasHeight = 720;
        this.powerUp = NaN;
        this.rightKeyCode = 39;
        this.leftKeyCode = 37;
        this.downKeyCode = 40;
        this.jumpKeyCode = 32;
        this.dashKeyCode = 16;
        this.deaths = 0;
        this.isDead  = false;
        this.levelFinished = false;
        this.startTime = undefined;
        this.currentTime = undefined;
        this.referenceScale = 0;
    }
}

module.exports = gameData;
