const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
var mime = require('mime-types');
const game = require('./server/game.js');
const marvel = require('./server/marvel.js');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	
	var parsedURL = url.parse(req.url, true);
	var pathname = parsedURL.pathname;
	var queryParams = parsedURL.query;
	
	switch(pathname) {
		/*case '/game':
      console.log(queryParams['action']);
			res.setHeader('Content-Type', 'text/text');
			
			var ret = game.processRequest(queryParams);
			res.statusCode = ret.code;
			res.end(ret.message);

			break;
		*/
		case '/marvel':
			res.setHeader('Content-Type', 'text/text');
			
			var ret = marvel.processRequest(queryParams);
			res.statusCode = ret.code;
			res.end(ret.message);
			
			break;
	}
	
	var filename = '.' + pathname;
	//console.log(filename);
	
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

const socket = require('socket.io');
const io = socket(server);

io.on('connection', function(socket) {
  console.log('a user connected');
  
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  
  socket.on('game', function(msg) {
  	var parsedURL = url.parse(msg, true);
		var pathname = parsedURL.pathname;
		var queryParams = parsedURL.query;
		
		switch(pathname) {
			case '/game':
				var ret = game.processRequest(queryParams);
				if(queryParams['action'] == 'get-data') {
					// console.log(ret.message);
					io.emit('data', ret.message);
				}
				else
					io.emit('fweef', ret.message);

				break;
		}
  });
});

server.listen(port, hostname, () => {
	console.log('Server running at http://' + hostname + ':' + port + '/');
});

getMimeType = function(pathname) {
	return mime.lookup(pathname);
}