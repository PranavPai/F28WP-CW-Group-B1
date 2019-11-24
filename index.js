const PORTNO = '2000';
const MONGODB_SERVER = 'localhost';
const MONGODB_DATABASE = 'game-v1';

var CONNECTED_PLAYER_LIST = []; // list of playerDataObjects

// Import modules
const express = require('express');
const mongoose = require('mongoose');

var Player = require('./server/js/models/player');
// Create a new instance of Express
const app = express();


// Connect to the database
mongoose.connect(`mongodb://${MONGODB_SERVER}/${MONGODB_DATABASE}`)
    .then(() => {
        console.log('Database connection successful')
    })
    .catch(err => {
        console.error(`Database connection error: ${err}`)
    })


// ####################################################
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
// Serve static html, js, css, and image files from the 'client' directory
app.use(express.static(__dirname + '/client'));

// Create a Node.js based http server on port 2000
var server = require('http').createServer(app).listen(process.env.PORT || PORTNO);
console.log(`Server Started on ${PORTNO}`);

// Create a Socket.IO server and attach it to the http server
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log("client connected");

});

// ###################################################
// FUNCTIONS

// From Client
function onClientSendMessage(messageFromClient) {
    formatedMessage = client.username + ": " + messageFromClient;
    gameSocket.emit('chatMessageFromServer', formatedMessage);
}

function onGetClientPosition(positionpacket) {
    ClientNameToPlayerObject(packet[0]).tilePosition = packet[1];
}

// ##################################################
// DATABASE STUFF

function addPlayer(player) {
    player.save()
        .then(doc => {
            console.log(`Username: ${doc.username} : Player Added To Database`)
        })
        .catch(err => {
            if (err.code == 11000) {
                console.log(`Error: ${err.code} :: Player Already Exists`);
            } else {
                console.error(err.code)
            }
        });
}

function getPlayer(passed_username) {
    Player.find({
            username: passed_username
        })
        .then(doc => {
            console.log(`Username: ${passed_username} : Player Found In Database`)
            return doc
        })
        .catch(err => {
            console.error(err);
        });
}

function updatePlayer(player) {
    pass
}

// ###################################################



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

        if (!CONNECTED_PLAYER_LIST.includes(connectedplayer)) {
            CONNECTED_PLAYER_LIST.push(connectedplayer); // only add the new player if they do not exist in the list.
            //console.log(`New player joined: player count:  ${PLAYER_LIST.length}`);
        }
    });


    // 
    client.on('playerposition', function updatePlayerPosition(packet) {
        ClientNameToPlayerObject(packet[0]).tilePosition = packet[1];
    });

    client.on('disconnect', function () {
        CONNECTED_PLAYER_LIST.splice(ClientIDToPlayerListIndex(client.id), 1);
    });
});

// takes in a given ID and finds the index for that player, returns -1 if not found.
function ClientIDToPlayerListIndex(id) {
    for (var i = 0; i < CONNECTED_PLAYER_LIST.length; i++) {
        if (CONNECTED_PLAYER_LIST[i].id == id) {
            return i;
        }
    }

    return -1;
}

// takes in a player name and will return the object connected to that name.
// returns -1 if object was not found in list.
function ClientNameToPlayerObject(username) {
    for (var i = 0; i < CONNECTED_PLAYER_LIST.length; i++) {
        if (CONNECTED_PLAYER_LIST[i].username == username) {
            return CONNECTED_PLAYER_LIST[i];
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


    for (var i = 0; i < CONNECTED_PLAYER_LIST.length; i++) {
        var packet = [CONNECTED_PLAYER_LIST[i].username, CONNECTED_PLAYER_LIST[i].tilePosition];
        io.emit("playerPostionsFromServer", packet);
    }



}, 1000 / 25);

// --------------------------------------------------------------