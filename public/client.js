var socket = io.connect("http://127.0.0.1:8080");
var currentUsername;

function join(username)
{
	currentUsername = username;
	socket.emit("join", username);
}

function sendMessage(message)
{
	socket.emit("chatMessage", message);
}

socket.on("joined", function (info) {
	console.log(info);
});

socket.on("groupUpdate", function (info) {
	console.log(info);
});

socket.on("chatMessage", function (message) {
	console.log(message);
});



// stuff for audio
// ======================

// when the user logs in, they will receive a list of everyone who is logged in
// they will then initiate a call to everyone
// everyone else will receive a notification that the user joined the group

socket.on('audioMessage', function (message){
	console.log('Client received message:', message);
	handleAudioMessage(message);
});



