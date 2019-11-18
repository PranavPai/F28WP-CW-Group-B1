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


http.listen(PORTNO);
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
        PLAYER_LIST.splice(ClientIDToPlayerListIndex(client.id),1);
    });
});

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


// setInterval(function () {
//     var pack = []
//     for (var i in PLAYER_LIST[i]) {
//         let player = PLAYER_LIST[i];
//         pack.push({
//             username: player.username,
//             tilePosition: player.tilePosition
//         });
//     }
//     for(var i in SOCKET_LIST[i]){
//         var client = SOCKET_LIST[i];
//         io.emit('playerPostionsFromServer', pack);
//     }
// }, 1000 / 25);


/*
    server every 45 ms the server will loop though all online players and transmit their locations
    the server does not give a dam if the client does not get the packet.
*/
setInterval(function () {
    // loop though all players in the list and emit their information to the clients
    

    for (var i = 0; i < PLAYER_LIST.length; i++)
    {
        var packet = [PLAYER_LIST[i].username, PLAYER_LIST[i].tilePosition];
        io.emit("playerPostionsFromServer", packet);
    }
    
    

}, 1000 / 25);

// --------------------------------------------------------------