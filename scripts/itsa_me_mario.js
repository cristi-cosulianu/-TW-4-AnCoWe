var dir;
var player;
var context;
var canvas;
var ground, pipe, wall, platform, spikes, crane, goomba;
var last_player = {
    x: -100,
    y: -100
};
var jump_sound, background_sound, jump_land;
var animation_stage = 0;
var idle_animation_stage = 0;
var first_press;
var hasDropDown = true;
var rendered = 0;
var gp = null;
var maxLeftBound = 0;
var walk_1, walk_2, walk_3, walk_4;
var idle_1, idle_2, idle_3, idle_4;
var jump_1;
var smoke_1, smoke_2, smoke_3, smoke_4;
var background_layer1, background_layer2, background_layer3, background_layer4, background_layer5, background_layer6, background_layer7;
var bounce = false;
var objects = [];
var backgroundX = 0;
var willColideTop = false;
var left = false;
var right = false;
var inAir = false;
var rightKeyCode = 39;
var leftKeyCode = 37;
var downKeyCode = 40;
var jumpKeyCode = 32;
var dashKeyCode = 16;
var groundBase = 580;
var defaultGroundX = 580;
var double_jump;
var space;
var cameraSpeed = 0;
var data;
var referenceScale;
var uuid = undefined;
//Socket connection client side
var socket = io();
socket.on('data', function (msg) {
    if (isValidJson(msg))
        data = JSON.parse(msg);
});
//Function for acquiring token
socket.on('uuid', function (msg) {
    uuid = msg;
    makeSynchronousRequest("http://localhost:3000/game?action=start" + "&info=" + JSON.stringify(canvas.width) + "&info=" + JSON.stringify(canvas.height));
});
//Main client side loader for keys events and inital setup
window.onload = () => {
    canvas = document.querySelector("#gameCanvas canvas");
    context = canvas.getContext("2d");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    dir = new Vector2(1, 0);
    loadAudio();
    loadTextures();
    //loadLevel(); Only for creating new levels
    socket.emit('get-uuid', 'efbweyfu');
    document.getElementById("startGameButton").addEventListener("click", function (e) {
        document.addEventListener("keydown", keyPressed, false);
        document.addEventListener("keyup", keyReleased, false);
        // GamePad Controls

        window.addEventListener("gamepadconnected", function (e) {
            gp = navigator.getGamepads()[0];
            document.removeEventListener("keydown", keyPressed, false);
            document.removeEventListener("keyup", keyReleased, false);

        });
        window.addEventListener("gamepaddisconnected", function (e) {
            document.addEventListener("keydown", keyPressed, false);
            document.addEventListener("keyup", keyReleased, false);
            gp = null;
        });

        window.onresize = () => {
            defaultGroundX = window.innerHeight - 80 - 40;
            groundBase = defaultGroundX;
            render();
        };
        window.onblur = () => {
            makeSynchronousRequest("http://localhost:3000/game?action=key-released&keycode=" + leftKeyCode);
            makeSynchronousRequest("http://localhost:3000/game?action=key-released&keycode=" + rightKeyCode);
            makeSynchronousRequest("http://localhost:3000/game?action=key-released&keycode=" + jumpKeyCode);
        }

        requestAnimationFrame(game_loop);
    });
};
//Utilitary function used for screen rendering
function getObjectFromString(type) {
    switch (type) {
        case "spikes":
            return spikes;
            break;
        case "wall":
            return wall;
            break;
        case "goomba":
            return goomba;
            break;
        case "ground":
            return ground;
            break;
        case "pipe":
            return pipe;
            break;
        case "platform":
            return platform;
            break;
        case "crane":
            return crane;
            break;
    }
}
//Function for level loading , we will use a JSON file for this later
function loadLevel() {
    objects.push(new GameObject("pipe", canvas.width / 2, canvas.height / 2 + 264, 64, 128));
    objects.push(new GameObject("spikes", canvas.width / 2 + 200, canvas.height / 2 + 180, 64, 64));
    objects.push(new GameObject("spikes", canvas.width / 2 + 264, canvas.height / 2 + 180, 64, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 328, canvas.height / 2 + 0, 64, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 392, canvas.height / 2 - 40, 64, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 456, canvas.height / 2 - 40, 128, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 900, canvas.height / 2 + 200, 128, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 584, canvas.height / 2 + 0, 64, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 648, canvas.height / 2 + 40, 64, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 712, canvas.height / 2 + 80, 64, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 1200, canvas.height / 2 + 128, 128, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 1232, canvas.height / 2 - 200, 64, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 1500, canvas.height / 2, 128, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 1628, canvas.height / 2, 128, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 1700, canvas.height / 2 - 160, 128, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 1828, canvas.height / 2 - 160, 128, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 1956, canvas.height / 2 - 160, 128, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 2200, canvas.height / 2 - 160, 128, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 2756, canvas.height / 2, 64, 64));
    objects.push(new GameObject("spikes", canvas.width / 2 + 3056, canvas.height / 2, 64, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 3056, canvas.height / 2 - 250, 64, 64));
    objects.push(new GameObject("ground", canvas.width / 2 + 3356, canvas.height / 2, 64, 64));
    objects.push(new GameObject("pipe", canvas.width / 2 + 3000, canvas.height / 2 + 264, 64, 128));
    objects.push(new GameObject("wall", canvas.width / 2 + 3600, canvas.height / 2, 64, 512));
    objects.push(new GameObject("wall", canvas.width / 2 + 3800, canvas.height / 8, 64, 512));
    objects.push(new GameObject("wall", canvas.width / 2 + 4000, 100, 64, 512));
    objects.push(new GameObject("platform", canvas.width / 2 + 4200, canvas.height / 2 + 150, 256, 32));
    objects.push(new MovableGameObject("goomba", 2000, -5000, 64, 64));
    objects.push(new MovableGameObject("goomba", 2200, -5000, 64, 64));
    objects.push(new MovableGameObject("goomba", canvas.width / 2 + 4200, -5000, 64, 64));
    objects.push(new GameObject("pipe", canvas.width / 2 + 6000, canvas.height / 2 + 264, 64, 128));
    objects.push(new GameObject("wall", canvas.width / 2 + 7000, canvas.height / 2, 64, 512));
    objects.push(new GameObject("spikes", canvas.width / 2 + 3900, canvas.height / 2 + 180, 64, 64));
    objects.sort((a, b) => {
        if (a.position.x > b.position.x)
            return -1;
        if (a.position.x < b.position.x)
            return 1;
        return 0;
    });
}
//Audio loading
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
//Texture loading
function loadTextures() {
    walk_1 = new Image();
    walk_2 = new Image();
    walk_3 = new Image();
    walk_4 = new Image();
    idle_1 = new Image();
    idle_2 = new Image();
    idle_3 = new Image();
    idle_4 = new Image();
    jump_1 = new Image();
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
    idle_1.src = "../textures/Hat_man/Idle/Hat_man_idle1.png";
    idle_2.src = "../textures/Hat_man/Idle/Hat_man_idle2.png";
    idle_3.src = "../textures/Hat_man/Idle/Hat_man_idle3.png";
    idle_4.src = "../textures/Hat_man/Idle/Hat_man_idle4.png";
    jump_1.src = "../textures/Hat_man/Jump/Hat_man_jump1.png"
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
//Main animation function for the player
function player_animation(p) {
    let xoffset = getAspectRatio(30, referenceScale, window.innerHeight);
    let yoffset = getAspectRatio(24, referenceScale, window.innerHeight);
    let width = getAspectRatio(48, referenceScale, window.innerHeight);
    let height = getAspectRatio(24, referenceScale, window.innerHeight);
    context.save();
    context.shadowOffsetX = -3;
    context.shadowOffsetY = 3;
    context.shadowColor = "black";
    context.shadowBlur = 10;
    if (left) {
        context.translate(2 * player.position.x + player.width, 0);
        context.scale(-1, 1);
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 3;
        context.shadowColor = "black";
        context.shadowBlur = 10;
    }
    if (p > 0 && !inAir) {
        if (p < 10) {
            context.drawImage(smoke_1, player.position.x - xoffset, player.position.y + player.height - yoffset, width, height);
        }
        if (p < 14) {
            context.drawImage(smoke_2, player.position.x - xoffset, player.position.y + player.height - yoffset, width, height);

        }
        if (p < 18) {
            context.drawImage(smoke_3, player.position.x - xoffset, player.position.y + player.height - yoffset, width, height);

        }
        if (p < 24) {
            context.drawImage(smoke_4, player.position.x - xoffset, player.position.y + player.height - yoffset, width, height);
        }
    }
    if (!left && !right && !space && !inAir) {
        if (idle_animation_stage % 54 < 6) {
            context.drawImage(idle_1, player.position.x, player.position.y, player.width, player.height);
            ++idle_animation_stage;
            return;
        }
        if (idle_animation_stage % 54 < 22) {
            context.drawImage(idle_2, player.position.x, player.position.y, player.width, player.height);
            ++idle_animation_stage;
            return;
        }
        if (idle_animation_stage % 54 < 38) {
            context.drawImage(idle_3, player.position.x, player.position.y, player.width, player.height);
            ++idle_animation_stage;
            return;
        }
        if (idle_animation_stage % 54 < 54) {
            context.drawImage(idle_4, player.position.x, player.position.y, player.width, player.height);
            ++idle_animation_stage;
            return;
        }
    }
    idle_animation_stage = 0;
    if (inAir) {
        context.drawImage(jump_1, player.position.x, player.position.y, player.width, player.height);
        return;
    }
    if (p % 33 < 6) {
        context.drawImage(walk_1, player.position.x, player.position.y, player.width, player.height);
        return;
    }
    if (p % 33 < 15) {
        context.drawImage(walk_2, player.position.x, player.position.y, player.width, player.height);

        return;
    }
    if (p % 33 < 24) {
        context.drawImage(walk_3, player.position.x, player.position.y, player.width, player.height);
        return;
    }
    if (p % 33 < 33) {
        context.drawImage(walk_4, player.position.x, player.position.y, player.width, player.height);
        return;
    }

}
//Rendering function for all the objects in the game
function render() {
    /*    if (backgroundX > canvas.width) {
            backgroundX %= canvas.width;
        } */
    context.drawImage(background_layer1, backgroundX % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer1, canvas.width + backgroundX % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer2, backgroundX / 5 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer2, canvas.width + backgroundX / 5 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer3, backgroundX / 4 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer3, canvas.width + backgroundX / 4 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer5, backgroundX / 2 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer5, canvas.width + backgroundX / 2 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer6, backgroundX / 1.5 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer6, canvas.width + backgroundX / 1.5 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer7, backgroundX % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer7, canvas.width + backgroundX % canvas.width, 0, canvas.width, canvas.height);
    //Rendering Ground
    for (let i = 0; i < canvas.width - backgroundX; i += getAspectRatio(64, referenceScale, window.innerHeight, true)) {
        context.drawImage(ground, i + backgroundX, defaultGroundX + getAspectRatio(64, referenceScale, window.innerHeight, true), getAspectRatio(64, referenceScale, window.innerHeight, true), getAspectRatio(64, referenceScale, window.innerHeight, true));
    }
    //Rendering Deaths
    context.font = getAspectRatio(30, referenceScale, window.innerHeight) + "px Comic Sans MS";
    context.fillStyle = "dark";
    context.fillText("Deaths : " + data.deaths, getAspectRatio(20, referenceScale, window.innerHeight), getAspectRatio(40, referenceScale, window.innerHeight));
    context.fillText("Time : " + millisToMinutesAndSeconds(data.currentTime - data.startTime), getAspectRatio(20, referenceScale, window.innerHeight), getAspectRatio(80, referenceScale, window.innerHeight));
    drawObjects();
    player_animation(animation_stage);
    context.restore();
}
//Rendering objects used in `render` function
function drawObjects() {
    for (let i = 0; i < objects.length; ++i) {
        if (getRight(objects[i]) + backgroundX < 0) {
            //objects.pop();
            continue;
        }
        if (getLeft(objects[i]) + backgroundX > canvas.width) {
            continue;
        }
        try {
            context.drawImage(getObjectFromString(objects[i].type), objects[i].position.x + backgroundX, objects[i].position.y, objects[i].width, objects[i].height);
        } catch (e) {
            console.log("Object missing or undefined!");
        }
    }
}
//Main game loop
function game_loop() {
    //Updating data after receiving it from the server
    update();
    //Displaying the data with the `render` function
    if (player != undefined && objects != undefined) {
        render();
    }
    if (gp != null) {
        checkGamepad();
    }
    //Tell the server to prepare the next frame
    prepareNextFrame();
    this.requestAnimationFrame(game_loop);

}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


function prepareNextFrame() {
    makeSynchronousRequest("http://localhost:3000/game?action=update-data");
}

function update() {
    makeSynchronousRequest("http://localhost:3000/game?action=get-data");
    if (data === undefined) {
        console.log("NO DATA");
        return;
    }
    try {
        updateData(data);
    } catch (e) {
        console.log(e);
    }
}

//Controller Integration for Firefox
function checkGamepad() {
    try {
        var gp = navigator.getGamepads()[0];
        var axeLF = gp.axes[0];
        console.log(axeLF);
        if (axeLF < -0.5) {
            if (right) {
                makeSynchronousRequest("http://localhost:3000/game?action=key-released&keycode=" + rightKeyCode);
            }
            makeSynchronousRequest("http://localhost:3000/game?action=key-pressed&keycode=" + leftKeyCode);
        } else if (axeLF > 0.5) {
            if (left) {
                makeSynchronousRequest("http://localhost:3000/game?action=key-released&keycode=" + leftKeyCode);
            }
            makeSynchronousRequest("http://localhost:3000/game?action=key-pressed&keycode=" + rightKeyCode);
        } else {
            makeSynchronousRequest("http://localhost:3000/game?action=key-released&keycode=" + leftKeyCode);
            makeSynchronousRequest("http://localhost:3000/game?action=key-released&keycode=" + rightKeyCode);
        }
        if (gp.buttons[0].pressed) {
            makeSynchronousRequest("http://localhost:3000/game?action=key-pressed&keycode=" + jumpKeyCode);
        } else if (space) {
            makeSynchronousRequest("http://localhost:3000/game?action=key-released&keycode=" + jumpKeyCode);
        }
    } catch (e) {
        console.log("GamePadRemoved");
    }
}
//Utilitary event function that sends key pressed data
function keyPressed(event) {
    makeSynchronousRequest("http://localhost:3000/game?action=key-pressed&keycode=" + event.keyCode);
    if (event.keyCode === rightKeyCode) {
        if (first_press === false) {
            animation_stage = 5;
            first_press = true;
        }
        //background_sound.play();
    }
    if (event.keyCode === jumpKeyCode) {
        jump_sound.current_time = 0;
        jump_sound.play();
    }
    if (event.keyCode === downKeyCode && inAir && hasDropDown) {
        dir.y = 12;
        dir.x = 0;
    }
}
//Utilitary event function that sends key released data
function keyReleased(event) {
    makeSynchronousRequest("http://localhost:3000/game?action=key-released&keycode=" + event.keyCode);
}
//Function for data update received from the server
function updateData(data) {
    right = data.right;
    left = data.left;
    space = data.space;
    animation_stage = data.animation_stage;
    player = data.player;
    player.position = data.player.position;
    inAir = data.player.inAir;
    double_jump = data.double_jump;
    defaultGroundX = data.defaultGroundX;
    groundBase = data.player.groundBase;
    cameraSpeed = data.cameraSpeed;
    backgroundX = data.backgroundX;
    objects = data.objects;
    referenceScale = data.referenceScale;
    deaths = data.deaths;
}
//Utilitary function for server requests
function makeSynchronousRequest(url) {
    if (uuid === undefined) {
        console.log("uuid undefined");
        return;
    }
    socket.emit('game', url + "&player=" + uuid);
}
