app.controller('introCtrl', ['$scope', function ($scope) {
    var stage;
    var bitmapWorld;
    var bitmapZone;
    var myInterval;
    var counterForInterval = 0;
    console.log(document.getElementById("myCanvas"));
    stage = new createjs.Stage("myCanvas");
    var world = new Image();
    world.src = "images/movWorldsmall.png"
    bitmapWorld = new createjs.Bitmap(world);
    bitmapWorld.x = 500;
    stage.addChild(bitmapWorld);


    var theZone = new Image();
    theZone.src = "images/movZoomZonesmall.png"
    bitmapZone = new createjs.Bitmap(theZone);
    bitmapZone.x = 520;
    bitmapZone.y = 100;
    bitmapZone.addEventListener("click", dropsShadow)
        // bitmap.scaleX = 0.2;
        //bitmap.scaleY = 0.2;
    stage.addChild(bitmapZone);

    // bitmap.shadow = new createjs.Shadow("#000000", 5, 5, 10);

    /* var stage = new createjs.Stage(document.getElementById("myCanvas"));
     var image = new createjs.Bitmap("images/movWorld.png");
     stage.addChild(image);
     image.x=100;
     image.y=100;
     
     //createjs.Ticker.addEventListener("tick", handleTick);
     stage.update();*/
    createjs.Ticker.addEventListener("tick", stage);
    

    function dropsShadow(event) {
        myInterval = setInterval(zoomWorld, 100)
            // event.currentTarget.shadow = new createjs.Shadow("#000000", 5, 5, 10);
    }

    function zoomWorld() {
        if (counterForInterval == 4) //**when the animation is ending.**
        {
            clearInterval(myInterval);

        }
        if (counterForInterval < 3) {
            bitmapZone.x -= 100;
            bitmapZone.y -= 100;
        } else {

            bitmapZone.x -= 640;
            bitmapZone.y -= 640;
        }
        counterForInterval++;
        //bitmapWorld.x-=20;

        /*console.log(document.getElementById("myCanvas"));
        console.log(document.getElementById("myCanvas").x);
        document.getElementById("myCanvas").style.marginLeft-=40;
        //document.getElementById("myCanvas").y-=40;*/


        //bitmapWorld.scaleY-=1;
        bitmapZone.scaleX *= 2.1;
        bitmapZone.scaleY *= 2.1;
        //bitmapWorld.scaleX*=1.2;
        //bitmapWorld.scaleY*=1.2;
        document.getElementById("myCanvas").className = "circleCanvas";
    }

    function tick(event) {
        // Other stuff
        stage.update(event);
    }
}]);
