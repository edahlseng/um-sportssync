function setBodyHeight() {
	//get window height
	var w = window,
	    d = document,
	    e = d.documentElement,
	    g = d.getElementsByTagName('body')[0],
	    headerHeight = document.getElementById('header').clientHeight,
	    x = w.innerWidth || e.clientWidth || g.clientWidth,
	    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
	    x = x + 10,
	    y = y - headerHeight; 

	body = document.getElementById('body');
	body.style.height = y + "px";
	body.style.height = x + "px";
}

// function sidebarToggle () {
// 	var sidebar = document.getElementById('sidebar'),
// 		main = document.getElementById('main'),
// 		stream = document.getElementById('stream');

// 	if (sidebar.getAttribute('class') == "open") {
// 		sidebar.style.width = "2%";
// 		sidebar.className = "closed";
// 		main.style.width = '97%';
// 		stream.style.padding = '0 30px';
// 	}
// 	else if (sidebar.getAttribute('class') == "closed") {
// 		sidebar.style.width = "33%";
// 		sidebar.className = "open";
// 		main.style.width = '66%';
// 		stream.style.padding = '0 10px';
// 	}
// }

function inputToggle (elementId) {
	var input = document.getElementById(elementId);
	// console.log(input);

	if (input.getAttribute('class') == "open") {
		input.style.height = "0px";
		input.className = "closed";
	}
	else if (input.getAttribute('class') == "closed") {
		input.style.height = "35px";
		input.className = "open";
	}
}

function submitPost (val) {
	console.log("chat: " + val);
	sendMessage(val, "chat");
	document.getElementById("postInputBox").value = "";
}

function submitBet (val) {
	console.log("bet: " + val);
	sendMessage(val, "bet");
	// document.getElementById("betInputBox").value = "";
}

function updateStream (response) {
	console.log(response);
	var user = response.user,
		userThumb = "http://pldb.media.mit.edu/face/" + user,
		type = response.messageType,
		message = response.message,
		li = document.createElement("li"),
		liHtml = "<div class='author'><img class='icon chatIcon' src={userThumb}><span class='name'>{userName}</span><div class='videoTimeStamp'>1:15</div></div><div class='message {messageClassName}'>{message}</div>";
	
	liHtml = liHtml.replace("{userThumb}", "'" + userThumb + "'")
		.replace("{userName}", user);

	//handle chat message types:
	if (type === "chat") {
		liHtml = liHtml.replace("{message}", message)
			.replace("{messageClassName}", "");	
	}
	if (type === "bet") {
		var betHtml = user + " bets: <span>" + message + "</span>",
			d = new Date(),
			uniqueID = d.getTime();
		liHtml = liHtml.replace("{message}", betHtml)
			.replace("{messageClassName}", "bet");	
		liHtml += '<div class="betInteraction"><i class="fa fa-thumbs-up fa-lg betYes"></i><i class="fa fa-thumbs-down fa-lg betNo"></i><span id="'+ uniqueID +'"></span></div>'
	}
	if (type === "replay")
	{
		var replayHTML = '<i class="fa fa-retweet"></i>';
		liHtml = liHtml.replace("{message}", replayHTML).replace("{messageClassName}", "replay");	
	}


	console.log (liHtml);

	var ul = document.getElementById("streamList"),
		stream = document.getElementById("stream");
	li.style.opacity = '0';
	li.innerHTML = liHtml;
	ul.appendChild(li);
	stream.scrollTop = stream.scrollHeight;
	li.style.opacity = 1; //set height to inherit for effect
	//countdown http://keith-wood.name/countdown.html
	var t = new Date();
	t.setSeconds(t.getSeconds() + 15);
	// $("#countdown").countdown({until: t, compact: true});
	$("#" + uniqueID).countdown({until: t,
		compact: true, 
	    onTick: highlightLast5}); 
	     
	function highlightLast5(periods) { 
	    if ($.countdown.periodsToSeconds(periods) === 5) { 
	        $(this).addClass('countdown-highlight'); 
	    } 
	}
}

window.addEventListener('resize', function(event){
	// console.log("resizing");
  	setBodyHeight();
});

window.onload = function(event){
	// console.log ("loaded");
	setBodyHeight();

	//set video width
	var videoWidth = 1600,
		videoHeight = 800,
		mainWidth = document.getElementById('main').clientWidth,
		video = document.getElementById('videoPlayer'),
		videoContainer = document.getElementById('videoContainer'),
		addPost = document.getElementById('addPost');

	video.style.width = mainWidth - 150 + 'px';
	addPost.style.width = mainWidth - 150 + 'px';
	videoContainer.style.width = mainWidth - 150 + 'px';
	video.style.height = (videoHeight*(mainWidth - 150)/videoWidth) + 'px';

	//event listeners

	// document.getElementById('sidebarToggle').onclick = function(event){
	// 	console.log("clicked");
	// 	sidebarToggle();
	// };

	document.getElementById('commentButton').onclick = function(event){
		// console.log("clicked commentButton");
		inputToggle("postInput");
	};

	document.getElementById("postInputBox").addEventListener("keydown", function(e) {
	    if (!e) { var e = window.event; }
	    if (e.keyCode == 13) { 
	    	e.preventDefault(); //prevent enter from happening
	    	submitPost(document.getElementById("postInputBox").value); 
	    	document.getElementById("postInputBox").value = "";
	    }
	}, false);

	document.getElementById('betButton').onclick = function(event){
		// console.log("clicked betButton");
		inputToggle("betInput");
	};

	document.getElementById("betInputBox").addEventListener("keydown", function(e) {
	    if (!e) { var e = window.event; }
	    if (e.keyCode == 13) { 
	    	e.preventDefault(); //prevent enter from happening
	    	submitBet(document.getElementById("betInputBox").value);
	    	document.getElementById("betInputBox").value = ""; 
	    }
	}, false);

	//have a thing here that hides the default loading screen
	document.getElementById('loading').style.opacity = 0;
	setTimeout( function() {
		document.getElementById('loading').style.height = '0px';
	}, 1000);
};

function joinAsUser(username)
{
	join(username);

	// remove the currentUser id from the previously selected icon
	var selectedIcon = document.querySelector('.currentUserIcon');
	if (selectedIcon) {
		selectedIcon.className = "icon";
	}
}

function displayLoggedIn(username)
{
	// set the currentUser id to the proper element
	var userIcon = document.getElementById(username + "Icon");
	userIcon.className += " currentUserIcon"
}

// ******** Replay stuff ******

function minMaxSliderController (lowerBound, upperBound, valueChangedCallback, minCallback, maxCallback) {
	this._lowerBound = lowerBound;
	this._upperBound = upperBound;
	this._min = lowerBound;
	this._max = upperBound;
	this._value = lowerBound;

	this._trackBlock = document.getElementById('sliderTrack');
	this._minBlock = document.getElementById('sliderMin');
	this._valueBlock = document.getElementById('sliderPosition');
	this._maxBlock = document.getElementById('sliderMax');

	this.valueChangedCallback = valueChangedCallback;
	this.minCallback = minCallback;
	this.maxCallback = maxCallback;

	this.updateMinBlockPosition = function () {
		var basePosition = this._trackBlock.offsetLeft - (this._minBlock.clientWidth / 2.0);
		var percentage = (this._min - this._lowerBound) / (this._upperBound - this._lowerBound);
		var availableWidth = this._trackBlock.clientWidth - (this._maxBlock.clientWidth / 2.0 + this._valueBlock.clientWidth + this._minBlock.clientWidth / 2.0);
		this._minBlock.style.left = (basePosition + (percentage * availableWidth)) + "px";
	}

	this.updateMaxBlockPosition = function () {
		var basePosition = this._trackBlock.offsetLeft + (this._minBlock.clientWidth / 2.0) + this._valueBlock.clientWidth;
		var percentage = (this._max - this._lowerBound) / (this._upperBound - this._lowerBound);
		var availableWidth = this._trackBlock.clientWidth - (this._maxBlock.clientWidth / 2.0 + this._valueBlock.clientWidth + this._minBlock.clientWidth / 2.0);
		this._maxBlock.style.left = (basePosition + (percentage * availableWidth)) + "px";
	}

	this.updateValueBlockPosition = function () {
		var basePosition = this._trackBlock.offsetLeft + (this._minBlock.clientWidth / 2.0);
		var percentage = (this._value - this._lowerBound) / (this._upperBound - this._lowerBound);
		var availableWidth = this._trackBlock.clientWidth - (this._maxBlock.clientWidth / 2.0 + this._valueBlock.clientWidth + this._minBlock.clientWidth / 2.0);
		console.log(this._value);
		this._valueBlock.style.left = (basePosition + (percentage * availableWidth)) + "px";
	}

	this.setMin = function (desiredMin) {
		var newMin = Math.max(this._lowerBound, desiredMin);
		newMin = Math.min(newMin, this._max);
		this._min = newMin;
		this._value = Math.max(this._min, this._value);
		
		// update visual appearance
		this.updateMinBlockPosition();
		this.updateValueBlockPosition();
	}

	this.setMax = function (desiredMax) {
		var newMax = Math.min(this._upperBound, desiredMax);
		newMax = Math.max(newMax, this._min);
		this._max = newMax;
		this._value = Math.min(this._max, this._value);
		
		// update visual appearance
		this.updateMaxBlockPosition();
		this.updateValueBlockPosition();
	}

	this.setValue = function (desiredValue) {
		var newValue = Math.min(desiredValue, this._max);
		newValue = Math.max(newValue, this._min);
		this._value = newValue;
		
		// eventually just use one callback and an or statement
		if (desiredValue <= this._min) {
			this.onMinReached();
		}
		if (desiredValue >= this._max) {
			this.onMaxReached();
		}

		// update visual appearance
		this.updateValueBlockPosition();
	}

	this.min = function () {
		return this._min;
	}

	this.max = function () {
		return this._max;
	}

	this.value = function () {
		return this._value;
	}

	this.onValueChanged = function () {
		if (self.valueChangedCallback) {
			self.valueChangedCallback(this._value);
		}
	}

	this.onMinReached = function () {
		if (self.minCallback) {
			self.minCallback();
		}
	}

	this.onMaxReached = function () {
		if (self.maxCallback) {
			self.maxCallback();
		}
	}

	self = this;
	this.tracking = "";
	this.startingPropertyValue;
	this.startingMouseLocationX;
	this.valuesPerPixels;

	// TODO:
	// take care of small bugs like if you release your mouse outside of the browser window
	//
	this.setupDrag = function (e) {
		self.startingMouseLocationX = e.clientX;
		var availableWidth = this._trackBlock.clientWidth - (this._maxBlock.clientWidth / 2.0 + this._valueBlock.clientWidth + this._minBlock.clientWidth / 2.0);
		self.valuesPerPixels = (self._upperBound - self._lowerBound) / availableWidth;
		window.addEventListener("mousemove", self.mouseMove);
		window.addEventListener("mouseup", self.mouseUp);
	}

	this.minMouseDown = function (e) {
		self.startingPropertyValue = self._min;
		self.tracking = "min";
		self.setupDrag(e);
	}

	this.maxMouseDown = function (e) {
		self.startingPropertyValue = self._max;
		self.tracking = "max";
		self.setupDrag(e);
	}

	this.valuePositionMouseDown = function (e) {
		self.startingPropertyValue = self._value;
		self.tracking = "value";
		self.setupDrag(e);
	}

	this.mouseMove = function (e) {
		e.preventDefault(); // stop the weird text selection stuff
		var dragDistance = e.clientX - self.startingMouseLocationX;
		switch (self.tracking)
		{
			case "min":
				self.setMin((dragDistance * self.valuesPerPixels) + self.startingPropertyValue);
				break;
			case "max":
				self.setMax((dragDistance * self.valuesPerPixels) + self.startingPropertyValue);
				break;
			case "value":
				self.setValue((dragDistance * self.valuesPerPixels) + self.startingPropertyValue);
				break;
		}
		self.onValueChanged();
	}

	this.mouseUp = function (e) {
		self.mouseMove(e); // make sure we make any last adjustments that might be necessary
		self.tracking = "";
		self.startingPropertyValue = null;
		self.startingMouseLocationX = null;
		self.valuesPerPixels = null;
		window.removeEventListener("mousemove", self.mouseMove);
		window.removeEventListener("mouseUp", self.mouseUp);
	}

	this._minBlock.addEventListener("mousedown", this.minMouseDown);
	this._maxBlock.addEventListener("mousedown", this.maxMouseDown);
	this._valueBlock.addEventListener("mousedown", this.valuePositionMouseDown);

	this.updateMinBlockPosition();
	this.updateValueBlockPosition();
	this.updateMaxBlockPosition();
	this.onValueChanged();
}

var sliderController;
var replayPlayer;

function setPlayerCurrentTime(newValue) {
	replayPlayer.currentTime = newValue;
}

function startReplay() {
	var maxTime = document.getElementById('videoPlayer').currentTime
	var minTime = Math.max(0, maxTime - 15);

	replayPlayer = document.getElementById('videoPlayer');
	replayPlayer.addEventListener("play", replayPlayed);
    replayPlayer.addEventListener("pause", replayPaused);
    replayPlayer.addEventListener("timeupdate", replayTimeUpdate);
    replayPlayer.pause();
	sliderController = new minMaxSliderController(minTime, maxTime, setPlayerCurrentTime, pausePlayer, pausePlayer);
	document.getElementById('replayControlsContainer').style.visibility = "visible";
	document.getElementById('replaySteps').style.visibility = "visible";
}

function pausePlayer() {
	console.log('reached');
	replayPlayer.pause();
}

function sendReplay() {
	// send the replay
	sendMessage({"startTime" : sliderController.min(), "endTime" : sliderController.max()}, "replay");

	replayPlayer.removeEventListener("play", replayPlayed);
	replayPlayer.removeEventListener("pause", replayPaused);
	replayPlayer.removeEventListener("timeupdate", replayTimeUpdate);
	replayPlayer = null;
	document.getElementById('replayControlsContainer').style.visibility = "hidden";
	document.getElementById('replaySteps').style.visibility = "hidden";
	sliderController = null;
	syncVideo();
}

function replayPlayed() {
	document.getElementById('playSymbol').style.visibility = "hidden";
	document.getElementById('pauseSymbol').style.visibility = "visible";
}

function replayPaused() {
	document.getElementById('playSymbol').style.visibility = "visible";
	document.getElementById('pauseSymbol').style.visibility = "hidden";
}

function replayTimeUpdate() {
	sliderController.setValue(replayPlayer.currentTime);
}

function togglePlayPause() {
	if (replayPlayer.paused) {
		replayPlayer.play();
	} else {
		replayPlayer.pause();
	}
}

