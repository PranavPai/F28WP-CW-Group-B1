function Character() {
    this.username = Math.random();
    this.tilePosition = [1, 1];
    this.timeLastMoved = 0;
    this.MoveSpeed = 200;

    LocalPlayerList.push([this.username, this.tilePosition]);

    client.emit("connectedusername", this.username, this.tilePosition);
}


Character.prototype.placeAt = function(x,y) {
    if (x <= gameMap.length-1 && x >= 0 && y <= gameMap.length-1 && y >= 0)
    { // NEVER EVER CALL THIS... VERY BAD THINGS WILL HAPPEN AND YOUR FAMILY WILL DIE.
        this.tilePosition[0] = x;
        this.tilePosition[1] = y;

        gameMap[x][y] = 2;
        client.emit('playerposition', [this.username, this.tilePosition]);
    }
};

// moves the player to the given x and y pos if it is walkable.
Character.prototype.movePlayerTo = function (x, y) {
    // if the target x and y pos is walkable then move the player that pos.
    if (gameMap[x][y] == 0) {
        player.placeAt(x, y)
        player.timeLastMoved = Date.now();
    }
};