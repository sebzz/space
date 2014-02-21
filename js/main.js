var canvas = document.getElementById("game-window");
var context = canvas.getContext("2d");

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

var app = {}
window.asteroidz = app;

var game = {
    height: canvas.height,
    width: canvas.width,

    app: app,
    canvas: canvas,
    context: context,
    actors: [],
    
    render: function() {

        var app = window.asteroidz;
        
        // need to erase actors rather than clearing background.
        this.fillBackground();

        this.updateActors();

        if (app.hasOwnProperty('input')){
            context.fillText(app.input.pressedKeys(), 10, 10);
        }

        context.fillText('Position: x:' + app.user.x + ' y:' + app.user.y, 10, 20 );
        this.handleInput(app);
    },

    start: function() {
        this.started = true;
    },

    handleInput: function() {
        if (!this.started) { return; }

        if (app.hasOwnProperty('input')) {
            if (app.input.isDown('UP')){
                app.user.accelerate();
            } else if (app.input.isDown('DOWN')) {
                app.user.decelerate();
            }

            if (app.input.isDown('LEFT')) {
                app.user.turnLeft();
            }

            if (app.input.isDown('RIGHT')) {
                app.user.turnRight();
            }

            if (app.input.isDown('SPACE')) {
                app.user.fire();
            }
        }
    },

    fillBackground: function() {
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "white";
    },
    updateActors: function(){
        var i = 0;

        deadActors = []
        
        for (i; i < this.actors.length; i++){
            actor = this.actors[i];
            if (actor.life > 0){
                actor.draw(context);
            }
            else {
               deadActors.push(i) 
            }
        }

        this.clearDead(deadActors);
    },

    clearDead: function(deadActors) {
        var j = deadActors.length -1 ;
        for (j; j >= 0 ; j--){
            this.actors.splice(deadActors[j]);
        }
    }

}

function Actor() {
}

function User() {
    this.x = game.width  / 2;
    this.y = game.height / 2;
    this.speed = { x: 0, y: 0};
    this.life = 1;
    this.direction = Math.random() * 360;
    this.counter=0;
}

User.prototype = new Actor();

User.prototype.width = game.height / 40;
User.prototype.length = game.height / 30;

User.prototype.MAX_SPEED = 10;
User.prototype.ACCELERATION = 0.5;
User.prototype.TURN_SPEED = 0.20;
User.prototype.TWO_PI = Math.PI * 2;
User.prototype.FIRE_RATE = 15;

User.prototype.applyFriction = function() {
    this.speed.x *= 0.992;
    this.speed.y *= 0.992;
}

User.prototype.newPosition = function() {
    this.applyFriction();
    this.x = (this.x + this.speed.x).mod(game.width);
    this.y = (this.y + this.speed.y).mod(game.height);
}

User.prototype.draw = function(context) {
    this.counter++;
    this.newPosition();

    context.save();

    context.translate(this.x, this.y);

    context.rotate(this.direction);
    context.beginPath();
    context.strokeStyle = "white";
    context.moveTo(-this.length/4, 0);
    context.lineTo(- this.length/2, 0 - this.width/2);
    context.lineTo( this.length / 2, 0);
    context.lineTo(- this.length / 2, 0 + this.width / 2);


    //context.lineTo(this.x + this.size/2, this.y + this.size/2);
    context.closePath();
    context.stroke();
    context.translate(-this.x, -this.y);

    context.restore();
}

User.prototype.accelerate = function () {
    this.speed.x += Math.cos(this.direction) * this.ACCELERATION / 2;
    this.speed.y += Math.sin(this.direction) * this.ACCELERATION / 2;
}

User.prototype.turnLeft = function() {
    this.direction = (this.direction - this.TURN_SPEED).mod(this.TWO_PI);
}

User.prototype.turnRight = function() {
    this.direction = (this.direction + this.TURN_SPEED).mod(this.TWO_PI);    
}

User.prototype.fire = function() {
    if (this.counter > this.FIRE_RATE) {
        this.counter = 0;
        game.actors.push(new Missile(this.direction, this.speed, this.x, this.y));
    }
}

app.user = new User()
game.actors.push(app.user);
game.start();


var Missile = function(direction, speed, currX, currY) {
    this.x = currX;
    this.y = currY;

    this.direction = direction;

    this.speedX = Math.cos(direction) * 2;
    this.speedY = Math.sin(direction) * 2;

    this.life = 200;
}

Missile.prototype.newPosition = function() {
    this.x = (this.x + this.speedX).mod(game.width);
    this.y = (this.y + this.speedY).mod(game.height);
};

Missile.prototype.draw = function(context) {
    this.newPosition();
    context.save();

    context.translate(this.x, this.y);

    context.rotate(this.direction);
    context.beginPath();
    context.strokeStyle = "white";
    context.moveTo(-2, 0);
    context.lineTo(2, 0)

    //context.lineTo(this.x + this.size/2, this.y + this.size/2);
    context.closePath();
    context.stroke();
    context.translate(-this.x, -this.y);

    context.restore();
    this.life -= 1;
};


// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();


// usage:
// instead of setInterval(render, 16) ....

(function animloop(){
    requestAnimFrame(animloop);

    game.render();
})();
