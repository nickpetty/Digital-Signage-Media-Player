$("#aContent")[0].selectedIndex = 0
document.getElementById("add").addEventListener("click", addToPlaylist);
document.getElementById("remove").addEventListener("click", removeFromPlaylist);
document.getElementById("publish").addEventListener("click", publish);

function addToPlaylist() {
	var e = document.getElementById("aContent");
	var selectedContent = e.options[e.selectedIndex].value;
	var playlist = document.getElementById("playlist");
	var opt = document.createElement('option');
	opt.value = selectedContent;
	opt.innerHTML = selectedContent;
	playlist.appendChild(opt);
};

function removeFromPlaylist(){
	var playlist = document.getElementById("playlist");
	playlist.remove(playlist.selectedIndex);
};

function publish(){
	var params = [];
	var playlist = document.getElementById("playlist");
	for (i = 0; i < playlist.length; i++) {
		params.push(['/static/content/' + playlist.options[i].text, 5000]);
	};
	var http = new XMLHttpRequest();
	http.open('POST', '/update', true)
	http.setRequestHeader("Content-type", "application/json");
	http.send(JSON.stringify({"playlist": params}));
};