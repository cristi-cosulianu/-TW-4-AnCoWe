const http = require('http');
const url = require('url');
const fs = require('fs');
const game = require('./game.js');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	
	var parsedURL = url.parse(req.url, true);
	var pathname = parsedURL.pathname;
	var queryParams = parsedURL.query;
	
	switch(pathname) {
		case "/game":
			res.setHeader('Content-Type', 'text/text');
			
			var ret = game.processRequest(queryParams);
			res.statusCode = ret.code;
			res.write(ret.message);
			
			res.end();
      break;
	}
	
	res.statusCode = 405;
	res.end('Method not allowed!');
});

server.listen(port, hostname, () => {
	console.log('Server running at http://' + hostname + ':' + port + '/');
});