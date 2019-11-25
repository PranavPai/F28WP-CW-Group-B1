/*  
    *This scrip was created by Connor Marshall
    *H00232766
    *cm66  
 */

var context = null;
var tileW = 50,
    tileH = 50;
var mapW = 100,
    mapH = 100;

var LocalPlayerList = []; // format : ["username",[x,y]]

var currentSecond = 0,
    frameCount = 0,
    frameLastSecond = 0;
var lastFrameTime = 0; // time since last frame was drawing in mm  
//  ^ this will be used to normalized movment accross all games.

var gameMap = getGameMap();

var player = new Character();

// Camera
var viewPort = GetViewPort();

// This is the game loop
window.onload = function () {

    player.placeAt(Math.floor(gameMap.length / 2), Math.floor(gameMap.length / 2));

    var canvas = this.document.getElementById('gameCanvas');
    context = canvas.getContext('2d');
    requestAnimationFrame(drawGame);
    context.font = "bold 10pt sans.serif";

    // match tile to canvase size
    mapW = gameMap[0].length;
    mapH = gameMap.length;

    // add listeners to listen if a key has been pressed down or up
    addListeners();

    // Camera
    this.viewPort.screanSize = [
        canvas.width,
        canvas.height
    ];
    // END Camera
};



// This is the game loop function.
function drawGame()
{
    if (context == null) {return;} // if the windwos has not loaded yet then we need to wait.
    
    // calculate the current seccond.
    var sec = Math.floor(Date.now() / 1000);
    if (sec != currentSecond) {
        // update currentSecond and asign frameCount.
        currentSecond = sec;
        frameLastSecond = frameCount;
        frameCount = 1;
    } else {
        frameCount++;
    } // else we just need to increase the frame count.
    // since a lot of frames can happen within a seccond, there is a lot of waiting.
    // this is why I use a frame count.
    


    if (Date.now() > player.timeLastMoved + player.MoveSpeed) {

        // find out if any arrow keys are being pessed and if we can move in that direction .
        var posX = player.tilePosition[0];
        var posY = player.tilePosition[1]
    
        
        CheckPlayerInput(posX, posY)
    }

    
    
    // Camera
    var ttp = TileToPixel(player.tilePosition[0], player.tilePosition[1]);
    viewPort.update(
        ttp[0] + (tileW / 2),
        ttp[1] + (tileW / 2),
    );

    context.fillStyle = "#000000";
    context.fillRect(0, 0, viewPort.screanSize[0], viewPort.screanSize[1]);
    // END Camera

    // CAMERA: Change the range of the nested forloop to only happen within the screenSize.

    // draw the tiles that make up the gameMap.
    for (var y = viewPort.startTile[1]; y < viewPort.endTile[1]; y++) {
        for (var x = viewPort.startTile[0]; x < viewPort.endTile[0]; x++) {
            // need to repace the 1d array with a 2d array later.
            switch (gameMap[x][y]) // this will get use the correct pos in the 1d array
            {
                case 1:
                    context.fillStyle = "#525e5e"; // if wall then fill with dark gray.
                    break;
                case 2: // THIS is a player at the given tile.
                    context.fillStyle = "#d60dcc";
                    break;
                case 3: // Other Players
                    context.fillStyle = "#0dd6d6";
                    break;
                default:
                    context.fillStyle = "#18ad0a"; // else the tile is a path.   
            }

            // CAMERA: added offset to the drawn rectangles.
            context.fillRect(viewPort.offset[0] + x * tileW, viewPort.offset[1] + y * tileH, tileW, tileH);
        }
    }
    context.fillStyle = "#ff0000";
    context.fillText("FPS: " + frameLastSecond, 10, 20);

    requestAnimationFrame(drawGame);
}

// Takes in a tile position and will return its pixle location.
// This is for the camera and anything else which works in pixle position.
function TileToPixel(x,y)
{
    var pixelX = tileW * (x-1);
    var pixelY = tileH * (y-1);
    
    return [pixelX, pixelY]
}

// takes in a tile position and returns what player is in that poition.
// returns -1 if no player was found.
function PosToLocalPlayerIndex(pos)
{
    for (var i = 0; i < LocalPlayerList.length; i++) 
    {   
        if (LocalPlayerList[i][1][0] == pos[0] && LocalPlayerList[i][1][1] == pos[1])
            return LocalPlayerList[i];
    }
    return -1;
}

// holds a list of tile postions of all 2s in the map.
var listOf2s = [];

/*
    Server is not like a radio.
    First intp will be the player user name. Second input will be the servers saved postion of the player.
    
    Client has a local list of player.
    if the user name is not in the local list of player then we need to add them, eg a new player has join the game.
    if the player is in the list and the position is different to the saved location, the player has moved. We need to move
    that players location on the local client map.
*/
client.on("playerPostionsFromServer", function UpdateAllPlayerPosition(packet)
{  // packet[0] == username packet[1] == tilepos
    // loop though all players in the local list 
    if (packet[0] != player.username)
    {
        for (var i = 0; i < LocalPlayerList.length; i++) 
        {
            var testUserName = LocalPlayerList[i][0]
            if (testUserName == packet[0] && packet[0] != player.username)
            {   
                // save the last know location of this player.
                var localTilePos = LocalPlayerList[i][1]    
                // check to see if that player has moved since the last update.
                if (localTilePos[0] != packet[1][0] || localTilePos[1] != packet[1][1])
                {   // player has moved since the last update.
                    // so move them to the new location.
                    gameMap[ localTilePos[0] ][ localTilePos[1] ] = 0;
                    gameMap[ packet[1][0] ][ packet[1][1] ] = 3;

                    listOf2s.push(packet[1]);
                    listOf2s.push(localTilePos);

                    LocalPlayerList[i][1] = packet[1];
                }
                
                //else that player has not moved since the last updat.
                // so we do not have to do anything.
                
                return // we found the player that needs to be updated so we can are done
                // and we can now wait for the next packet to come.
            }

        }

        // if we are there then we need to add the to list.
        // as the this is a new player that has join the game.
        // console.log("DIGN: " + LocalPlayerList.length);
        LocalPlayerList.push(packet);
    }
});

client.on("PlayerDisconected", function RemoveDisconectedPlayerFromLocalPlayerList(disconectedPlayer){
    if (disconectedPlayer != undefined)
    {
        console.log(disconectedPlayer[1]);
        playerPos = disconectedPlayer.tilePosition;
        gameMap[playerPos[0]][playerPos[1]] = 0; // siance the player has left the game we need to remove them from the world.
        // now remove them from the LocalPlayer.
        // because we do not need to keep doing anything to them.
        LocalPlayerList.splice( [disconectedPlayer.username, playerPos] );
    }
});

