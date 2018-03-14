var dir;
var pos;
var velocity;
var gravity;
var context;
var canvas;
var ground;
var last_pos = {x : -100  , y : -100};
var jump_sound  , background_sound , jump_land;
var animation_stage = 0;
var first_press;
var oldPos;
var rendered = 0;
var walk_1 , walk_2 , walk_3 , walk_4 ;
var background;
var objects = [];
var backgroundX = 0;
var right = false, left = false, space = false;
var double_jump = 0;
var inAir = false;
var groundBase = 595;
var rightCollision = false;
var spriteSize;
var defaultGroundX = 595;


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

function getBottom(position) {return position.y + spriteSize;}
function getTop(position) {return position.y;}
function getRight(position) {return position.x + spriteSize;}
function getLeft(position) {return position.x;}



window.onload = function () {

    canvas = document.querySelector("#gameCanvas canvas");
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
    spriteSize = 64 ; // get by GET REQUEST;
    canvas.height = window.innerHeight;
    defaultGroundX = window.innerHeight - 128;         
    canvas.width = window.innerWidth;
    velocity = new Vector2(0, -0.2);
    gravity = new Vector2(0, 0.35);
    pos = new Vector2(canvas.width / 2 , canvas.height / 2);

     objects.push({x : canvas.width / 2  , y : canvas.height / 2});
     console.log(window.innerWidth);
     console.log(canvas.width);
     console.log(objects[0]);
    objects.push({x : canvas.width / 2 + 600 , y : canvas.height / 2 + 250});
    objects.push({x : canvas.width / 2 + 800 + 50 , y : canvas.height / 2 + 200});
    objects.push({x : canvas.width / 2 + 800  + 150, y : canvas.height / 2 + 150});
    objects.push({x : canvas.width / 2 + 800  + 250, y : canvas.height / 2 + 100});
    objects.push({x : canvas.width / 2 + 800  + 350, y : canvas.height / 2 + 50});
    objects.push({x : canvas.width / 2 + 800  + 550, y : canvas.height / 2 + 0});
    this.requestAnimationFrame(game_loop);
};

window.onresize = () => {
    console.log(window.innerHeight);
    defaultGroundX = window.innerHeight - 128; 
    render();
};

function player_animation(p) {
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
    // if(window.innerWidth > 1280){
    //     context.canvas.width  = 1280;
    //     if(window.innerHeight > 720){
    //         context.canvas.height = 720;
    //     }
    // }
    // else{       
        canvas.height = window.innerHeight;        
        //canvas.width = window.innerWidth;
        canvas.width =window.innerWidth;
        console.log(window.getComputedStyle(document.getElementsByTagName("body")[0],null).getPropertyValue("width")); // Scoate px din capat;
    // }
    if(backgroundX > canvas.width){
        backgroundX %= canvas.width;
    }
    context.restore();
    context.drawImage(background , backgroundX % canvas.width , 0, canvas.width , canvas.height);
    context.drawImage(background , canvas.width + backgroundX  % canvas.width, 0 , canvas.width, canvas.height);
    for (let i = 0; i < canvas.width  - backgroundX; i += 64) {
        context.drawImage(ground ,  i + backgroundX , defaultGroundX + 64, 64 , 64);
    }
    drawObjects();
    player_animation(animation_stage);
}

function drawObjects(){
    for(let i = 0; i < objects.length; ++i){
        context.drawImage(ground , objects[i].x + backgroundX , objects[i].y , 64, 64);
    }
}


function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function reset() {
    dir.x = 1;
    dir.y = 0;
    dir.mul(2);
    velocity.x = 0;
    velocity.y = -0.2;
    gravity.x = 0;
    gravity.y = 0.09;
    pos.y = groundBase;
}


function game_loop() {
    oldPos = pos;
    //console.log(pos);
    //console.log(objects[0]);
    updatePosition();
    if(checkCollision()){
        //console.log(dir);

        //this.requestAnimationFrame(game_loop);

    }
    else{
        groundBase = defaultGroundX;
    }
    if(rendered < 10){
        render();
        ++rendered;
    }
    if(pos.x != last_pos.x || pos.y != last_pos.y){
        if(pos.x + 64 > canvas.width / 2 ){
            backgroundX -= 3;
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
        if(rendered < 20){
            render();
            ++rendered;
        }
    }
    this.requestAnimationFrame(game_loop);
}


function updatePosition() {
    if (pos.y < groundBase) {
        animation_stage = 0;
        inAir = true;
        gravity.add(new Vector2(0, 0.01));
        dir.add(gravity);
        pos.add(dir);
    }
    if (pos.y > groundBase) {
        reset();
        jump_land.play();
        double_jump = 0;
        inAir = false;
    }
    if (right === true && left === false) {
        if (dir.x === 0) {
            dir.x = 1;
        }
        ++animation_stage;
        dir.x = Math.abs(dir.x);
        pos.add(dir);
    }
    if (left === true && right === false) {
        if (dir.x === 0) {
            dir.x = -1;
        }
        dir.x = - Math.abs(dir.x);
        pos.add(dir);
    }
    if (double_jump < 9) {
        if (space && left === false && right === false) {
            ++double_jump;
            dir.y = - 1;
            dir.x = 0;
            velocity.add(new Vector2(0, -0.1));
            oldPos = pos;
            dir.add(velocity);
            dir.mul(4.3);
            pos.add(dir);
        }
        if (space && (left === true || right === true)) {
            ++double_jump;
            dir.y = - 1;
            dir.x = 0;
            oldPos = pos;
            dir.mul(5);
            pos.add(dir);
           
        }
    }
}


function checkCollision(){
    let response = false;
    for(let i = 0; i < objects.length; ++i){
        if (getRight(pos) > getLeft(objects[i]) + backgroundX && getRight(pos) < getRight(objects[i]) + backgroundX && getTop(pos) < getBottom(objects[i]) && getBottom(pos) > getTop(objects[i]) && groundBase === defaultGroundX) {
            //console.log("LEFT");
            //inAir = false;
            dir.x = 0;
            right = false;
            rightCollision = true;
            response = true;
        }
        if (getTop(pos) < getTop(objects[i]) && getBottom(pos) > getTop(objects[i]) && getLeft(pos) > getLeft(objects[i]) + backgroundX - 42 && getRight(pos) < getRight(objects[i]) + (backgroundX  + 42)) {
           // console.log("TOP");
            //inAir = false;
            groundBase = getTop(objects[i]) - 63;
            inAir = false;
            rightCollision = false;
            response = true;

        }
        if (getBottom(pos) > getBottom(objects[i]) && getTop(pos) < getBottom(objects[i]) && getLeft(pos) > getLeft(objects[i]) + backgroundX  - spriteSize && getRight(pos) < getRight(objects[i]) + (backgroundX  + spriteSize)) {
            //console.log("BOTTOM");
            //groundBase = 595;
             //dir.x = 0;
             dir.y = 3;
             response = true;

        }

    }
    if(!response)
        rightCollision = false;
    return response;
}

function keyPressed(event) {
    if (event.keyCode === 37) {
          left = true;            
    }
    if (event.keyCode === 39 && rightCollision === false) {
        right = true;
        if(first_press === false){
          animation_stage = 5;
          first_press = true;             
        }
        //background_sound.play();
    }
    if (event.keyCode === 32) {
        jump_sound.load();
        jump_sound.play();
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