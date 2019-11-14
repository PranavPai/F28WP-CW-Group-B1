var socket = io();

var random = Math.random();

var happy = function() {
    socket.emit('happy because',{
        reason: 'its my dday' + random
    });
}

socket.on('serverMsg', function(data) {
    console.log(data.msg);
});