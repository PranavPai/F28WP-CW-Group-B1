const PORTNO = '2000';
const MONGODB_SERVER = 'mongodb.benjaminjacobreji.xyz:27017';
const MONGODB_DATABASE = 'mmorpg';

var CONNECTED_PLAYER_LIST = []; // list of playerDataObjects

// Import modules
const express = require('express');
const mongoose = require('mongoose');

var User = require('./server/js/models/user');
// Create a new instance of Express
const app = express();


// Connect to the database
const mongodbURI = `mongodb://${MONGODB_SERVER}/${MONGODB_DATABASE}?authSource=${MONGODB_DATABASE}`;
const mongodbOptions = {
    user: "nodejs",
    pass: "happyMongoDB2019",
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};

mongoose.connect(mongodbURI, mongodbOptions)
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
    User.find({
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
    client.on('connectedusername', function initPlayer(username, tilePos) {
        client.id = Math.random();
        connectedplayer = new Player(client.id);
        connectedplayer.username = username;
        connectedplayer.tilePosition = tilePos
        if (!CONNECTED_PLAYER_LIST.includes(connectedplayer)) {
            CONNECTED_PLAYER_LIST.push(connectedplayer); // only add the new player if they do not exist in the list.
        }
    });
 
    client.on('playerposition', function updatePlayerPosition(packet) {
        ClientNameToPlayerObject(packet[0]).tilePosition = packet[1];
    });

    client.on('disconnect', function () {
        disconectedPlayerIndex = ClientIDToPlayerListIndex(client.id)
        // send an update message to all clients that this player has disconected.
        io.emit("PlayerDisconected", CONNECTED_PLAYER_LIST[disconectedPlayerIndex]);
        CONNECTED_PLAYER_LIST.splice(disconectedPlayerIndex);
    });

    // packet[0] is the player pos that is getting attacked.
    // packet[1] is the amount that we are damaging the player by, before defence is used.
    client.on('PlayerAttackOtherPlayer', function (packet) {
        // packet[0] == playerPos, packet[1] == damageAmount, packet[2] == the player who attacked
        player = getPlayerFromPos(packet[0]);
        if (packet[1] != undefined) {
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

// ##############################################################################################
//    FUNCTIONS
// #############################################################################################

// send and update of all players currently online to all players online.
function UpdateAllConnectedClients() {
    // loop though all players in the list and emit their information to the clients
    for (var i = 0; i < CONNECTED_PLAYER_LIST.length; i++) {
        var packet = [CONNECTED_PLAYER_LIST[i].username, CONNECTED_PLAYER_LIST[i].tilePosition];
        io.emit("playerPostionsFromServer", packet);
    }
}

// takes in a players position then finds and returns that player from the list. 
// returns -1 if not found
function getPlayerFromPos(playerPos) {
    for (var index = 0; index < CONNECTED_PLAYER_LIST.length; index++) { // is the player in the list
        if (CONNECTED_PLAYER_LIST[index].tilePosition[0] == playerPos[0] && CONNECTED_PLAYER_LIST[index].tilePosition[1] == playerPos[1]) {
            console.log("FOUND");
        }
    }
    // else the player is not in the list and we need to return an error (-1)
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

// takes in a given ID and finds the index for that player, returns -1 if not found.
function ClientIDToPlayerListIndex(id) {
    for (var i = 0; i < CONNECTED_PLAYER_LIST.length; i++) {
        if (CONNECTED_PLAYER_LIST[i].id == id) {
            return i;
        }
    }
    return -1;
}

// Chat Function
function onClientSendMessage(messageFromClient) {
    formatedMessage = client.username + ": " + messageFromClient;
    gameSocket.emit('chatMessageFromServer', formatedMessage);
}

// --------------------------------------------------------------