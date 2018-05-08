// Dependencies required for the server to run 
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
var mime = require('mime-types');
const game = require('./server/game.js');
const options = require('./server/options.js');
// const marvel = require('./server/marvel.js'); // don't delete this comment
const randomUuid = require('uuid/v4');
//Running on localhost
const hostname = '127.0.0.1';
//Server port 
const port = 3000;
//Creating the server and the function for request processing
const server = http.createServer((req, res) => {
	res.statusCode = 200;
    // Url parsing for procesing
	var parsedURL = url.parse(req.url, true);
	var pathname = parsedURL.pathname;
	var queryParams = parsedURL.query;
	
	switch(pathname) {
		case '/options':
			res.setHeader('Content-Type', 'text/text');

			var ret = options.processRequest(queryParams);
			res.statusCode = ret.code;
			res.end(ret.message);

			break;
			// maybe we will use it later
		/*case '/marvel':
			res.setHeader('Content-Type', 'text/text');
			
			var ret = marvel.processRequest(queryParams);
			res.statusCode = ret.code;
			res.end(ret.message);
			
			break;*/
	}
	
	var filename = '.' + pathname;
    // Returning requested files with AJAX and mime-type module
	fs.readFile(filename,function (err, data) {
		if(!err) {
			res.writeHead(200, { 'Content-Type': getMimeType(filename), 'Content-Length': data.length });
			res.write(data);
			res.end();
		} else if(err.code === 'ENOENT') {
			res.statusCode = 404;
			res.end('Page not found!');
		} else {
			throw err;
		}
	});
});

//Code for `socket.io` integration
const socket = require('socket.io');
const io = socket(server);

io.on('connection', function(socket) {
  console.log('a user connected');
  //Generating unique `uuid` token that will be passed between server and client
  var uuid = randomUuid();
  socket.on('disconnect', function() {
  	dataFile = 'server/data/' + uuid + '.txt';
  	fs.exists(dataFile, function(exists) {
  		if(exists) fs.unlinkSync(dataFile);
  	});
  	
    console.log('user ' + uuid + ' disconnected');
  });
  
  socket.on('get-uuid', function(msg) {
		socket.emit('uuid', uuid);
  });
  //Preparing the socket for `game` event
  socket.on('game', function(msg) {
  	var parsedURL = url.parse(msg, true);
		var pathname = parsedURL.pathname;
		var queryParams = parsedURL.query;
		
		switch(pathname) {
			case '/game':
				var ret = game.processRequest(queryParams);
				if(queryParams['action'] == 'get-data') {
					this.emit('data', ret);
				}

				break;
		}
  });
});
//Tell the server to begin to listen for clients
server.listen(port, hostname, () => {
	console.log('Server running at http://' + hostname + ':' + port + '/');
});

getMimeType = function(pathname) {
	return mime.lookup(pathname);
}