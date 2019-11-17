var client = io();

var random = Math.random();

client.on('serverMsg', function(data) {
    console.log(data.msg);
});

client.emit('connectedusername', ""+ Math.floor(10 * Math.random()));
client.emit("print", "now");

client.on('playerPostionsFromServer', function(pack) {
    console.log(pack);
});

setInterval(function() {
    client.emit('playerposition', player.tilePosition);
}, 1000/25);