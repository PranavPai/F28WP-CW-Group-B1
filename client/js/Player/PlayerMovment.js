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

    var LookTile = [posX,posY];
    if (keyDown[38])
        LookTile = [posX,posY-1];
    else if (keyDown[40])
        LookTile = [posX,posY+1];
    else if (keyDown[37])
        LookTile = [posX-1,posY];
    else if (keyDown[39])
        LookTile = [posX+1,posY];

    if (LookTile[0] != posX || LookTile[1] != posY)
    {
        if (gameMap[LookTile[0]][LookTile[1]] == 0)
        {
            gameMap[posX][posY] = 0
            player.movePlayerTo(LookTile[0],LookTile[1])
        }
        else if (gameMap[LookTile[0]][LookTile[1]] == 2 && player.timeLastAttacked + player.attackSpeed < Date.now())
        {
            player.timeLastAttacked = Date.now();
            // we are trying to damage another player
            // find out what player we are trying to attack
            
            playerToAttack = PosToLocalPlayerIndex(LookTile);
            // console.log(`playerToAttack: ${playerToAttack}`);
            if (playerToAttack != -1)
            {
                // if the player has tryed to move onto a tile that has another player standing on it.
                // we have found a player there.
                // now deal damage to that player.
                player.DealDamage(playerToAttack);
            }
        }
    }
}