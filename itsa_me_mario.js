var dir;
var pos;
var velocity;
var gravity;
var context;
var canvas;
var last_pos = {x : -100  , y : -100};
var jump_sound  , background_sound;
var animation_stage = 0;
var jump_land ;
var ground;
var rendered = 0;
var walk_1 , walk_2 , walk_3 , walk_4 ;
var background;
var backgroundX = 0;
var up = false, down = false, right = false, left = false, space = false;
var double_jump = 0;
var inAir = false;


class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(p) {
        this.x += p.x;
        this.y += p.y;
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        this.x /= this.magnitude();
        this.y /= this.magnitude();
    }

    mul(p) {
        this.x *= p;
        this.y *= p;
    }

    substract(p) {
        this.x -= p.x;
        this.y -= p.y;
    }

    set(p) {
        this.x = p.x;
        this.y = p.y;
    }

    div(p) {
        this.x /= p;
        this.y /= p;
    }

}


window.onload = function () {

    canvas = document.getElementById("game");
    context = canvas.getContext("2d");
    document.addEventListener("keydown", keyPressed, false);
    document.addEventListener("keyup", keyReleased, false);
    jump_sound = new Audio();
    jump_land = new Audio();
    walk_1 = new Image();
    walk_2 = new Image();
    walk_3 = new Image();
    walk_4 = new Image();
    background = new Image();
    background_sound = new Audio();
    background_sound.src = "sound/04-Sanctuary.mp3";
    background_sound.loop = true;
    background_sound.volume = 0.05;
    background_sound.play();
    ground = new Image();
    ground.src = "textures/ground.png";
    walk_1.src = "textures/Hat_man/Walk/Hat_man1.png";
    walk_2.src = "textures/Hat_man/Walk/Hat_man2.png";
    walk_3.src = "textures/Hat_man/Walk/Hat_man3.png";
    walk_4.src = "textures/Hat_man/Walk/Hat_man4.png";
    jump_sound.src = "sound/jump_sound.mp3";
    jump_sound.volume = 0.1;
    jump_land.src = "sound/jump_land.mp3";
    jump_land.volume = 0.1;
    background.src  = "textures/background.png";
    dir = new Vector2(1, 0);
    dir.mul(2);
    velocity = new Vector2(0, -0.2);
    gravity = new Vector2(0, 0.35);
    pos = new Vector2(canvas.width / 2 - 64, 595);
    this.requestAnimationFrame(game_loop);
}



function player_animation(p) {
    //context.fillRect(pos.x, pos.y, 64, 64);
    context.save();
    context.shadowOffsetX = -3;
    context.shadowOffsetY = 3;
    context.shadowColor = "black";
    context.shadowBlur  = 20;
    if(p >= 25){
        p %= 25;
    }
    if(p % 25 < 6){
		context.drawImage(walk_1, pos.x, pos.y, 64, 64);
		return;
	}
	if(p % 25 < 12){
		context.drawImage(walk_2, pos.x, pos.y, 64, 64);
		return;
	}
	   if(p % 25 < 18 ){
		context.drawImage(walk_3, pos.x, pos.y, 64, 64);
		return;
	}
	if(p % 25 < 25){
		context.drawImage(walk_4, pos.x, pos.y, 64, 64);
        return;
	}

}


function render() {
	if(backgroundX > 1280){
		backgroundX %= 1280;
	}
    context.drawImage(background , backgroundX % 1280 , 0, canvas.width , canvas.height);
    context.drawImage(background , canvas.width + backgroundX  % 1280, 0 , canvas.width, canvas.height);
    context.restore();
    for (let i = 0; i < 1280  - backgroundX; i += 64) {
        context.drawImage(ground ,  i + backgroundX , 656, 64 , 64);
    }
    player_animation(animation_stage);
}


function reset() {
    dir.x = 1;
    dir.y = 0;
    dir.mul(2);
    velocity.x = 0;
    velocity.y = -0.2;
    gravity.x = 0;
    gravity.y = 0.09;
    pos.y = 595;
}


function game_loop() {
    updatePosition();
    if(rendered < 3){
        render();
        ++rendered;
    }
    if(pos.x != last_pos.x || pos.y != last_pos.y){
        console.log(pos.x, pos.y);        
        if(pos.x + 64 > canvas.width / 2 ){
            backgroundX -= 2;
            pos.x = canvas.width / 2 - 64; 
        }
        else if(pos.x + 64 < 64){
            pos.x = 0;
        }
        render();
        last_pos.x = pos.x;
        last_pos.y = pos.y;
        rendered = 3;
    }
    else{
        animation_stage = 0;
        if(rendered < 5){
            console.log(pos.x, pos.y);        
            render();
            ++rendered;
        }
    }
    this.requestAnimationFrame(game_loop);
}


function updatePosition() {
    if (pos.y < 595) {
		animation_stage = 0;
        inAir = true;
        gravity.add(new Vector2(0, 0.01));
        dir.add(gravity);
        pos.add(dir);
    }
    if (pos.y > 595) {
        reset();
        jump_land.play();
        double_jump = 0;
        inAir = false;
    }
    if (right == true && left == false) {
        if (dir.x == 0) {
            dir.x = 1;
        }
		++animation_stage;
        dir.x = Math.abs(dir.x);
        pos.add(dir);
    }
    if (left == true && right == false) {
        if (dir.x == 0) {
            dir.x = -1;
        }
        dir.x = - Math.abs(dir.x);
        pos.add(dir);

    }
    if (double_jump < 9) {
        if (space && left == false && right == false) {
            ++double_jump;
            dir.y = - 1;
            dir.x = 0;
            velocity.add(new Vector2(0, -0.1));
            dir.add(velocity);
            dir.mul(4.3);
            pos.add(dir);
        }
        if (space && (left == true || right == true)) {
            ++double_jump;
            dir.y = - 1;
            dir.x = 0;
            dir.mul(5);
            pos.add(dir);
        }
    }
}


function keyPressed(event) {
    if (event.keyCode === 37) {
        left = true;
    }
    if (event.keyCode === 39) {
        right = true;
    }
    if (event.keyCode === 32) {
        jump_sound.load();
        jump_sound.play();
        space = true;
    }
}

function keyReleased(event) {
    keyPressed = false;
    if (event.keyCode === 37) {
        left = false;
    }
    if (event.keyCode === 39) {
		animation_stage = 0;
        right = false;
    }
    if (event.keyCode === 32) {
        space = false;
    }
}