const PORTNO = '2000';

var express = require('express');

var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv,{});
var database = require('./server/js/database');
var Player = require('./server/js/models/player');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use(express.static(__dirname + '/client'));


serv.listen(PORTNO);
console.log(`Server Started on ${PORTNO}`);

// ###################################################

var SOCKET_LIST = {};
io.sockets.on('connection', function(socket) {

    socket.id = Math.random();
    socket.x = 0
    socket.y = 0
    SOCKET_LIST[socket.id] = socket;

    console.log(`${socket.id} socket connection`);
});

setInterval(function() {
    for(var i in SOCKET_LIST[i]){
        let socket = SOCKET_LIST[i];
        socket.x++;
        socket.y++;
        socket.emit('newPostion',{
            x:socket.x,
            y:socket.y
        });
    }
},1000/25);



// --------------------------------------------------------------


