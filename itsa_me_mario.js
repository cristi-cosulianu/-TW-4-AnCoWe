var dir;
var player;
var velocity;
var gravity;
var context;
var canvas;
var ground, pipe;
var something;
var last_player = {
    x: -100,
    y: -100
};
var jump_sound, background_sound, jump_land;
var animation_stage = 0;
var first_press;
var oldplayer;
var rendered = 0;
var walk_1, walk_2, walk_3, walk_4;
var background;
var objects = [];
var gameSpeed = 6;
var backgroundX = 0;
var right = false,
    left = false,
    space = false;
var double_jump = 0;
var onPlatform = false;
var inAir = false;
var groundBase = 606;
var rightCollision = false,
    leftCollision = false,
    topCollision = false,
    bottomCollision = false;
var spriteSize;
var currentPlatformIndex = 0;
var defaultGroundX = 606;

function addCharacter(container, name) {
    var url = "https://gateway.marvel.com/v1/public/characters?apikey=15b0df9dd78ed4c3d58e10b0c3d36a57&hash=758e48b905e396fca02324d24f1f7b06&ts=432&name=" + name;
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var thumbnail = JSON.parse(this.responseText).data.results[0].thumbnail;
            var imgUrl = thumbnail.path + '/portrait_xlarge.' + thumbnail.extension;

            var anchor = document.createElement("a");
            anchor.setAttribute("class", "buttonGame");
            anchor.setAttribute("href", "#gameCanvas");
            anchor.setAttribute("onclick", "sceneTransition(\'chooseCaracterCanvas\',\'gameCanvas\')");

            var image = document.createElement("img");
            image.setAttribute("src", imgUrl);
            image.setAttribute("class", "icon");
            image.setAttribute("alt", name);

            anchor.appendChild(image);
            container.appendChild(anchor);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

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
    dir.mul(2);
    velocity = new Vector2(0, -0.2);
    gravity = new Vector2(0, 0.35);
    player = new GameObject(null, canvas.width / 2 - 100, defaultGroundX, 64, 64);
    defaultGroundX = window.innerHeight - player.height - 64;
    groundBase = defaultGroundX;
    loadLevel();
    this.requestAnimationFrame(game_loop);

    /* Cristi's code */
    document.getElementById("leftDiv").addEventListener("animationend", function () {
        document.getElementById("leftDiv").classList.remove('leftCurtain');
    });

    document.getElementById("rightDiv").addEventListener("animationend", function () {
        document.getElementById("rightDiv").classList.remove('rightCurtain');
    });

    var heroes = ["Spider-Man", "Wolverine", "Daredevil", "Captain America", "Iron Man", "Thor", "Black Widow", "Hulk"];
    var villains = ["Loki", "Red Skull", "Ultron", "Magneto", "Thanos", "Black Cat", "Galactus", "Apocalypse"];
    var heroesDiv = document.getElementById("heroes");
    var villainsDiv = document.getElementById("villains");

    for (var i = 0; i < heroes.length; ++i) {
        addCharacter(heroesDiv, heroes[i]);
    }

    for (var i = 0; i < villains.length; ++i) {
        addCharacter(villainsDiv, villains[i]);
    }
    /* End Cristi's code */
};

window.onresize = () => {
    defaultGroundX = window.innerHeight - player.height - 64;
    groundBase = defaultGroundX;
    render();
};

function loadLevel() {
    objects.push(new GameObject(pipe, canvas.width / 2, canvas.height / 2 + 264, 64, 128));
    objects.push(new GameObject(ground, canvas.width / 2 + 200, canvas.height / 2 + 80, 32, 32));
    objects.push(new GameObject(ground, canvas.width / 2 + 264, canvas.height / 2 + 40, 64, 64));
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
    objects.push(new GameObject(ground, canvas.width / 2 + 2264, canvas.height / 2 - 160, 128, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 2756, canvas.height / 2, 64, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 3056, canvas.height / 2, 64, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 3056, canvas.height / 2 - 250, 64, 64));
    objects.push(new GameObject(ground, canvas.width / 2 + 3356, canvas.height / 2, 64, 64));
    objects.push(new GameObject(pipe, canvas.width / 2 + 3000, canvas.height / 2 + 264, 64, 128));
    objects.push(new GameObject(ground, canvas.width / 2 + 3600, canvas.height / 3, 64, 512));
    objects.push(new GameObject(ground, canvas.width / 2 + 3800, canvas.height / 3, 64, 512));


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
    background_sound.src = "sound/04-Sanctuary.mp3";
    background_sound.loop = true;
    background_sound.volume = 0.8;
    jump_sound.src = "sound/jump_sound.mp3";
    jump_sound.volume = 0.1;
    jump_land.src = "sound/jump_land.mp3";
    jump_land.volume = 0.1;

}

function loadTextures() {
    walk_1 = new Image();
    walk_2 = new Image();
    walk_3 = new Image();
    walk_4 = new Image();
    background = new Image();
    ground = new Image();
    pipe = new Image();
    ground.src = "textures/ground.png";
    walk_1.src = "textures/Hat_man/Walk/Hat_man1.png";
    walk_2.src = "textures/Hat_man/Walk/Hat_man2.png";
    walk_3.src = "textures/Hat_man/Walk/Hat_man3.png";
    walk_4.src = "textures/Hat_man/Walk/Hat_man4.png";
    background.src = "textures/background.png";
    pipe.src = "textures/pipe.png";

}

function player_animation(p) {
    context.save();
    context.shadowOffsetX = -3;
    context.shadowOffsetY = 3;
    context.shadowColor = "black";
    context.shadowBlur = 20;
    if (p >= 25) {
        p %= 25;
    }
    if (p % 25 < 6) {
        context.drawImage(walk_1, player.position.x, player.position.y, player.width, player.height);
        return;
    }
    if (p % 25 < 12) {
        context.drawImage(walk_2, player.position.x, player.position.y, player.width, player.height);
        return;
    }
    if (p % 25 < 18) {
        context.drawImage(walk_3, player.position.x, player.position.y, player.width, player.height);
        return;
    }
    if (p % 25 < 25) {
        context.drawImage(walk_4, player.position.x, player.position.y, player.width, player.height);
        return;
    }

}

function render() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    if (backgroundX > canvas.width) {
        backgroundX %= canvas.width;
    }
    context.restore();
    context.drawImage(background, backgroundX % canvas.width, 0, canvas.width, canvas.height);
    context.drawImage(background, canvas.width + backgroundX % canvas.width, 0, canvas.width, canvas.height);
    for (let i = 0; i < canvas.width - backgroundX; i += 64) {
        context.drawImage(ground, i + backgroundX, defaultGroundX + 64, 64, 64);
    }
    drawObjects();
    player_animation(animation_stage);
}

function drawObjects() {
    for (let i = 0; i < objects.length; ++i) {
        if (getRight(objects[i]) + backgroundX < 0) {
            objects.pop();
            continue;
        }
        context.drawImage(objects[i].type, objects[i].position.x + backgroundX, objects[i].position.y, objects[i].width, objects[i].height);
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function reset() {
    dir.x = 0;
    dir.y = 0;
    velocity.x = 0;
    velocity.y = -0.2;
    gravity.x = 0;
    gravity.y = 0.23;
    player.position.y = groundBase;
}

function game_loop() {
    oldplayer = player;
    if (checkCollision()) {
        //player = oldplayer;
        if (rightCollision) {
            left = false;
        } else if (leftCollision) {
            right = false;
        }
    } else {
        rightCollision = false;
        leftCollision = false;
        topCollision = false;
        bottomCollision = false;
    }
    updateplayerposition();
    //inertia();
    if (rendered < 10) {
        render();
        ++rendered;
    }
    if (player.position.x != last_player.x || player.position.y != last_player.y) {
        if (player.position.x + player.width > canvas.width / 2) {
            backgroundX -= gameSpeed;
            player.position.x = canvas.width / 2 - player.width;
        } else if (player.position.x + player.width < player.width) {
            player.position.x = 0;
        }
        render();
        last_player.x = player.position.x;
        last_player.y = player.position.y;
        rendered = 3;
    } else {
        animation_stage = 0;
        if (rendered < 20) {
            render();
            ++rendered;
        }
    }
    //    if (objects.length > 0) {
    this.requestAnimationFrame(game_loop);
    //    } else {
    //        alert("I think you won");
    //
    //    }
}

function inertia() {
    if (!inAir) {
        return;
    }
    if (dir.x > 0 && right === false) {
        dir.x -= 0.05;
        player.position.add(dir);
        return;
    }
    if (dir.x < 0 && left === false) {
        dir.x += 0.05;
        player.position.add(dir);
        return;
    }

}

function updateplayerposition() {
    if (objects.length > 0){
        if(player.position.y < groundBase || !onPlatform){
            groundBase = defaultGroundX;
        }
    }
    if(getRight(player) < getLeft(objects[currentPlatformIndex]) + backgroundX || getLeft(player) > getRight(objects[currentPlatformIndex]) + backgroundX){
        onPlatform  = false;
        //player.position.y += 1;
    }
    if (player.position.y < groundBase) {
        animation_stage = 0;
        inAir = true;
        dir.add(gravity);
        player.position.add(dir);
        currentPlatformIndex = 0;
    }
    if (player.position.y > groundBase) {
        reset();
        jump_land.play();
        double_jump = 0;
        inAir = false;
    }
    if (right === true && left === false) {
        if (dir.x === 0 && !inAir) {
            dir.x = 2;
        }
        if (!inAir) {
            dir.x = Math.abs(dir.x);
        } else {
            if (dir.x < 2) {
                if (dir.x >= 0 && dir.x <= 2) {
                    dir.x += 0.3
                } else {
                    dir.x += 0.2;
                }
            }
        }
        ++animation_stage;
        player.position.add(dir);
    }
    if (left === true && right === false) {
        if (dir.x === 0 && !inAir) {
            dir.x = -2;
        }
        if (!inAir) {
            dir.x = -Math.abs(dir.x);
        } else {
            if (dir.x > -2) {
                if (dir.x <= 0 && dir.x >= -2) {
                    dir.x -= 0.3;
                } else {
                    dir.x -= 0.2;
                }
            }
        }
        player.position.add(dir);
    }
    if (double_jump < 1) {
        if (space && left === false && right === false) {
            ++double_jump;
            dir.y = -1;
            dir.x = 0;
            velocity.add(new Vector2(0, -0.05));
            dir.add(velocity);
            dir.mul(6);
            player.position.add(dir);
        }
        if (space && (left === true || right === true)) {
            ++double_jump;
            dir.y = -1;
            dir.x = 0;
            dir.mul(6);
            player.position.add(dir);

        }
    }
}


function checkCollision() {
    let response = false;
    for (let i = 0; i < objects.length; ++i) {
        if (getTop(player) + player.height  * 6 / 10 < getTop(objects[i]) && getBottom(player) > getTop(objects[i]) && getRight(player) > getLeft(objects[i]) + backgroundX + player.width * 6 / 10 && getLeft(player) < getRight(objects[i]) + backgroundX) {
            console.log("top");
            groundBase = getTop(objects[i]) - player.height;
            topCollision = true;
            onPlatform = true;
            currentPlatformIndex = i;
            player.position.substract(gravity);
            //dir.y = 1;
            inAir = false;
            response = true;
        }
        if (getBottom(player) > getBottom(objects[i]) && getTop(player) < getBottom(objects[i]) && getRight(player) > getLeft(objects[i]) + backgroundX + player.width * 1 / 4 && getLeft(player) < getRight(objects[i]) + backgroundX - player.width * 1 / 4) {
            console.log("bottom");
            dir.x = 0;
            dir.y = 1;
            bottomCollision = true;
            response = true;
        }
        if (getRight(player) > getLeft(objects[i]) + backgroundX + 5 && getRight(player) < getLeft(objects[i]) + backgroundX + player.width * 1 / 4 && getTop(player) < getBottom(objects[i]) && getBottom(player) > getTop(objects[i])) {
            console.log("left");
            if (inAir && space) {
                double_jump = 0;
                dir.x = -2;
            } else {
                dir.x = 0;
            }
            leftCollision = true;
            response = true;
        }
        if (getLeft(player) < getRight(objects[i]) + backgroundX + 5 && getLeft(player) > getLeft(objects[i]) + backgroundX + objects[i].width * 3 / 4 && getTop(player) < getBottom(objects[i]) && getBottom(player)  > getTop(objects[i])) {
            console.log("right");   
            if (inAir && space) {
                double_jump = 0;
                dir.x = 2;
            } else {
                dir.x = 0;
            }
            rightCollision = true;
            response = true;
        }
    }
    return response;
}

function keyPressed(event) {
    if (event.keyCode === 37 && !rightCollision) {
        left = true;
    }
    if (event.keyCode === 39 && !leftCollision) {
        right = true;
        if (first_press === false) {
            animation_stage = 5;
            first_press = true;
        }
        //background_sound.play();
    }
    if (event.keyCode === 32) {
        if (double_jump < 3) {
            jump_sound.load();
            jump_sound.play();
        }
        space = true;
    }
}

function keyReleased(event) {

    if (event.keyCode === 37) {
        left = false;
    }
    if (event.keyCode === 39) {
        animation_stage = 0;
        right = false;
        first_press = false;
    }
    if (event.keyCode === 32) {
        space = false;
    }
}