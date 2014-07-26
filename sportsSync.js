function setBodyHeight() {
	//get window height
	var w = window,
	    d = document,
	    e = d.documentElement,
	    g = d.getElementsByTagName('body')[0],
	    headerHeight = document.getElementById('header').clientHeight,
	    x = w.innerWidth || e.clientWidth || g.clientWidth,
	    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
	    // x = x - margin*2 - padding*2,
	    y = y - headerHeight; 

	body = document.getElementById('body');
	body.style.height = y + "px";
}

function sidebarToggle () {
	var sidebar = document.getElementById('sidebar'),
		main = document.getElementById('main'),
		stream = document.getElementById('stream');

	if (sidebar.getAttribute('class') == "open") {
		sidebar.style.width = "2%";
		sidebar.className = "closed";
		main.style.width = '98%';
		stream.style.padding = '0 30px';
	}
	else if (sidebar.getAttribute('class') == "closed") {
		sidebar.style.width = "33%";
		sidebar.className = "open";
		main.style.width = '67%';
		stream.style.padding = '0 10px';
	}
}

function commentToggle () {
	var postInput = document.getElementById('postInput');
	console.log(postInput);

	if (postInput.getAttribute('class') == "open") {
		postInput.style.height = "0px";
		postInput.className = "closed";
	}
	else if (postInput.getAttribute('class') == "closed") {
		postInput.style.height = "35px";
		postInput.className = "open";
	}
}

function submitPost (val) {
	console.log(val);
	document.getElementById("textInput").value = "";
}

window.addEventListener('resize', function(event){
	console.log("resizing");
  	setBodyHeight();
});

window.onload = function(event){
	console.log ("loaded");
	setBodyHeight();

	//set video width
	var videoWidth = 1600,
		videoHeight = 800,
		mainWidth = document.getElementById('main').clientWidth,
		video = document.getElementById('videoPlayer'),
		addPost = document.getElementById('addPost');

	video.style.width = mainWidth - 150 + 'px';
	addPost.style.width = mainWidth - 150 + 'px';
	video.style.height = (videoHeight*(mainWidth - 150)/videoWidth) + 'px';

	//event listeners

	document.getElementById('sidebarToggle').onclick = function(event){
		console.log("clicked");
		sidebarToggle();
	};

	document.getElementById('commentButton').onclick = function(event){
		console.log("clicked commentButton");
		commentToggle();
	};

	document.getElementById("textInput").addEventListener("keydown", function(e) {
	    if (!e) { var e = window.event; }
	    if (e.keyCode == 13) { 
	    	e.preventDefault(); //prevent enter from happening
	    	submitPost(document.getElementById("textInput").value); 
	    }
	}, false);

	//have a thing here that hides the default loading screen
	document.getElementById('loading').style.opacity = 0;
	setTimeout( function() {
		document.getElementById('loading').style.height = '0px';
	}, 1000);
	

};
