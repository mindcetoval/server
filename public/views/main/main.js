app.controller('introCtrl', ['$scope', function ($scope) {
    var stage;
    var spritesheet;
    var animation;
    var bitmapZone;


    stage = new createjs.Stage("myCanvas");
    var world = new Image();
    world.src = "images/movWorldsmall.png"
    bitmapWorld = new createjs.Bitmap(world);
    bitmapWorld.x = 500;
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
    animation.x = 490;
    animation.y -= 42;
    animation.addEventListener("click", playAnimtion);

    createjs.Ticker.setFPS(12);
    createjs.Ticker.addEventListener("tick", stage);


    function playAnimtion(event) {
        animation.gotoAndPlay(2);
        setTimeout(enterMap, 700);
    }

    function enterMap() {
        document.location = '#/map';
    }
}]);
