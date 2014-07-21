var myHttp = require('http');
var path = require("path");
var url = require("url");
var fileSystem = require("fs");

myHttp.createServer(function (request, response) {
	var my_path = url.parse(request.url).pathname;
	var full_path = path.join(process.cwd(), my_path);
	path.exists(full_path, function(exists){
		if(!exists) {
			response.writeHeader(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found\n");
			response.end();
		}
		else {
			fileSystem.readFile(full_path, "binary", function(err, file) {
				if(err) {
					response.writeHeader(500, {"Content-Type": "text/plain"});
					response.write(err + "\n");
					response.end();
				}
				else {
					response.writeHeader(200);
					response.write(file, "binary");
					response.end();
				}
			});
		}
	});
}).listen(8080);
console.log('Server running on 8080');

// Sockets for chats......
// ========================


var io = require('socket.io').listen();

io.sockets.on('connection'), function (socket) {
	// our other events...
	socket.on('setPseudo', function (data) {
		socket.set('pseudo', data);
	});

	socket.on('message', function (message) {
		socket.get('pseudo', function (error, name) {
			var data = {'message' : message, pseudo : name};
			socket.broadcast.emit('message', data);
			console.log("user " + name + " send this : " + message);
		})
	})
});
