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

class GameObject {
    constructor(type, x, y, width, height) {
        this.type = type;
        this.position = new Vector2(x, y);
        this.width = width;
        this.height = height;
    }
}

function getBottom(object) {
    return object.position.y + object.height;
}

function getTop(object) {
    return object.position.y;
}

function getRight(object) {
    return object.position.x + object.width;
}

function getLeft(object) {
    return object.position.x;
}

function getGameObjectCopy(object) {
    var copy = new GameObject(null, null, null, null, null);
    copy.type = object.type;
    copy.position = new Vector2(object.position.x, object.position.y)
    copy.height = object.height;
    copy.width = object.width;
    return copy;
}

isValidJson = function(input){
    try{
        JSON.parse(input);
    }catch(e){
        console.log(input);
        return false;
    }
    return true;
}

module.exports = {Vector2
 , GameObject , isValidJson , getBottom , getLeft , getTop , getRight};
