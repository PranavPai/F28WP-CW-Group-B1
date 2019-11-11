var context = null;
var tileW = 40, tileH = 40;
var mapW = 10, mapH = 10;

var currentSecond = 0, frameCount = 0, frameLastSecond = 0;

// 0 is empty, 1 is wall and  2 is player
var gameMap = [
    [0,0,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,2,0,0,0,0,1],
    [1,0,1,1,1,1,0,0,0,1],
    [1,0,0,0,0,1,0,0,1,0],
    [1,1,1,0,0,1,0,0,0,0],
    [0,0,0,0,0,1,0,0,1,0],
    [0,0,0,0,0,1,0,0,0,1]
];

window.onload = function(){
    var canvas = document.getElementById('gameCanvas');
    tileW = canvas.width / mapW;
    tileH = canvas.height / mapH;

    if (this.gameMap == null)
    {
        console.log("DING");
    }

    context = canvas.getContext('2d');
    //requestAnimationFrame(drawGame);
    context.font = "bold 10pt sans.serif";
};



function drawGame()
{
    if (context == null) {return;} // if the windwos has not loaded yet then we need to wait.
    
    // calculate the current seccond.
    var sec = Math.floor(Date.now()/1000);
    if (sec != currentSecond) 
    {
        // update currentSecond and asign frameCount.
        currentSecond = sec;
        frameLastSecond = frameCount;
        frameCount = 1;
    }
    else { frameCount ++; } // else we just need to increase the frame count.
    // since a lot of frames can happen within a seccond, there is a lot of waiting.
    // this is why I use a frame count.
    
    // draw the tiles that make up the game map.
    for(var y = 0; y < mapH; y++)
    {
        for(var x = 0; x < mapW; x++)
        {
            // need to repace the 1d array with a 2d array later.
            switch (gameMap[y][x])//gameMap[((y*mapW) + x )]) // this will get use the correct pos in the 1d array
            {
                case 0:
                    context.fillStyle = "#999999"; // if wall then fill with dark gray.
                    break;
                case 2:
                        context.fillStyle = "#50c7c3"; // if wall then fill with dark gray.
                        break;
                default:
                    context.fillStyle = "#eeeeee"; // else the tile is a path and will be light gray.   
            }

            context.fillRect(x*tileW, y*tileH, tileW, tileH);
        }
    }

    context.fillStyle = "#ff0000";
    context.fillText("FPS: " + frameLastSecond, 10, 20);

    requestAnimationFrame(drawGame);
}