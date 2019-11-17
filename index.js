const PORTNO = '2000';

var express = require('express');

var app = express();
var http = require('http').createServer(app);
var database = require('./server/js/database');
var Player = require('./server/js/models/player');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use(express.static(__dirname + '/client'));


http.listen(PORTNO);
console.log(`Server Started on ${PORTNO}`);

// ###################################################

var io = require('socket.io')(http);

var SOCKET_LIST = {};
var PLAYER_LIST = {};

var Player = function (id) {
    var self = {
        tilePosition: [50, 50],
        username: "defaultplayer",
        id: id
    }
    return self;
}

var connectedplayer;

io.on('connection', function (client) {

    client.id = Math.random();
    connectedplayer = new Player(client.id);
    SOCKET_LIST[client.id] = client;

    console.log(`${client.id} socket connection`);
    
    console.log(connectedplayer)

    client.on('connectedusername', function initPlayer(username) {
        connectedplayer.username = username;
        PLAYER_LIST[username] = connectedplayer;
        console.log(connectedplayer)
    });

    client.on("print", function(word) {
        console.log(word)
    })

    client.on('playerposition', function updatePlayerPosition(tilePosition) {
        connectedplayer.tilePosition = tilePosition;
    });

    client.on('disconnect', function () {
        delete SOCKET_LIST[client.id];
    });
});

// console.log(connectedplayer)

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



// --------------------------------------------------------------