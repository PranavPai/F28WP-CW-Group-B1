// for keyboard inputs
var keyDown = {
    37: false,
    38: false,
    39: false,
    40: false
};


function addListeners() 
{
    // Listen if a key have been pressed
    window.addEventListener("keydown", function(e){
        if (e.keyCode>=37 && e.keyCode<=40)
        {
            keyDown[e.keyCode] = true;
        }
    });

    // Listen if a key been repleaed.
    window.addEventListener("keyup", function(e){
        if (e.keyCode >=37 && e.keyCode<=40)
            keyDown[e.keyCode] = false; 
    });
}


function CheckPlayerInput(posX, posY)
{
            /*
        This is the keyboard input for movment
        and the colision detection.
        player.movePlayerTo is called for the direction coresponding to the pressed key
        the code will check to see if that map location is walkable or not,
        if it is then the player can move for that key press direction
        keyDown is a list of all the valid movment keys that cab be pressed to move the player.
        The player moves around the map by the valid empty space, map[x][y] == 0, to a 2.
        Doing so will also prevent players from walking over one and other.
        */
       if (keyDown[38] && gameMap[posX][posY-1] == 0)
       { 
           gameMap[posX][posY] = 0
           player.movePlayerTo(posX,posY-1)
       }
       else if (keyDown[40] &&  gameMap[posX][posY+1] == 0)
       { 
           gameMap[posX][posY] = 0
           player.movePlayerTo(posX,posY+1)
       }
       else if (keyDown[37] &&  gameMap[posX-1][posY] == 0)
       { 
           gameMap[posX][posY] = 0
           player.movePlayerTo(posX-1,posY)
       }
       else if (keyDown[39] &&  gameMap[posX+1][posY] == 0)
       { 
           gameMap[posX][posY] = 0
           player.movePlayerTo(posX+1,posY)
       }
}