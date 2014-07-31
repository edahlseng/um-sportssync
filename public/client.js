//var socket = io.connect("http://127.0.0.1:8080");
var socket = io.connect("http://um-sportssync.media.mit.edu:10014");
var currentUsername;

function join(username)
{
	currentUsername = username;
	console.log("Attempting to join as:", username);
	socket.emit("join", username);
}

function sendMessage(message, type)
{
	console.log("sending message: ");
	console.dir(message);
	var data = {
		message: message,
		type: type
	}
	socket.emit("chatMessage", data);
}

// function sendBet(bet)
// {
// 	console.log("sending bet: " + bet);
// 	var data = {
// 		message: bet,
// 		type: type
// 	}
// 	socket.emit("chatMessage", [bet, "bet"]);
// 	//later code to do other betting shit
// }
var started = false;

socket.on("joined", function (info) {
	if (info.errorCode == 0)
	{
		displayLoggedIn(info.username);
		console.log(info.users.length, "users logged in");
	}
});

socket.on("groupUpdate", function (info) {
	console.log(info);
});

socket.on("chatMessage", function (response) {
	console.log(response);
	updateStream(response);
});

socket.on("start", function (data) {
	started = true;
	document.getElementById('videoPlayer').start();
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



