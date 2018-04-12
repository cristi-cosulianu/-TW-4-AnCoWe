const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
var mime = require('mime-types');
const game = require('./server/game.js');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	
	var parsedURL = url.parse(req.url, true);
	var pathname = parsedURL.pathname;
	var queryParams = parsedURL.query;
	
	switch(pathname) {
		case '/game':
			res.setHeader('Content-Type', 'text/text');
			
			var ret = game.processRequest(queryParams);
			res.statusCode = ret.code;
			res.write(ret.message);
			
			res.end();
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

server.listen(port, hostname, () => {
	console.log('Server running at http://' + hostname + ':' + port + '/');
});

getMimeType = function(pathname) {
  return mime.lookup(pathname);
}
