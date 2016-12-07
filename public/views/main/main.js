app.controller('introCtrl', ['$scope', function($scope) {
    var stage;
document.addEventListener("DOMContentLoaded", function() {
    console.log(document.getElementById("myCanvas"));
    stage = new createjs.Stage("myCanvas");
      var world = new Image();
      world.src = "images/movWorldsmall.png"
      var bitmapWorld = new createjs.Bitmap(world);
      stage.addChild(bitmapWorld);
    
    
      var theZone = new Image();
      theZone.src = "images/movZoomZonesmall.png"
      var bitmapZone = new createjs.Bitmap(theZone);
      bitmapZone.x+=20;
      bitmapZone.y=100;
    bitmapZone.addEventListener("mouseover", dropsShadow)
   // bitmap.scaleX = 0.2;
    //bitmap.scaleY = 0.2;
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
   
});

function dropsShadow(event){
    console.log("hey");
    console.log(event.currentTarget);
    event.currentTarget.shadow = new createjs.Shadow("#000000", 5, 5, 10);
}

function tick(event) {
    // Other stuff
    stage.update(event);
}
}]);