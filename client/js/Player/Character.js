function Character() {
    this.username = Math.random();
    this.tilePosition = [1, 1];
    this.timeLastMoved = 0;
    this.MoveSpeed = 200;

    this.stats = {
        "level": 1,
        "health": 100,
        "attack": 10,
        "defence": 5
    } 

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

Character.prototype.DealDamage = function(targetPlayer){
    // then we want to damage that player.
    client.emit('PlayerAttackOtherPlayer', [player.tilePosition, player.stats.attack, player.username]);
    Console.log(`Damage done: ${attack}`)
}

Character.prototype.TakeDamge = function(damageAmmount)
{
    // if another player has damaged us then we need to take that amount of damange
    var damageTaken = damageAmmount - defence
    this.Character.stats.health -= damageTaken;
    console.log(`Damage Taken: ${damageTaken}`);

    // after we have taken damage we need to check to see if we are dead.
    // if our health is 0 then we need to kill the player

    if (this.Character.stats.health <= 0)
    {
        console.log("YOU ARE DEAD");
    }
    
    // TODO::: add in a death screan for the player to see
    // -- Should include their score
    // -- should also show the top 10 people on the server.
}