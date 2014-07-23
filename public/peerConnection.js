navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
var RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate;
var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;

// notes:
// this is from a stack overflow post:
//
// I was having trouble with essentially the same thing recently, and the best advice I got from someone else on here was to create a version of my program in which I manually copied and pasted the SDP and ICE info from one "peer" (i.e., browser tab) to another and vice versa.

// By doing this, I realized several things:

// 1. You must call the addStream method of the peer connection object before you attempt to create any offers/answers.

// 2. Upon calling the createOffer or createAnswer method, the ICE candidates for that client are instantly generated. However, once you've sent the ICE info to the other peer, you cannot actually set the ICE info until after a remote description is set (by using the received offer/answer).

// 3. Make sure that you are properly encoding all info about to be sent on the wire. In JS, this means that use should use the encodeURIComponent function on all data about to be sent on the wire. I had an issue in which SDP and ICE info would sometimes be set properly and sometimes not. It had to do with the fact that I was not URI-encoding the data, which led to any plus signs in the data being turned into spaces, which messed everything up.

// Anyway, like I said, I recommend creating a version of your program in which you have a bunch of text areas for spitting out all the data to the screen, and then have other text areas that you can paste copied data into for setting it for the other peer.
// Doing this really clarified the whole WebRTC process, which honestly, is not well explained in any documents/tutorials that I've seen yet.

// Good luck, and let me know if I can help anymore.

function AudioPeerConnection(socket, options) {
	var self = this;
	this.socket = socket;
	this.ready = false;
	this.readyForCandidates = false;
	this.peerAudio = document.getElementById('peerAudio');
	this.pendingIceCandidates = [];
	this.callWhenReady = options.callWhenReady;
	this.answerWhenReady = options.answerWhenReady;
	this.offer = options.offer;

	this.peerConnection = null;

	this.send = function (message) {
		// this function is meant to abstract away the details of communicating with the server
		console.log('sending', message.type);
		this.socket.emit("audioMessage", message);
	}

	// create the PeerConnection object
	servers = null; // we have the option here to add STUN and TURN servers if needed....not sure yet what exactly those are for
	options = null; // we might need to set an option here in order to make Chrome and Firefox work together...
	this.peerConnection = new RTCPeerConnection(servers, options);
	console.log("Created peer connection object");
	this.peerConnection.onicecandidate = function (e) {
		if (e.candidate) {
			self.send({"type" : "iceCandidate", "data" : e.candidate});
		}
	}
	this.peerConnection.onaddstream = function (e) {
		console.log('yay, we received a stream!');
		self.peerAudio.src = URL.createObjectURL(e.stream);
	}

	// start the media stream
	// get the media that we are requesting
	console.log("Requesting local stream");
	navigator.getUserMedia({audio : true}, function (stream) {
		console.log("Received local stream");
		self.peerConnection.addStream(stream);
		self.ready = true;
		self.onReady();
		},
		function(error) {
			console.log("getUserMedia error: ", error);
		}); // use the built in error handler in the future

	this.call = function () { // eventually add the username that we want to send to as a function parameter
		if (!this.ready)
		{
			console.error('The Connection is not ready to make a call.');
			return;
		}

		console.log("Starting call");

		constraints = {mandatory: {OfferToReceiveAudio: true}};
		this.peerConnection.createOffer(function (offer) {
			self.peerConnection.setLocalDescription(offer);
			self.send({"type" : "offer", "data" : offer});
		}, this.errorHandler, constraints);

	}

	this.receiveOffer = function(offer) {
		console.log("attempting to accept offer");

		offer = new RTCSessionDescription(offer);
		this.peerConnection.setRemoteDescription(offer);
		this.readyForCandidates = true;
		this.receivePendingIceCandidates();

		if (!this.ready)
		{
			console.error('The Connection is not ready to make a call.');
			return;
		}

		// send back an answer
		constraints = {mandatory: {OfferToReceiveAudio: true}};
		this.peerConnection.createAnswer(function (answer) {
			self.peerConnection.setLocalDescription(answer);
			self.send({"type" : "answer", "data" : answer});
		}, this.errorHandler, constraints);
	}

	this.receiveAnswer = function (answer) {
		console.log("Answer from remotePeerConnection: ");
		answer = new RTCSessionDescription(answer);
		this.peerConnection.setRemoteDescription(answer);
		this.readyForCandidates = true;
		this.receivePendingIceCandidates();
	}

	this.receiveIceCandidate = function (candidate) {
		// don't set ice candidates until remote description has been sent
		if (!this.readyForCandidates)
		{
			this.pendingIceCandidates.push(candidate);
			return;
		}
		candidate = new RTCIceCandidate(candidate);
		this.peerConnection.addIceCandidate(candidate);
	}

	this.receivePendingIceCandidates = function () {
		for (var i = 0; i < this.pendingIceCandidates.length; i++)
		{
			this.receiveIceCandidate(this.pendingIceCandidates[i]);
		}
		this.pendingIceCandidates = [];
	}

	this.hangup = function() {
		console.log("Ending call");
		this.peerConnection.close();
		this.peerConnection = null;
	}

	this.errorHandler = function(e) { // change to onError
		console.error(e);
	}

	this.onReady = function () {
		if (this.callWhenReady) {
			this.call();
		}

		if (this.answerWhenReady) {
			this.receiveOffer(this.offer);
		}
	}

}

var theConnection;
var pendingIceCandidates = [];

function handleAudioMessage (message) {
	if (message.type === 'offer') {
		console.log('trying to make this work');
		options = {"answerWhenReady" : true, "offer" : message.data};
		theConnection = new AudioPeerConnection(socket, options);
		console.log('receiving offer');
		receivePendingIceCandidates();
	} else if (message.type === 'answer') {
		console.log('receiving answer');
		theConnection.receiveAnswer(message.data);
	} else if (message.type === 'iceCandidate') {
		console.log('received candidate');
		// check if the connection has been made, and if not then store the candidate
		if (!theConnection) {
			pendingIceCandidates.add(message.data);
		}
		else {
			theConnection.receiveIceCandidate(message.data);
		}
		
	}
}

function receivePendingIceCandidates() {
	for (var i = 0; i < pendingIceCandidates.length; i++)
	{
		theConnection.receiveIceCandidate(pendingIceCandidates[i]);
	}
	pendingIceCandidates = [];
}

function createConnection() {
	options = {"callWhenReady" : true};
	theConnection = new AudioPeerConnection(socket, options);
}