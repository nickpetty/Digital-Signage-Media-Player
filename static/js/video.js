window.onload = function() {
    if(!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }
};

sseVideo = new EventSource('/sse');
sseVideo.onmessage = function(message) {
	data = JSON.parse(message.data);
	sessionStorage.setItem('playlist', JSON.stringify(data.playlist));
};

var player = document.getElementById("player");
var currentList = JSON.parse(sessionStorage.playlist);
var currentPOS = 0;

// Play first video in list

if (fileExists(currentList[0][0])) {
	playMedia(currentList[0][0], currentList[0][1]);	
} else {
	playNext();
};

player.addEventListener('ended', playNext, false);



function playNext() {
	if (JSON.stringify(currentList) == sessionStorage.playlist) { // if false, new playlist is available, start at 0
		if (currentPOS < currentList.length-1) { // move to next video in list, or start at 0
			currentPOS = currentPOS+1;	
			if (fileExists(currentList[currentPOS][0])) {
				playMedia(currentList[currentPOS][0], currentList[currentPOS][1]);				
			} else {
				console.log('could not locate ' + currentList[currentPOS][0])
				playNext(); 
			};
		} else {
			playFirst();
		};
	} else {
		currentList = JSON.parse(sessionStorage.playlist);
		playFirst();
	};
};

function playFirst() {
	if (fileExists(currentList[0][0])) {
		currentPOS = 0;
		playMedia(currentList[0][0], currentList[0][1]);				
	} else {
		currentPOS = 0;
		playNext();
	};
};

function playMedia(media, time) {
	var extn = media.substr(media.length - 4).toLowerCase();
	if (extn == '.jpg' || extn == 'jpeg') {
		//console.log('picture');
		displayPicture(media, time);
	};
	if (extn == '.mp4') {
		//console.log('video');
		var img = document.getElementById("viewer");
		img.style.display = "none";
		$("#player").fadeIn("100");
		player.src = media;
		player.play();
	};
};

function fileExists(url) {
    if(url){
        var req = new XMLHttpRequest();
        req.open('HEAD', url, false);
        req.send();
        return req.status==200;
    } else {
        return false;
    }
};

function displayPicture(picture, time) {
    var img = document.getElementById("viewer");
    img.src = picture;
    //img.style.display = "block";
    if (currentList.length-1 != 0) {
    	$("#viewer").fadeIn("100");
    };
  	
    setTimeout(function(){
    	if (currentList.length-1 != 0) {
    		img.style.display = "none";
    	};
    	playNext();
    }, time);   
};


