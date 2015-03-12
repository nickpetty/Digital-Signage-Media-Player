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
if (fileExists(currentList[currentPOS])) {
	playMedia(currentList[currentPOS]);	
} else {
	playNext();
};

player.addEventListener('ended', playNext, false);


function playNext() {
	//if (player.ended) {
		if (JSON.stringify(currentList) == sessionStorage.playlist) { // if false, new playlist is available, start at 0
			if (currentPOS < currentList.length-1) { // move to next video in list, or start at 0
				currentPOS = currentPOS+1;
				if (fileExists(currentList[currentPOS])) {
					playMedia(currentList[currentPOS]);				
				} else {
					playNext(); // Skip
				};

			} else {
				if (fileExists(currentList[0])) {
					console.log('playing first');
					currentPOS = 0;
					playMedia(currentList[0]);				
				} else {
					currentPOS = 0;
					playNext();
				}

			};
		} else {
			currentList = JSON.parse(sessionStorage.playlist);
			if (fileExists(currentList[0])) {
				currentPOS = 0;
				playMedia(currentList[0])				
			} else {
				currentPOS = 0;
				playNext();
			};

		};
	//};
};

function playMedia(media) {
	var extn = media.substr(media.length - 4).toLowerCase();
	if (extn == '.jpg' || extn == 'jpeg') {
		displayPicture(media);
	};

	if (extn == '.mp4') {
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

function displayPicture(picture) {
	console.log(picture);
    var img = document.getElementById("viewer");
    img.src = picture;   
    img.style.display="block";

    setTimeout(function(){
        img.style.display="none";
        console.log('playing next');
    	playNext(); 
    	console.log('done');
    }, 5000); 

};


