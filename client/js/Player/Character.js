var client = io();

function Character() {
    this.username = sessionStorage.getItem('username');
    this.tilePosition = [1, 1];
    this.timeLastMoved = 0;
    this.MoveSpeed = 200;
    this.timeLastAttacked = 0;
    this.attackSpeed = 400;

    this.stats = {
        "level": 1,
        "EXP": 0,
        "maxHealth": 100,
        "health": 100,
        "attack": 50,
        "defence": 5,
        "NumberOfKills": 0
    } 

    LocalPlayerList.push([this.username, this.tilePosition]);

    client.emit("connectedusername", this.username, this.tilePosition);
    
}


Character.prototype.placeAt = function(x,y) {
    if (x <= gameMap.length-1 && x >= 0 && y <= gameMap.length-1 && y >= 0)
    { // NEVER EVER CALL THIS... VERY BAD THINGS WILL HAPPEN AND YOUR FAMILY WILL DIE.
        this.tilePosition[0] = x;
        this.tilePosition[1] = y;

        if (this.username == player.username)
        {
            gameMap[x][y] = 2; // this is the player
        }
        else 
        {
            // this is any pther random player.
            gameMap[x][y] = 3;
        }
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

// gets called when ever the player tryeds to attack something.
Character.prototype.DealDamage = function(targetPlayer){
    // then we want to damage that player.
    client.emit('PlayerAttackOtherPlayer', [targetPlayer[1], player.stats.attack, player.username]);
    // console.log(`Damage done: ${player.stats.attack}`)
}   


// gets called whenever the player takes damage from something.
Character.prototype.TakeDamge = function(packet)
{   // packet[0] == you, packet[1] == the damage you took 
   //  packet[2] == who attacked you

   damageAmmount = packet[1];
    
    // if another player has damaged us then we need to take that amount of damange
    var damageTaken = damageAmmount - player.stats.defence
    player.stats.health -= damageTaken;
    // console.log(`Damage Taken: ${damageTaken} Total health: ${player.stats.health}`);

    percentHealthRemaining = Math.floor((player.stats.health / player.stats.maxHealth) * 100);

    progressBars[0].setValue(percentHealthRemaining);

    // after we have taken damage we need to check to see if we are dead.
    // if our health is 0 then we need to kill the player

    if (player.stats.health <= 0)
    {
        // console.log("YOU ARE DEAD");

        gameMap[player.tilePosition[0]][player.tilePosition[1]] = 0;

        player.movePlayerTo(50,50);
        player.stats.health = player.stats.maxHealth;
        progressBars[0].setValue(player.stats.maxHealth);

        client.emit('PlayerKill', packet[2], packet[0]);
        alert("You are dead");
    }
    
    // TODO::: add in a death screan for the player to see
    // -- Should include their score
    // -- should also show the top 10 people on the server.
}

client.on("playerTakeDamageFromServer", function PlayerTakeDamageFromServer(packet)
{  // packet[0] == you, packet[1] == the damage that you took 
   //packet[2] == who attacked you
    
    if (packet[0].username == player.username)
    {
        // you are the one who took damge
        player.TakeDamge(packet);
    }
});

client.on("KilledAPlayer", function YouKilledAPlayer(you, playerYouKilled){
    if (you != undefined && you == player.username)
    {
        player.stats.EXP += 30 * ( (100 - player.stats.level) / 100);

        if (player.stats.EXP > 100)
        {
            player.stats.EXP-= 100;
            player.stats.level++;

            console.log(`Level Up, level is now ${player.stats.level}`);
            document.querySelector('.Level').textContent = "Level " + player.stats.level;
        }

        player.stats.NumberOfKills++;
        document.querySelector('.NumberOfKills').textContent = "Kills:  " + player.stats.NumberOfKills;
        
        
        progressBars[1].setValue(player.stats.EXP);

    }
});
