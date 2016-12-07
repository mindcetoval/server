app.controller('introCtrl', ['$scope', function ($scope) {
    var stage;
    console.log(document.getElementById("myCanvas"));
    stage = new createjs.Stage("myCanvas");
    var world = new Image();
    world.src = "images/movWorldsmall.png";
    var bitmapWorld = new createjs.Bitmap(world);
    bitmapWorld.scaleX = 2.0;
    bitmapWorld.scaleY = 2.0;
    stage.addChild(bitmapWorld);


    var theZone = new Image();
    theZone.src = "images/movZoomZonesmall.png"
    var bitmapZone = new createjs.Bitmap(theZone);
    bitmapZone.x += 20;
    bitmapZone.y = 170;
    bitmapZone.addEventListener("click", dropsShadow)
    bitmapZone.scaleX = 2.0;
    bitmapZone.scaleY = 2.0;
    stage.addChild(bitmapZone);

    // bitmap.shadow = new createjs.Shadow("#000000", 5, 5, 10);
    createjs.Ticker.addEventListener("tick", stage);

    /* var stage = new createjs.Stage(document.getElementById("myCanvas"));
     var image = new createjs.Bitmap("images/movWorld.png");
     stage.addChild(image);
     image.x=100;
     image.y=100;
     
     //createjs.Ticker.addEventListener("tick", handleTick);
     stage.update();*/

    function dropsShadow(event) {
        console.log("hey");
        console.log(event.currentTarget);
        event.currentTarget.shadow = new createjs.Shadow("#000000", 5, 5, 10);
    }

    function tick(event) {
        // Other stuff
        stage.update(event);
    }
}]);