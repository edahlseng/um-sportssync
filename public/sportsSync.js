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
		liHtml = "<div class='author'><img class='icon chatIcon' src={userThumb}><span class='name'>{userName}</span><div class='videoTimeStamp'>1:15</div></div><div class='message {className}'>{message}</div>";
	
	liHtml = liHtml.replace("{userThumb}", "'" + userThumb + "'")
		.replace("{userName}", user);

	//handle chat message types:
	if (type === "chat") {
		liHtml = liHtml.replace("{message}", message)
			.replace("{className}", "");	
	}
	if (type === "bet") {
		var betHtml = user + " bets: <span>" + message + "</span>",
			d = new Date(),
			uniqueID = d.getTime();
		liHtml = liHtml.replace("{message}", betHtml)
			.replace("{className}", "bet");	
		liHtml += '<div class="betInteraction"><i class="fa fa-thumbs-up fa-lg betYes"></i><i class="fa fa-thumbs-down fa-lg betNo"></i><span id="'+ uniqueID +'"></span></div>'
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

function startReplay() {
	var maxTime = document.getElementById('videoPlayer').currentTime
	var minTime = Math.max(0, maxTime - 15);

	
}
