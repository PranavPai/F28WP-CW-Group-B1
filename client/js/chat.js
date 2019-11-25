function sendMessage() {
    var message = sessionStorage.getItem('username') + ": " + document.getElementById("messageBox").value;
    client.emit('messageFromClient', message);
}

client.on('chatMessageFromServer', function(message) {
    $('#messages').append($('<li>').text(message));
});