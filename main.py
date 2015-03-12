from flask import Flask, render_template, Response, request, jsonify
from flask.ext.basicauth import BasicAuth
import gevent
import gevent.monkey
from gevent.pywsgi import WSGIServer
from gevent import sleep
import json
gevent.monkey.patch_all()

app = Flask(__name__)


configFile = open('config')
config = json.load(configFile)
app.config['BASIC_AUTH_USERNAME'] = config['username']
app.config['BASIC_AUTH_PASSWORD'] = config['password']
basic_auth = BasicAuth(app)


@app.route('/content')
def content():
	return render_template('index.html')

@app.route('/update', methods=['POST'])
def update():
	pl = request.json['playlist']
	playlist = []

	for each in pl:
		playlist.append(each.encode('ascii'))

	open('playlist', 'w').write(str(playlist))
	return

@app.route('/settings')
@basic_auth.required
def settings():
	return render_template('settings.html')

@app.route('/sse')
def sse():
	return Response(stream(), mimetype='text/event-stream')

def stream():
	while True:
		try:
			playlist = eval(open('playlist', 'r').readline())
		except SyntaxError:
			playlist = ['/static/videos/blank.mp4']
			
		yield 'data: %s\n\n' % json.dumps({'playlist': playlist})

		gevent.sleep(1)

if __name__ == '__main__':
	#app.run(host='0.0.0.0', port=8080, debug=True)
    http_server = WSGIServer(('0.0.0.0', 8080), app)
    http_server.serve_forever()