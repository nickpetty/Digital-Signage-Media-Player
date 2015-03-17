from flask import Flask, render_template, Response, request, jsonify
from flask.ext.basicauth import BasicAuth
import gevent
import gevent.monkey
from gevent.pywsgi import WSGIServer
from gevent import sleep
import json
from os import listdir, stat
from os.path import isfile, join

gevent.monkey.patch_all()

app = Flask(__name__)


configFile = open('config')
config = json.load(configFile)
app.config['BASIC_AUTH_USERNAME'] = config['username']
app.config['BASIC_AUTH_PASSWORD'] = config['password']
basic_auth = BasicAuth(app)


@app.route('/content')
def content():
	return render_template('content.html')

@app.route('/update', methods=['POST'])
def update():
	pl = request.json['playlist']
	playlist = []

	for each in pl:
		tmp = []
		for i in each:
			if type(i) == int:
				tmp.append(i)
			else:
				tmp.append(i.encode('ascii'))
		playlist.append(tmp)
	open('playlist', 'w').write(str(playlist))
	return

@app.route('/settings')
@basic_auth.required
def settings():
	mypath = 'static/content/'
	files = [ f for f in listdir(mypath) if isfile(join(mypath,f)) ]
	return render_template('settings.html', content=files)

@app.route('/sse')
def sse():
	return Response(stream(), mimetype='text/event-stream')

def stream():
	while True:
		try:
			playlist = eval(open('playlist', 'r').readline())
			if stat('playlist').st_size <= 2:
				playlist = [['/static/content/blank.mp4', 0]]
		except SyntaxError:
			playlist = [['/static/content/blank.mp4',0]]
			
		yield 'data: %s\n\n' % json.dumps({'playlist': playlist})

		gevent.sleep(1)

if __name__ == '__main__':
    http_server = WSGIServer(('0.0.0.0', 8080), app)
    http_server.serve_forever()