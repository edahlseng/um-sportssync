var express = require('express');

var app = express();

// render the main page
app.get('/', function (request, response) {
	response.sendfile('public/index.html');
});

// serve up static resources
app.use(express.static(__dirname + '/public'));

var port = process.argv[2] || 8080;
var server = app.listen(port, function() {
	console.log('Server running on %d', port);
});



// Using socket.io for text, replays, gifs, audio connection setup
// ===============================================================

var usersLoggedIn = [];
var startedTime;

var io = require('socket.io').listen(server);

// Called on a new connection from the client.  The socket object should be referenced for future communication with an explicity client
io.sockets.on('connection', function (socket) {
	// The username for this socket.
	//var user = User();
	var UserUsername;

	socket.on('audioMessage', function (message) {
		console.log('Received audio message: ', message.type);
		console.log('sending from ', UserUsername);
		// for a real app, would be room only (not broadcast), and probably only to one specific individual
		socket.broadcast.emit('audioMessage', message);
	});

	socket.on("join", function (username) {
		console.log(username, "wants to join");

		// remove UserUsername from the list if it already exists
		if (UserUsername)
		{
			usersLoggedIn.pop(UserUsername);
		}

		UserUsername = username;
		if (true) // could check here for username verification
		{
			// add to list of usernames here
			usersLoggedIn.push(UserUsername);

			response = {'errorCode' : 0, 'username' : UserUsername, 'users' : usersLoggedIn};
			socket.emit("joined", response);

			console.log(usersLoggedIn, "are logged onto the server");

			socket.broadcast.emit("gropUpdate", username + " has joined the server.");
		}
		else
		{
			// send a request denied message.  disconnect socket
		}
	});

	socket.on('start', function (data) {
		startedTime = Date.now(); // current time in milliseconds
		io.sockets.emit('start', data);

		// start timers for canned inputs
		setTimeout(travis1, 9000);
	});

	socket.on('currentTime', function (data) {
		data.timeElapsed = (Date.now() - startedTime) / 1000;
		socket.emit('currentTime', data);
	});

	socket.on('chatMessage', function (data) {
		// Message passed by a client to ther server with the intent of broadcasting to the chatroom
		// optionally check here for user verification
		if (UserUsername) {
			console.log("broadcasting message:", data.message);
			var response = {
				user: UserUsername,
				messageType: data.type,
				message: data.message
			}
			io.sockets.emit("chatMessage", response);
		}
	});

	socket.on("disconnect", function() {
		io.sockets.emit("groupUpdate", UserUsername + " has left the server");
		usersLoggedIn.pop(UserUsername);
	});


});

// functions that send off canned inputs
function travis1() {
	var response = {
				user: "trich",
				messageType: "chat",
				message: "Check out #79's muscles..."
			}
	io.sockets.emit("chatMessage", response);

	setTimeout(travis2, 2000);
}

function travis2() {
	var response = {
				user: "trich",
				messageType: "chat",
				message: "They're almost as big as mine!"
			}
	io.sockets.emit("chatMessage", response);

	setTimeout(lip1, 15000);
}

function lip1() {
	var response = {
				user: "lip",
				messageType: "chat",
				message: "Get back to work!"
			}
	io.sockets.emit("chatMessage", response);
}