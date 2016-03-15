var fs = require('fs'),
	express = require('express'),
	http = require('http'),
	app = express();

app.set('port', 9999); 

app.all('/_deploy', function(req, res) {

	var spawn = require('child_process').spawn,
		deploy = spawn('sh', ['/_deploy.sh']);

	deploy.stdout.on('data', function(data) {
		console.log('' + data);
	});

	deploy.on('close', function(code) {
		console.log('Child process exited with code ' + code);
	});
	res.json(200, {
		message: 'Github Hook received!'
	});

	fs.writeFile("_log.txt", "Hey there!", function(err) {
		if (err) {
			return console.log(err);
		}
	});
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
