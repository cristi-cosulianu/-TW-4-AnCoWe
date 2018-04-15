var dir;
var player;
var gravity;
var context;
var canvas;
var ground, pipe, wall, platform, spikes, crane, goomba;
var last_player = {
    x: -100,
    y: -100
};
var jump_sound, background_sound, jump_land;
var animation_stage = 0;
var first_press;
var oldplayer;
var hasDropDown = true;
var rendered = 0;
var maxLeftBound = 0;
var walk_1, walk_2, walk_3, walk_4;
var smoke_1, smoke_2, smoke_3, smoke_4;
var background_layer1, background_layer2, background_layer3, background_layer4, background_layer5, background_layer6, background_layer7;
var bounce = false;
var objects = [];
var backgroundX = 0;
var willColideTop = false;
var right = false,
    left = false,
    space = false;
var double_jump = 0;
var movementSpeed = 0;
var onPlatform = false;
var inAir = false;
var groundBase = 606;
var rightCollision = false,
    leftCollision = false,
    topCollision = false,
    bottomCollision = false;
var currentPlatformIndex = 0;
var defaultGroundX = 606;
const speed = 2;
var cameraSpeed = 0;
var xmlRequest = new XMLHttpRequest();
var data;

window.onload = () => {
    canvas = document.querySelector("#gameCanvas canvas");
    context = canvas.getContext("2d");
    document.addEventListener("keydown", keyPressed, false);
    document.addEventListener("keyup", keyReleased, false);
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    dir = new Vector2(1, 0);
    loadAudio();
    loadTextures();
    movementSpeed = speed;
    gravity = new Vector2(0, 0.31);
    player = new GameObject(null, canvas.width / 2 - 100, defaultGroundX, 64, 64);
    defaultGroundX = window.innerHeight - 64 - 40;
    groundBase = defaultGroundX;
    loadLevel();
    makeSynchronousRequest("http://localhost:3000/game?action=start&player=1&info=" + JSON.stringify(player) + "&info=" + JSON.stringify(objects) + "&info=" + JSON.stringify(defaultGroundX) + "&info=" + JSON.stringify(canvas.width) + "&info=" + JSON.stringify(canvas.height));
    this.requestAnimationFrame(game_loop);
};

window.onresize = () => {
    defaultGroundX = window.innerHeight - 64 - 40;
    groundBase = defaultGroundX;
    render();
};

function loadLevel() {
    objects.push(new GameObject(pipe, canvas.width / 2, canvas.height / 2 + 264, 64, 128));
    objects.push(new GameObject(spikes, canvas.width / 2 + 200, canvas.height / 2 + 180, 64, 64));
    objects.push(new GameObject(spikes, canvas.width / 2 + 264, canvas.height / 2 + 180, 64, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 328, canvas.height / 2 + 0, 64, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 392, canvas.height / 2 - 40, 64, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 456, canvas.height / 2 - 40, 128, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 584, canvas.height / 2 + 0, 64, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 648, canvas.height / 2 + 40, 64, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 712, canvas.height / 2 + 80, 64, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 1200, canvas.height / 2 + 128, 128, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 1232, canvas.height / 2 - 200, 64, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 1500, canvas.height / 2, 128, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 1628, canvas.height / 2, 128, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 1700, canvas.height / 2 - 160, 128, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 1828, canvas.height / 2 - 160, 128, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 1956, canvas.height / 2 - 160, 128, 64));

    objects.push(new GameObject(ground, canvas.width / 2 + 2200, canvas.height / 2 - 160, 128, 64));
    objects.push(new GameObject(platform, canvas.width / 2 + 2400, canvas.height / 2 - 160, 256, 32));
    objects.push(new GameObject(ground, canvas.width / 2 + 2756, canvas.height / 2, 64, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 3056, canvas.height / 2, 64, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 3056, canvas.height / 2 - 250, 64, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 3356, canvas.height / 2, 64, 64));
    objects.push(new GameObject(pipe, canvas.width / 2 + 3000, canvas.height / 2 + 264, 64, 128));
    objects.push(new GameObject(wall, canvas.width / 2 + 3600, canvas.height / 2, 64, 512));
    objects.push(new GameObject(wall, canvas.width / 2 + 3800, canvas.height / 8, 64, 512));
    objects.push(new GameObject(wall, canvas.width / 2 + 4000, 100, 64, 512));
    objects.push(new GameObject(platform, canvas.width / 2 + 4200, canvas.height / 2 + 150, 256, 32));
    objects.push(new GameObject(crane, canvas.width / 2 + 4800, canvas.height / 2 + 150, 32, 64));
    objects.push(new GameObject(crane, canvas.width / 2 + 4800, canvas.height / 2 + 90, 32, 64));
    objects.push(new GameObject(goomba, canvas.width / 2 + 4800, 680, 32, 32));
    objects.sort((a, b) => {
        if (a.position.x > b.position.x)
            return -1;
        if (a.position.x < b.position.x)
            return 1;
        return 0;
    });
}

function loadAudio() {
    jump_sound = new Audio();
    jump_land = new Audio();
    background_sound = new Audio();
    background_sound.src = "../sound/background_sound.mp3";
    background_sound.loop = true;
    background_sound.volume = 0.4;
    jump_sound.src = "../sound/jump_sound.mp3";
    jump_sound.volume = 0.1;
    jump_land.src = "../sound/jump_land.mp3";
    jump_land.volume = 0.1;

}

function loadTextures() {
    walk_1 = new Image();
    walk_2 = new Image();
    walk_3 = new Image();
    walk_4 = new Image();
    smoke_1 = new Image();
    smoke_2 = new Image();
    smoke_3 = new Image();
    smoke_4 = new Image();
    platform = new Image();
    goomba = new Image();
    spikes = new Image();
    wall = new Image();
    background_layer1 = new Image();
    background_layer2 = new Image();
    background_layer3 = new Image();
    background_layer4 = new Image();
    background_layer5 = new Image();
    background_layer6 = new Image();
    background_layer7 = new Image();
    crane = new Image();
    ground = new Image();
    pipe = new Image();
    ground.src = "../textures/ground.png";
    walk_1.src = "../textures/Hat_man/Walk/Hat_man1.png";
    walk_2.src = "../textures/Hat_man/Walk/Hat_man2.png";
    walk_3.src = "../textures/Hat_man/Walk/Hat_man3.png";
    walk_4.src = "../textures/Hat_man/Walk/Hat_man4.png";
    smoke_1.src = "../textures/Smoke/smoke_1.png";
    smoke_2.src = "../textures/Smoke/smoke_2.png";
    smoke_3.src = "../textures/Smoke/smoke_3.png";
    smoke_4.src = "../textures/Smoke/smoke_4.png";
    background_layer1.src = "../textures/background/sky.png";
    background_layer2.src = "../textures/background/mountains.png";
    background_layer3.src = "../textures/background/cloud_lonely.png";
    background_layer4.src = "../textures/background/clouds_BG.png";
    background_layer5.src = "../textures/background/clouds_MG_3.png";
    background_layer6.src = "../textures/background/clouds_MG_2.png";
    background_layer7.src = "../textures/background/clouds_MG_1.png";
    pipe.src = "../textures/pipe.png";
    wall.src = "../textures/wall.png";
    platform.src = "../textures/platform.png";
    spikes.src = "../textures/spikes.png";
    crane.src = "../textures/smallwall.png";
    goomba.src = "../textures/goomba.png";
}

function player_animation(p) {
    context.save();
    if (left) {
        context.translate(2 * player.position.x + player.width, 0);
        context.scale(-1, 1);
    }
    context.shadowOffsetX = -3;
    context.shadowOffsetY = 6;
    context.shadowColor = "black";
    context.shadowBlur = 10;
    if (p > 0 && !inAir) {
        if (p < 10) {
            context.drawImage(smoke_1, player.position.x - 30, player.position.y + player.height - 24);
        }
        if (p < 14) {
            context.drawImage(smoke_2, player.position.x - 30, player.position.y + player.height - 24);

        }
        if (p < 18) {
            context.drawImage(smoke_3, player.position.x - 30, player.position.y + player.height - 24);

        }
        if (p < 24) {
            context.drawImage(smoke_4, player.position.x - 30, player.position.y + player.height - 24);

        }
    }
    if (p % 21 < 6) {
        context.drawImage(walk_1, player.position.x, player.position.y, player.width, player.height);
        return;
    }
    if (p % 21 < 11) {
        context.drawImage(walk_2, player.position.x, player.position.y, player.width, player.height);

        return;
    }
    if (p % 21 < 16) {
        context.drawImage(walk_3, player.position.x, player.position.y, player.width, player.height);
        return;
    }
    if (p % 21 < 21) {
        context.drawImage(walk_4, player.position.x, player.position.y, player.width, player.height);
        return;
    }

}

function castRay(startPoint, direction, size) {
    for (let i = 0; i < size; ++i) {
        startPoint.position.add(direction);
        if (checkCollision(startPoint, false) && willColideTop) {
            dir.normalize();
        }
    }
}

function render() {
    //    if (backgroundX > canvas.width) {
    //        backgroundX %= canvas.width;
    //    }
    context.drawImage(background_layer1, backgroundX % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer1, canvas.width + backgroundX % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer2, backgroundX / 5 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer2, canvas.width + backgroundX / 5 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer3, backgroundX / 4 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer3, canvas.width + backgroundX / 4 % canvas.width, 0, canvas.width, canvas.height);
    //    context.drawImage(background_layer4, backgroundX % canvas.width, 0, canvas.width, canvas.height);
    //    context.drawImage(background_layer4, canvas.width + backgroundX % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer5, backgroundX / 2 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer5, canvas.width + backgroundX / 2 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer6, backgroundX / 1.5 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer6, canvas.width + backgroundX / 1.5 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer7, backgroundX % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer7, canvas.width + backgroundX % canvas.width, 0, canvas.width, canvas.height);
    for (let i = 0; i < canvas.width - backgroundX; i += 64) {
        context.drawImage(ground, i + backgroundX, defaultGroundX + 64, 64, 64);
    }
    drawObjects();
    player_animation(animation_stage);
    context.restore();

}

function drawObjects() {
    for (let i = 0; i < objects.length; ++i) {
        if (getRight(objects[i]) + backgroundX < 0) {
            //objects.pop();
            continue;
        }
        if (getLeft(objects[i]) + backgroundX > canvas.width) {
            continue;
        }
        context.drawImage(objects[i].type, objects[i].position.x + backgroundX, objects[i].position.y, objects[i].width, objects[i].height);
    }
}


function game_loop() {
    console.log(movementSpeed);
    data = makeSynchronousRequest("http://localhost:3000/game?action=get-data&player=1");
    if (isValidJson(data)) {
        data = JSON.parse(data);
        try {
            updateData(data);
        } catch (e) {
            console.log(data);
        }
    }
    //    if (backgroundX < maxLeftBound) {
    //        maxLeftBound = backgroundX;
    //    }
    render();
    //    if (objects.length > 0) {
    this.requestAnimationFrame(game_loop);
    //    } else {
    //        alert("I think you won");
    //
    //    }
}



function updateplayerposition() {

    //    if (dir.y > 8) {
    //        movementSpeed = 1;
    //    }

    //    if (inAir && dir.y > 0) {
    //        castRay(getGameObjectCopy(player), new Vector2(0, 1), 12);
    //    }
}



function keyPressed(event) {
    makeSynchronousRequest("http://localhost:3000/game?action=key-pressed&player=1&keycode=" + event.keyCode);

    if (event.keyCode === 39 && !leftCollision) {
        // right = true;
        if (first_press === false) {
            animation_stage = 5;
            first_press = true;
        }
        // background_sound.play();
    }
    if (event.keyCode === 32) {
        if (double_jump < 3) {
            jump_sound.load();
            jump_sound.play();
        }
        //space = true;
    }
    if (event.keyCode === 40 && inAir && hasDropDown) {
        dir.y = 12;
        dir.x = 0;
    }
}

function keyReleased(event) {
    makeSynchronousRequest("http://localhost:3000/game?action=key-released&player=1&keycode=" + event.keyCode);

}

function updateData(data) {
    right = data.right;
    left = data.left;
    space = data.space;
    animation_stage = data.animation_stage;
    gravity = data.gravity;
    dir = data.dir;
    player.position = data.player.position;
    inAir = data.inAir;
    movementSpeed = data.movementSpeed;
    double_jump = data.double_jump;
    onPlatform = data.onPlatform;
    defaultGroundX = data.defaultGroundX;
    groundBase = data.groundBase;
    onPlatform = data.onPlatform;
    currentPlatformIndex = data.currentPlatformIndex;
    cameraSpeed = data.cameraSpeed;
    backgroundX = data.backgroundX;
}

function makeSynchronousRequest(url) {
    xmlRequest.open("GET", url, false);
    xmlRequest.send();
    return xmlRequest.response;
}
