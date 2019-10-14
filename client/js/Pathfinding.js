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
* - 
*/