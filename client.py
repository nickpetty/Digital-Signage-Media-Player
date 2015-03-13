import json
import urllib2
import requests

playlist = [['/static/videos/Slide1.JPG', 5000], ['/static/videos/Slide2.JPG', 5000], ['/static/videos/Slide3.JPG', 5000]]
#playlist = ['/static/videos/tst.mp4']

def sendPlaylist(playlist):
	data = {"playlist" : playlist}

	req = urllib2.Request('http://127.0.0.1:8080/update')
	req.add_header('Content-Type', 'application/json')

	response = urllib2.urlopen(req, json.dumps(data))

sendPlaylist(playlist)