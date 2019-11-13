const PORTNO = '2000';

var express = require('express');
var database = require('./server/js/database')

var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use(express.static(__dirname + '/client'));

serv.listen(PORTNO);

console.log(`Server Started on ${PORTNO}`);

// --------------------------------------------------------------
var Player = require('./server/js/models/player')

var defaultplayer = new Player({
    firstname: "Default",
    lastname: "Player",
    email: "defaultplayer@test.com",
    username: "defaultplayer",
    password: "default",
    playerposition: {
      x: 50,
      y: 50
    },
    isOnline: true
  });
  
  defaultplayer.save()
    .then(doc => {
      console.log(doc)
    })
    .catch(err => {
      console.error(err.code)
    })