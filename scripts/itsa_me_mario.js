var context;
var canvas;
var ground, pipe, wall, platform, spikes, crane, goomba;
var jump_sound, background_sound, jump_land, death_sound;
var first_press;
var gp = null;
var walk_1, walk_2, walk_3, walk_4;
var idle_1, idle_2, idle_3, idle_4;
var death_1;
var idle_animation_stage;
var level_done, level_done_sound;
var jump_1;
var smoke_1, smoke_2, smoke_3, smoke_4;
var smoke_landing_1, smoke_landing_2, smoke_landing_3, smoke_landing_4;
var background_layer1, background_layer2, background_layer3, background_layer4, background_layer5, background_layer6, background_layer7;
var flag;
var data;
var wasInAir = false,
    landAnimation,
    landAnimationStart;
var isPlaying = true;
var uuid = undefined;
var keyCodes = {
    leftKeyCode: 37,
    rightKeyCode: 39,
    jumpKeyCode: 32,
    downKeyCode: undefined,
    dashKeyCode: undefined
};

//Socket connection client side
var socket = io();
socket.on('data', function (msg) {
    if (isValidJson(msg))
        data = JSON.parse(msg);
});
socket.on('finish', function (msg) {
    isPlaying = false;
});
socket.on('start', function (msg) {
    requestAnimationFrame(game_loop);
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
        case "flag":
            return flag;
            break;
    }
}
//Function for level loading , we will use a JSON file for this later
function loadLevel() {
    data.objects.push(new GameObject("pipe", canvas.width / 2, canvas.height / 2 + 264, 64, 128));
    data.objects.push(new GameObject("spikes", canvas.width / 2 + 200, canvas.height / 2 + 180, 64, 64));
    data.objects.push(new GameObject("spikes", canvas.width / 2 + 264, canvas.height / 2 + 180, 64, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 328, canvas.height / 2 + 0, 64, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 392, canvas.height / 2 - 40, 64, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 456, canvas.height / 2 - 40, 128, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 900, canvas.height / 2 + 200, 128, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 584, canvas.height / 2 + 0, 64, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 648, canvas.height / 2 + 40, 64, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 712, canvas.height / 2 + 80, 64, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 1200, canvas.height / 2 + 128, 128, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 1232, canvas.height / 2 - 200, 64, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 1500, canvas.height / 2, 128, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 1628, canvas.height / 2, 128, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 1700, canvas.height / 2 - 160, 128, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 1828, canvas.height / 2 - 160, 128, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 1956, canvas.height / 2 - 160, 128, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 2200, canvas.height / 2 - 160, 128, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 2756, canvas.height / 2, 64, 64));
    data.objects.push(new GameObject("spikes", canvas.width / 2 + 3056, canvas.height / 2, 64, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 3056, canvas.height / 2 - 250, 64, 64));
    data.objects.push(new GameObject("ground", canvas.width / 2 + 3356, canvas.height / 2, 64, 64));
    data.objects.push(new GameObject("pipe", canvas.width / 2 + 3000, canvas.height / 2 + 264, 64, 128));
    data.objects.push(new GameObject("wall", canvas.width / 2 + 3600, canvas.height / 2, 64, 512));
    data.objects.push(new GameObject("wall", canvas.width / 2 + 3800, canvas.height / 8, 64, 512));
    data.objects.push(new GameObject("wall", canvas.width / 2 + 4000, 100, 64, 512));
    data.objects.push(new GameObject("platform", canvas.width / 2 + 4200, canvas.height / 2 + 150, 256, 32));
    data.objects.push(new MovableGameObject("goomba", 2000, -5000, 64, 64));
    data.objects.push(new MovableGameObject("goomba", 2200, -5000, 64, 64));
    data.objects.push(new MovableGameObject("goomba", canvas.width / 2 + 4200, -5000, 64, 64));
    data.objects.push(new GameObject("pipe", canvas.width / 2 + 6000, canvas.height / 2 + 264, 64, 128));
    data.objects.push(new GameObject("wall", canvas.width / 2 + 7000, canvas.height / 2, 64, 512));
    data.objects.push(new GameObject("spikes", canvas.width / 2 + 3900, canvas.height / 2 + 180, 64, 64));
    data.objects.sort((a, b) => {
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
    level_done_sound = new Audio();
    jump_land = new Audio();
    death_sound = new Audio();
    background_sound = new Audio();
    background_sound.src = "../sound/background_sound.mp3";
    background_sound.loop = true;
    background_sound.volume = 0.4;
    jump_sound.src = "../sound/jump_sound.mp3";
    jump_sound.volume = 0.1;
    jump_land.src = "../sound/jump_land.mp3";
    jump_land.volume = 0.1;
    level_done_sound.src = "../sound/level_win.mp3";
    death_sound.src = "../sound/death.mp3";
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
    level_done = new Image();
    jump_1 = new Image();
    death_1 = new Image();
    smoke_1 = new Image();
    smoke_2 = new Image();
    smoke_3 = new Image();
    smoke_4 = new Image();
    landing_smoke_1 = new Image();
    landing_smoke_2 = new Image();
    landing_smoke_3 = new Image();
    landing_smoke_4 = new Image();
    platform = new Image();
    flag = new Image();
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
    death_1.src = "../textures/Hat_man/Death/Hat_man_death1.png";
    smoke_1.src = "../textures/Smoke/smoke_1.png";
    smoke_2.src = "../textures/Smoke/smoke_2.png";
    smoke_3.src = "../textures/Smoke/smoke_3.png";
    smoke_4.src = "../textures/Smoke/smoke_4.png";
    landing_smoke_1.src = "../textures/LandingSmoke/landing_1.png";
    landing_smoke_2.src = "../textures/LandingSmoke/landing_2.png";
    landing_smoke_3.src = "../textures/LandingSmoke/landing_3.png";
    landing_smoke_4.src = "../textures/LandingSmoke/landing_4.png";
    background_layer1.src = "../textures/background/sky.png";
    background_layer2.src = "../textures/background/mountains.png";
    background_layer3.src = "../textures/background/cloud_lonely.png";
    background_layer4.src = "../textures/background/clouds_BG.png";
    background_layer5.src = "../textures/background/clouds_MG_3.png";
    background_layer6.src = "../textures/background/clouds_MG_2.png";
    background_layer7.src = "../textures/background/clouds_MG_1.png";
    flag.src = "../textures/flag.png";
    pipe.src = "../textures/pipe.png";
    wall.src = "../textures/wall.png";
    level_done.src = "../textures/level_done_popup.png";
    platform.src = "../textures/platform.png";
    spikes.src = "../textures/spikes.png";
    crane.src = "../textures/smallwall.png";
    goomba.src = "../textures/goomba.png";
}
//Main animation function for the player
function playerAnimation(p) {
    let xoffset = getAspectRatio(30, data.referenceScale, window.innerHeight);
    let yoffset = getAspectRatio(24, data.referenceScale, window.innerHeight);
    let width = getAspectRatio(48, data.referenceScale, window.innerHeight);
    let height = getAspectRatio(24, data.referenceScale, window.innerHeight);
    context.save();
    context.shadowOffsetX = -3;
    context.shadowOffsetY = 3;
    context.shadowColor = "black";
    context.shadowBlur = 10;
    if (data.left) {
        context.translate(2 * data.player.position.x + data.player.width, 0);
        context.scale(-1, 1);
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 3;
        context.shadowColor = "black";
        context.shadowBlur = 10;
    }
    if (data.player.isDead) {
        context.drawImage(death_1, data.player.position.x, data.player.position.y, data.player.width, data.player.height);
        death_sound.play();
        background_sound.pause();
        background_sound.currentTime = 0;
        return;
    }
    if (p > 0 && !data.player.inAir) {
        if (p < 10) {
            context.drawImage(smoke_1, data.player.position.x - xoffset, data.player.position.y + data.player.height - yoffset, width, height);
        }
        if (p < 14) {
            context.drawImage(smoke_2, data.player.position.x - xoffset, data.player.position.y + data.player.height - yoffset, width, height);

        }
        if (p < 18) {
            context.drawImage(smoke_3, data.player.position.x - xoffset, data.player.position.y + data.player.height - yoffset, width, height);

        }
        if (p < 24) {
            context.drawImage(smoke_4, data.player.position.x - xoffset, data.player.position.y + data.player.height - yoffset, width, height);
        }
    }
    if (!data.left && !data.right && !data.space && !data.player.inAir) {
        if (idle_animation_stage % 54 < 6) {
            context.drawImage(idle_1, data.player.position.x, data.player.position.y, data.player.width, data.player.height);
            ++idle_animation_stage;
            return;
        }
        if (idle_animation_stage % 54 < 22) {
            context.drawImage(idle_2, data.player.position.x, data.player.position.y, data.player.width, data.player.height);
            ++idle_animation_stage;
            return;
        }
        if (idle_animation_stage % 54 < 38) {
            context.drawImage(idle_3, data.player.position.x, data.player.position.y, data.player.width, data.player.height);
            ++idle_animation_stage;
            return;
        }
        if (idle_animation_stage % 54 < 54) {
            context.drawImage(idle_4, data.player.position.x, data.player.position.y, data.player.width, data.player.height);
            ++idle_animation_stage;
            return;
        }
    }
    idle_animation_stage = 0;
    if (data.player.inAir) {
        context.drawImage(jump_1, data.player.position.x, data.player.position.y, data.player.width, data.player.height);
        wasInAir = true;
        return;
    }

    if (p % 33 < 6) {
        context.drawImage(walk_1, data.player.position.x, data.player.position.y, data.player.width, data.player.height);
        return;
    }
    if (p % 33 < 15) {
        context.drawImage(walk_2, data.player.position.x, data.player.position.y, data.player.width, data.player.height);
        return;
    }
    if (p % 33 < 24) {
        context.drawImage(walk_3, data.player.position.x, data.player.position.y, data.player.width, data.player.height);
        return;
    }
    if (p % 33 < 33) {
        context.drawImage(walk_4, data.player.position.x, data.player.position.y, data.player.width, data.player.height);
        return;
    }

}
//Rendering function for all the data.objects in the game
function render() {
    /*    if (data.backgroundX > canvas.width) {
            data.backgroundX %= canvas.width;
        } */
    context.drawImage(background_layer1, data.backgroundX % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer1, canvas.width + data.backgroundX % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer2, data.backgroundX / 5 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer2, canvas.width + data.backgroundX / 5 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer3, data.backgroundX / 4 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer3, canvas.width + data.backgroundX / 4 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer5, data.backgroundX / 2 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer5, canvas.width + data.backgroundX / 2 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer6, data.backgroundX / 1.5 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer6, canvas.width + data.backgroundX / 1.5 % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer7, data.backgroundX % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background_layer7, canvas.width + data.backgroundX % canvas.width, 0, canvas.width, canvas.height);
    //Rendering Ground
    for (let i = 0; i < canvas.width - data.backgroundX; i += getAspectRatio(64, data.referenceScale, window.innerHeight, true)) {
        context.drawImage(ground, i + data.backgroundX, data.defaultGroundX + getAspectRatio(64, data.referenceScale, window.innerHeight, true), getAspectRatio(64, data.referenceScale, window.innerHeight, true), getAspectRatio(64, data.referenceScale, window.innerHeight, true));
    }
    //Rendering data.deaths
    context.font = getAspectRatio(30, data.referenceScale, window.innerHeight) + "px Comic Sans MS";
    context.fillStyle = "dark";
    context.fillText("Deaths : " + data.deaths, getAspectRatio(20, data.referenceScale, window.innerHeight), getAspectRatio(40, data.referenceScale, window.innerHeight));
    context.fillText("Time : " + millisToMinutesAndSeconds(data.currentTime - data.startTime), getAspectRatio(20, data.referenceScale, window.innerHeight), getAspectRatio(80, data.referenceScale, window.innerHeight));
    drawObjects();
    playerAnimation(data.animation_stage);
    context.restore();
}
//Rendering data.objects used in `render` function
function drawObjects() {
    for (let i = 0; i < data.objects.length; ++i) {
        if (getRight(data.objects[i]) + data.backgroundX < 0) {
            //data.objects.pop();
            continue;
        }
        if (getLeft(data.objects[i]) + data.backgroundX > canvas.width) {
            continue;
        }
        try {
            context.drawImage(getObjectFromString(data.objects[i].type), data.objects[i].position.x + data.backgroundX, data.objects[i].position.y, data.objects[i].width, data.objects[i].height);
        } catch (e) {
            console.log("Object missing or undefined!");
        }
    }
}
//Main game loop
function game_loop() {
    //Updating data after receiving it from the server
    updateAndRender();
    //Displaying the data with the `render` function
    if (!isPlaying) {
        isPlaying = true;
        background_sound.pause();
        level_done_sound.play();
        context.save();
        context.filter = 'blur(5px)';
        render();
        context.restore();
        context.drawImage(level_done, canvas.width / 2 - 200, canvas.height / 2);
        setTimeout(function () {
            sceneTransition('gameCanvas', 'menuCanvas');
        }, 4000);
        return;
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


function animate() {
    let xoffset = getAspectRatio(20, data.referenceScale, window.innerHeight);
    let yoffset = getAspectRatio(25, data.referenceScale, window.innerHeight);
    let width = getAspectRatio(100, data.referenceScale, window.innerHeight);
    let height = getAspectRatio(38, data.referenceScale, window.innerHeight);
    if (!data.player.inAir && wasInAir) {
        landAnimation = true;
    }
    if (landAnimation) {
        if (landAnimationStart === undefined) {
            let timer = new Date();
            landAnimationStart = timer.getTime();
        }
        context.save();
        context.shadowOffsetX = -3;
        context.shadowOffsetY = 3;
        context.shadowColor = "black";
        context.shadowBlur = 10;
        if (data.left) {
            context.translate(2 * data.player.position.x + data.player.width, 0);
            context.scale(-1, 1);
            context.shadowOffsetX = 3;
            context.shadowOffsetY = 3;
            context.shadowColor = "black";
            context.shadowBlur = 10;
        }
        if (data.currentTime - landAnimationStart < 75) {
            context.drawImage(landing_smoke_1, data.player.position.x - xoffset, data.player.position.y + yoffset, width, height);
            context.restore;
            return;
        }
        if (data.currentTime - landAnimationStart < 150) {
            context.drawImage(landing_smoke_2, data.player.position.x - xoffset, data.player.position.y + yoffset, width, height);
            context.restore;
            return;
        }
        if (data.currentTime - landAnimationStart < 225) {
            context.drawImage(landing_smoke_3, data.player.position.x - xoffset, data.player.position.y + yoffset, width, height);
            context.restore;
            return;
        }
        if (data.currentTime - landAnimationStart < 300) {
            context.drawImage(landing_smoke_4, data.player.position.x - xoffset, data.player.position.y + yoffset, width, height);
            landAnimationStart = undefined;
            landAnimation = false;
            wasInAir = false;
            context.restore;
            return;
        }
    }
}

function prepareNextFrame() {
    sendGameEvent("action=update-data");
}

function updateAndRender() {
    sendGameEvent("action=get-data");
    if (data === undefined) {
        console.log("NO DATA");
        return;
    } else {
        render();
        //Draw action independent animations
        animate();
        //Make the canvas settings clean for the next render
        context.restore();
    }
}

//Controller Integration for Firefox
function checkGamepad() {
    try {
        var gp = navigator.getGamepads()[0];
        var axeLF = gp.axes[0];
        console.log(axeLF);
        if (axeLF < -0.5) {
            if (data.right) {
                sendGameEvent("action=key-released&keycode=rightKey");
            }
            sendGameEvent("action=key-pressed&keycode=leftKey");
        } else if (axeLF > 0.5) {
            if (data.left) {
                sendGameEvent("action=key-released&keycode=leftKey");
            }
            sendGameEvent("action=key-pressed&keycode=rightKey");
        } else {
            sendGameEvent("action=key-released&keycode=leftKey");
            sendGameEvent("action=key-released&keycode=rightKey");
        }
        if (gp.buttons[0].pressed) {
            sendGameEvent("action=key-pressed&keycode=jumpKey");
        } else if (data.space) {
            sendGameEvent("action=key-released&keycode=jumpKey");
        }
    } catch (e) {
        console.log("GamePadRemoved");
    }
}
function getEventFromKeyCode(keyCode) {
    switch(keyCode) {
        case keyCodes.leftKeyCode: return 'leftKey';
        case keyCodes.rightKeyCode: return 'rightKey';
        case keyCodes.jumpKeyCode: return 'jumpKey';
        case keyCodes.downKeyCode: return 'downKey';
        case keyCodes.dashKeyCode: return 'dashKey';
        default: return null;
    }
}
//Utilitary event function that sends key pressed data
function keyPressed(event) {
    var eventName = getEventFromKeyCode(event.keyCode);
    if(eventName == null) return;
    
    sendGameEvent("action=key-pressed&keycode=" + eventName);
    if (event.keyCode === keyCodes.rightKeyCode) {
        if (first_press === false) {
            data.animation_stage = 5;
            first_press = true;
        }
        //background_sound.play();
    }
    if (event.keyCode === keyCodes.jumpKeyCode) {
        jump_sound.current_time = 0;
        jump_sound.play();
    }
}
//Utilitary event function that sends key released data
function keyReleased(event) {
    var eventName = getEventFromKeyCode(event.keyCode);
    if(eventName == null) return;
    
    sendGameEvent("action=key-released&keycode=" + eventName);
}

//Utilitary function for server requests
function sendGameEvent(url) {
    if (uuid === undefined) {
        console.log("uuid undefined");
        return;
    }
    socket.emit('game', url + "&player=" + uuid);
}
