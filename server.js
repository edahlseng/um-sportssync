var nodeStatic = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
var staticFiles = new nodeStatic.Server('./public');

var port = process.argv[2] || 8080;

var server = require('http').createServer(function (request, response) {
	request.addListener('end', function() {
		//
		// Serve files!
		//
		staticFiles.serve(request, response);
	}).resume();
}).listen(port);
console.log('Server running on %d', port);




// Using socket.io for text, replays, gifs, audio connection setup
// ===============================================================

var usersLoggedIn = [];

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

	socket.on('chatMessage', function (message) {
		// Message passed by a client to ther server with the intent of broadcasting to the chatroom
		// optionally check here for user verification
		console.log("broadcasting message:", message);
		io.sockets.emit("chatMessage", UserUsername + " says " + message);
	});

	socket.on("disconnect", function() {
		io.sockets.emit("groupUpdate", UserUsername + " has left the server");
		usersLoggedIn.pop(UserUsername);
	});


});
