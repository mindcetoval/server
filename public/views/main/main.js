app.controller('introCtrl', ['$scope', function ($scope) {
var stage;
var spritesheet;
var animation;
var bitmapZone;
var forMouseBMP;
var mySIForDrop;
var mySIForStart;
var asteroid;
var counterForSetInterval = 0;
var spritesheetAlien;
var animationAlien;
var counterForSetIntervalAlien = 0;
var mySIForStopAnimation;

stage = new createjs.Stage("myCanvas");
var world = new Image();
world.src = "images/movWorldsmall.png"
bitmapWorld = new createjs.Bitmap(world);
bitmapWorld.x = 550;
stage.addChild(bitmapWorld);


spritesheet = new createjs.SpriteSheet({
    framerate: 12,
    images: ["images/spritesheetRight.png"],
    frames: [[0, 0, 150, 105, 0, -14.150000000000006, -120.95], [150, 0, 177, 124, 0, -8.150000000000006, -111.95], [327, 0, 204, 141, 0, -1.1500000000000057, -103.95], [531, 0, 229, 160, 0, 3.8499999999999943, -94.95], [760, 0, 256, 179, 0, 10.849999999999994, -85.95], [0, 179, 284, 198, 0, 17.849999999999994, -76.95], [284, 179, 310, 217, 0, 23.849999999999994, -67.95], [594, 179, 337, 235, 0, 30.849999999999994, -58.95], [0, 414, 364, 253, 0, 36.849999999999994, -50.95], [364, 414, 391, 272, 0, 43.849999999999994, -41.95], [0, 686, 418, 291, 0, 50.849999999999994, -32.95], [418, 686, 445, 309, 0, 56.849999999999994, -23.95], [0, 995, 472, 328, 0, 63.849999999999994, -14.95], [472, 995, 498, 347, 0, 69.85, -5.95]],
    animations: {
        static: 1,
        ani: [2, 14]
    }
});

animation = new createjs.Sprite(spritesheet, "static");
stage.addChild(animation);
animation.x = 543;
animation.y -= 42;
animation.addEventListener("click", playAnimtion);

spritesheetAlien = new createjs.SpriteSheet({
    framerate: 25,
    images: ["images/alienSpritesheet.png"],
    frames: [[0, 0, 404, 317, 0, 232.95, 179.4], [404, 0, 404, 317, 0, 232.95, 179.4], [808, 0, 404, 317, 0, 232.95, 179.4], [1212, 0, 404, 317, 0, 232.95, 179.4], [1616, 0, 404, 317, 0, 232.95, 179.4], [0, 317, 404, 317, 0, 232.95, 179.4], [404, 317, 404, 317, 0, 232.95, 179.4], [808, 317, 404, 317, 0, 232.95, 179.4], [1212, 317, 404, 317, 0, 232.95, 179.4], [1616, 317, 404, 317, 0, 232.95, 179.4], [0, 634, 404, 317, 0, 232.95, 179.4], [404, 634, 404, 317, 0, 232.95, 179.4], [808, 634, 404, 317, 0, 232.95, 179.4], [1212, 634, 404, 317, 0, 232.95, 179.4], [1616, 634, 404, 317, 0, 232.95, 179.4], [0, 951, 404, 317, 0, 232.95, 179.4]],
    animations: {
        static: 1,
        ani: [2, 16]
    }
});
var speak = new Image();
speak.src = "images/ALIENSPEAK.png"
speakBMP = new createjs.Bitmap(speak);
speakBMP.x = 240;
speakBMP.Y = 30;
speakBMP.scaleX *= 0.25;
speakBMP.scaleY *= 0.25;
stage.addChild(speakBMP);
animationAlien = new createjs.Sprite(spritesheetAlien, "static");
stage.addChild(animationAlien);
animationAlien.x = 130;
animationAlien.y = 110;
animationAlien.scaleX *= 0.5;
animationAlien.scaleY *= 0.5;
setInterval(playAlienAnimtion, 3000);
animationAlien.shadow = new createjs.Shadow("#6c6c6c", 5, 5, 10);
createjs.Ticker.setFPS(12);
createjs.Ticker.addEventListener("tick", stage);

mySIForStart = setInterval(dropAsteroid, 5000);

    function playAlienAnimtion() {
        mySIForStopAnimation = setInterval(stopAnimation, 600);
        animationAlien.gotoAndPlay(2);
    }

    function stopAnimation() {
        clearInterval(mySIForStopAnimation);
        animationAlien.stop();
    }

    function playAnimtion(event) {
        animation.gotoAndPlay(2);
        setTimeout(enterMap, 700);
    }

    function enterMap() {
        document.location = '#/map';
    }

    function dropAsteroid() {
        var asteroidImg = new Image();
        asteroidImg.src = "images/asteroid.png";
        asteroid = new createjs.Bitmap(asteroidImg);
        stage.addChild(asteroid);
        var randomPosition = Math.random() * (1400 - 1) + 1;
        asteroid.x = randomPosition;
        mySIForDrop = setInterval(function () {

            if (counterForSetInterval == 30) {
                clearInterval(mySIForDrop);

                counterForSetInterval = 0;
                stage.removeChild(asteroid);
            }
            counterForSetInterval++;
            asteroid.x = asteroid.x + 20;
            asteroid.y += 10;
            asteroid.scaleX *= 0.8;
            asteroid.scaleY *= 0.8;

        }, 50);
    }
}]);
