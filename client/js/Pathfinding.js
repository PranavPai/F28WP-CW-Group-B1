/*
* Pathfinding.
* - World is made up up tiles, which in turn hold at least 3 values; x position,  y posistion and a movment pentaly
* When the player clicks in the world. the clicked location will be passed to this scrip.
* When that happens the script will use the A* Pathfinding algorithum to find the most effisiant path to the target
* 
* the Algorithum will need to keep track of 2 things.
* - The tiles we have looked at
* - The tiles we need to look at
* when a tile is checked it we look at and calculate:
* - the distance from the starting postion, to prevent the player from looking to far away from the target.
* - distance valuse to the target. Will be needed so we know what to check first next.
* - the movment penalty for moving onto that tile. EG it is faster to walk over stone then mud.
* after taking all this into account we can deside on what tile to move to next.
*/