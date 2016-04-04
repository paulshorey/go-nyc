var fs = require('fs'),
	express = require('express'),
	http = require('http'),
	app = express();

app.set('port', 9999);

app.all('/_deploy', function(req, res) {

	// apply
	var spawn = require('child_process').spawn,
		deploy = spawn('sh', ['_hook/deploy.sh']);

	// done
	res.json(200, {
		message: 'Github Hook received!'
	});

});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

