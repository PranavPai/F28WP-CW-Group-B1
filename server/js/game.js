var io;
var gameSocket;
var db;


var Player = function (id) {
    var self = {
        tilePosition: [-1, -1],
        username: "defaultplayer",
        id: id
    }
    return self;
}

/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 * @param mdb The MongoDB Connection
 */
exports.initGame = function (sio, socket, mdb) {
    io = sio;
    gameSocket = socket;
    db = mdb;
    gameSocket.emit('connected', {
        message: "You are connected!"
    });

    // Host Events
    gameSocket.on('hostCreateNewGame', hostCreateNewGame);
    gameSocket.on('hostRoomFull', hostPrepareGame);
    gameSocket.on('hostCountdownFinished', hostStartGame);
    gameSocket.on('hostNextRound', hostNextRound);

    // Player Events
    gameSocket.on('playerJoinGame', playerJoinGame);
    gameSocket.on('playerAnswer', playerAnswer);
    gameSocket.on('playerRestart', playerRestart);
}

/// ###################################################
// FUNCTIONS

// From Client
function onClientSendMessage(messageFromClient) {
    formatedMessage = client.username + ": " + messageFromClient;
    gameSocket.emit('chatMessageFromServer', formatedMessage);
}

function onGetClientPosition(positionpacket) {
    ClientNameToPlayerObject(packet[0]).tilePosition = packet[1];
}

// ###################################################

var PLAYER_LIST = []; // list of playerDataObjects


// takes in a player name and will return the object connected to that name.
// returns -1 if object was not found in list.
function ClientNameToPlayerObject(username) {
    for (var i = 0; i < PLAYER_LIST.length; i++) {
        if (PLAYER_LIST[i].username == username) {
            return PLAYER_LIST[i];
        }
    }
    return -1;
}