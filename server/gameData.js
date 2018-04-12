const util = require('../scripts/util.js');
class gameData {
    constructor() {
        this.player = NaN;
        this.dir = new util.Vector2(1, 0);
        this.right = false;
        this.left = false;
        this.space = false;
        this.backgroundX = 0;
        this.leftCollision = false;
        this.rightCollision = false;
        this.topCollision = false;
        this.bottomCollision = false;
        this.bounce = false;
        this.inAir = false;
        this.willCollideTop = false;
        this.speed = 2;
        this.cameraSpeed = 0;
        this.onPlatform = false;
        this.gravity = new util.Vector2(0,0.31);
        this.defaultGroundX = 606;
        this.groundBase = 606;
        this.currentPlatformIndex = 0;
    }
}
module.exports = gameData;
