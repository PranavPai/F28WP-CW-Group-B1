var authio = io()


function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    authio.emit('login', [username,password]);
    sessionStorage.setItem('username', username);
}


function register() {
    var email = document.getElementById("email").value
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    authio.emit('register', [email,username,password]);
    sessionStorage.setItem('username', username);
}

authio.on('loginstatus', function(authorized, reason) {
    if (!authorized) {
        switch(reason) {
            case "IncorrectPassword":
                console.log("IncorrectPassword");
                break;
            case "UserNotFound":
                console.log("UserNotFound");
                break;
            case "UserAlreadyExists":
                console.log("UserAlreadyExists");
                break;
            default:
                console.log(reason);
        }
    } else {
        window.location.href = "../html/game.html"
    }
});