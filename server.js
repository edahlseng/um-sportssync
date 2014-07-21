var nodeStatic = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
var staticFileServer = new nodeStatic.Server('./public');

require('http').createServer(function (request, response) {
	request.addListener('end', function() {
		//
		// Serve files!
		//
		staticFileServer.serve(request, response);
	}).resume();
}).listen(8080);
console.log('Server running on 8080');




// Using socket.io for audio and text base
// ========================


// var io = require('socket.io').listen();

// io.sockets.on('connection', function (socket) {
// 	// our other events...
// 	socket.on('setPseudo', function (data) {
// 		socket.set('pseudo', data);
// 	});

// 	socket.on('message', function (message) {
// 		socket.get('pseudo', function (error, name) {
// 			var data = {'message' : message, pseudo : name};
// 			socket.broadcast.emit('message', data);
// 			console.log("user " + name + " send this : " + message);
// 		})
// 	})
// });
