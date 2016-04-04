//"use strict";
//https://github.com/benfoxall/phantomjs-webserver-example/blob/master/server.js
var DT = new Date();
var Q = require('q');
var FS = require('fs');
var FUN = require('./node_custom/fun.js');

var APP = {
	"sites_server": 'http://api.allevents.nyc',
	"path": '/www/go-nyc',
	"path_in": '',
	"path_out": ''
};

var SITES = [];

var CASPER = require('casper').create({
	waitTimeout: 10000,
	stepTimeout: 1000,
	retryTimeout: 100,
	verbose: true,
	exitOnError: false,
	//logLevel: 'debug',
	log_statuses: ['warning', 'error', 'info','log','debug'],
	viewportSize: {
		width: 1440,
		height: 900
	},
	pageSettings: {
		"userAgent": 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.10 (KHTML, like Gecko) Chrome/23.0.1262.0 Safari/537.10',
		"loadImages": true,
		"loadPlugins": false,
		"webSecurityEnabled": false,
		"ignoreSslErrors": true
	},
	onWaitTimeout: function(timeout, step) {
		// CASPER.log('onWaitTimeout\': "' + (CASPER.site ? CASPER.site.link : '(site not defined)') + '" : ' + timeout + 'ms', "error");
		// CASPER.clear();
		// CASPER.page.stop();
	},
	onStepTimeout: function(timeout, step) {
		// CASPER.log('onStepTimeout\': "' + (CASPER.site ? CASPER.site.link : '(site not defined)') + '" : ' + timeout + 'ms', "error");
		// CASPER.clear();
		// CASPER.page.stop();
	},
	onResourceReceived: function(timeout, step) {
		//CASPER.log( 'onResourceReceived\': "' + ( CASPER.site ? CASPER.site.link : '(site not defined)' ) + '" : ' + timeout + 'ms', "info" );
	},
	clientScripts: [
		APP.path + "/remote_assets/vendor/jquery.js",
		APP.path + "/remote_assets/vendor/underscore.js",
		APP.path + "/remote_assets/vendor/sugar.js",
		APP.path + "/remote_assets/custom/uu.js",
		APP.path + "/remote_assets/custom/site.js"
	]
});
// events
CASPER.on("page.error", function(error, notes) {
	CASPER.console.error('		Error: ' + JSON.stringify(error, null, " ") + '\n' + JSON.stringify(notes[0], null, " "), 'error');
});
CASPER.on('http.status.404', function(resource) {
	CASPER.console.error('		404 error: ' + resource.url, 'error');
});
CASPER.on('http.status.500', function(resource) {
	CASPER.console.error('		500 error: ' + resource.url, 'error');
});
CASPER.on('complete.error', function(err) {
	CASPER.die("		Complete callback has failed: " + err);
});
// helpers
CASPER.console = {};
CASPER.console.html = '';
CASPER.console.date = '';
CASPER.iteration = '0';
if (CASPER.cli.has("iteration")) {
	CASPER.iteration = CASPER.cli.get("iteration");
}
CASPER.console.write = function(message, status) {
	// start each day
	if (CASPER.console.date != DT.getFullYear() + '.' + FUN.pad(DT.getMonth()+1) + '.' + FUN.pad(DT.getDate())) {
		CASPER.console.html = '';
		CASPER.console.date = DT.getFullYear() + '.' + FUN.pad(DT.getMonth()+1) + '.' + FUN.pad(DT.getDate());
	}
	// skip banal debug logs
	if (status=='debug') {
		return false;
	}
	// format
	if (typeof message == 'object') {
		message = JSON.stringify(message, null, ' ').replace(/[\n\r\t]/g,'');
	} else if (typeof message == 'function') {
		message = JSON.stringify(message, null, ' ').replace(/[\n\r\t]/g,'');
	} else if (typeof message == 'string') {
		message = message.trim();
		message = message.replace(/[\n\r\t]/g,'');
	} else {
		message = '('+(typeof message)+')';
	}
	// log
	// to FILE
	var action = (status=='error'||status=='info') ? status : 'log';
	if (status=='warning') {
		action = 'warn';
	}
	CASPER.console.html = '<script>console.'+action+'(\''+message.replace(/\'/g, '\\\'')+'\');</script>\n' + CASPER.console.html;
	FS.write(
		'public/console/logs.html', // + ' ' + FUN.pad(DT.getHours()) + ':' + FUN.pad(DT.getMinutes()) + ':' + FUN.pad(DT.getSeconds()) + ':' + DT.getMilliseconds()
		CASPER.console.html,
		'w'
	);
	// to CONSOLE
	if (status == 'error') {
		message = message;
	} else if (status == 'warning') {
		message = message;
	} else if (status == 'info') {
		message = message;
	} else if (status == 'debug') {
		message = message;
	}
	CASPER.echo(message, status.toUpperCase());
};
CASPER.console.log = function(message) {
	CASPER.console.write(message, 'log');
}
CASPER.console.info = function(message) {
	CASPER.console.write(message, 'info');
}
CASPER.console.warn = function(message) {
	CASPER.console.write(message, 'warning');
}
CASPER.console.error = function(message) {
	CASPER.console.write(message, 'error');
}

CASPER.on('run.complete', function() {
	//CASPER.console.warn('Test completed');
	//CASPER.exit();
});
CASPER.on('remote.message', function(msg) {
	CASPER.console.log('		' + msg, 'error');
});
// CASPER.on('remote.callback', function(requestData, request) {
// 	request.abort(requestData);
// 	return false;
// });

CASPER.site = {};
CASPER.rrs = [];
CASPER.pro = {};
CASPER.pro.written = 0;
CASPER.start();
CASPER.pro.respond = function(req, res) {

	CASPER.site = {};
	CASPER.site.id = CASPER.pro.written+1;
	CASPER.site.url = req.post.url;
	CASPER.echo('START '+CASPER.site.id);
	
	// RUN
	CASPER.echo('= '+CASPER.site.url);
	CASPER.thenOpen(CASPER.site.url,function(){

		CASPER.waitFor(function() {
			return CASPER.site.data = CASPER.evaluate(function(site) {
				var done = $('#casperJsDone').get(0) ? $('#casperJsDone').get(0).innerText : '';
				console.log('watching...', done);
				try { 
					var data = JSON.parse(done);
					console.log('DONE');
					console.log(data);
					return data;
				} catch(e) {
					return false;
				}
			}, CASPER.site);
		}, function(data) {
				// SUCCESS
				CASPER.echo('OK');
				res.statusCode = 200;
				res.write(JSON.stringify([{id:CASPER.iteration,title:CASPER.site.data.test}]));
				res.close();
			
		}, function(data) {
				// FAIL
				CASPER.echo('no');
				res.statusCode = 200;
				res.write(JSON.stringify([{id:CASPER.iteration,title:'no :('}]));
				res.close();
		}, 
		11000 );

			
	});
	
	// DONE
	CASPER.run(function(){
		// current
		CASPER.rrs[CASPER.pro.written] = null;
		CASPER.pro.written++;
		CASPER.echo('DONE '+CASPER.pro.written);
		CASPER.clear();
		// next
		if (CASPER.rrs[CASPER.pro.written]) {
			var request = CASPER.rrs[CASPER.pro.written].req;
			var response = CASPER.rrs[CASPER.pro.written].res;
			console.log('respond() from casper.run')
			CASPER.pro.respond(request,response);
		}
	});

};
 



// SERVE
var server = require('webserver').create(),
		system = require('system'),
		port  =  2080;
var service = server.listen(port, function(request, response) {
	if (request.method == 'POST' && request.post.url){		
		// next
		CASPER.rrs.push({req:request,res:response});
		
		// restart
		if ((CASPER.rrs.length-CASPER.pro.written)==1) {
			console.log('respond() from server.listen')
			CASPER.pro.respond(request,response);
		}
		
	} else {
		// serve index
		response.statusCode = 200;
		response.setHeader('Content-Type', 'text/html; charset=utf-8');
		response.write(FS.read('index.html'));
		response.close();
	}

});
if(service) {
	console.log("CasperJS started - http://localhost:" + server.port);
}










