const PORTNO = '2000';

var express = require('express');

var app = express();
var http = require('http').createServer(app);
// var database = require('./server/js/database');
//var Player = require('./server/js/models/player');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use(express.static(__dirname + '/client'));


http.listen(process.env.PORT || PORTNO);
console.log(`Server Started on ${PORTNO}`);

// ###################################################

var io = require('socket.io')(http);


//var SOCKET_LIST = [];
var PLAYER_LIST = []; // list of playerDataObjects

var Player = function (id) {
    var self = {
        tilePosition: [-1, -1],
        username: "defaultplayer",
        id: id
    }
    return self;
}

var connectedplayer;

io.on('connection', function (client) {
    // Gets called a new player joins the game
    client.on('connectedusername', function initPlayer(username, tilePosition) {
        client.id = Math.random();
        connectedplayer = new Player(client.id);
        connectedplayer.username = username;
        connectedplayer.tilePosition = tilePosition
        
        if (!PLAYER_LIST.includes(connectedplayer))
        {
            PLAYER_LIST.push(connectedplayer); // only add the new player if they do not exist in the list.
            //console.log(`New player joined: player count:  ${PLAYER_LIST.length}`);
        }
    });

    client.on("print", function(word) {
        console.log(word)
    })
    
    // 
    client.on('playerposition', function updatePlayerPosition(packet) {
        ClientNameToPlayerObject(packet[0]).tilePosition = packet[1];
    });

    client.on('disconnect', function () {
        disconectedPlayerIndex = ClientIDToPlayerListIndex(client.id)
        
        console.log(PLAYER_LIST[disconectedPlayerIndex]);
        // send an update message to all clients that this player has disconected.
        io.emit("PlayerDisconected", PLAYER_LIST[disconectedPlayerIndex]);


        PLAYER_LIST.splice(disconectedPlayerIndex);
    });

    // packet[0] is the player pos that is getting attacked.
    // packet[1] is the amount that we are damaging the player by, before defence is used.
    client.on('PlayerAttackOtherPlayer', function(packet) { 
        // packet[0] == playerPos, packet[1] == damageAmount, packet[2] == the player who attacked
        player = getPlayerFromPos(packet[0]);

        if (packet[1] != undefined)
        {        
            console.log(`${packet[2]} attacked ${player} at pos: ${packet[0]} and did ${packet[1]} to it`);
        }
        
    });
});

/*
    server every 45 ms the server will loop though all online players and transmit their locations
    the server does not give a dam if the client does not get the packet.
*/
setInterval(function () {
    UpdateAllConnectedClients();
    
}, 1000 / 25);

// send and update of all players currently online to all players online.
function UpdateAllConnectedClients()
{
    // loop though all players in the list and emit their information to the clients
    for (var i = 0; i < PLAYER_LIST.length; i++)
    {
        var packet = [PLAYER_LIST[i].username, PLAYER_LIST[i].tilePosition];
        io.emit("playerPostionsFromServer", packet);
    }
}

// takes in a players position then finds and returns that player from the list. 
// returns -1 if not found
function getPlayerFromPos(playerPos)
{
    for (var index = 0; index < PLAYER_LIST.length; index++)
    {   // is the player in the list
        if (PLAYER_LIST[index].tilePosition[0] == playerPos[0] && PLAYER_LIST[index].tilePosition[1] == playerPos[1] )
        {
            console.log("FOUND");
        }
    }
    // else the player is not in the list and we need to return an error (-1)
}


// takes in a player name and will return the object connected to that name.
// returns -1 if object was not found in list.
function ClientNameToPlayerObject(username)
{
    for(var i = 0; i < PLAYER_LIST.length; i++)
    {
        if (PLAYER_LIST[i].username == username)
        {
            return PLAYER_LIST[i];
        }
    }
    
    return -1;
}

// takes in a given ID and finds the index for that player, returns -1 if not found.
function ClientIDToPlayerListIndex(id)
{
    for(var i = 0; i < PLAYER_LIST.length; i++)
    {
        if (PLAYER_LIST[i].id == id)
        {
            return i;
        }
    }
    
    return -1;
}
// --------------------------------------------------------------

