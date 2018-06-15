// Dependencies required for the server to run 
const http = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const qs = require('querystring');
const game = require('./server/game.js');
const sessionController = require('./server/sessionController.js').sessionController;
const routes = require('./server/routes.js').routes;

// const marvel = require('./server/marvel.js'); // don't delete this comment
const sessionIdGenerator = require('./server/session-id-generator.js');
//Running on localhost
const hostname = '127.0.0.1';
//Server port 
const port = 3000;
const options2 = {
    key: fs.readFileSync('fixtures/keys/key.pem'),
    cert: fs.readFileSync('fixtures/keys/cert.pem')
};

sessionController.deleteAll();
fs.readdir('./server/data', (err, files) => {
    if(err) {
        console.log(err);
    } else {
        files.forEach(file => {
            if(file.endsWith('.txt')) {
                fs.unlinkSync('./server/data/' + file);
            }
        });
    }
});


//Creating the server and the function for request processing
const server = http.createServer(options2, (req, res) => {
    var parsedURL = url.parse(req.url, true);
    var pathname = parsedURL.pathname;
    var params = parsedURL.query;
    
    var body = '';
    req.on('data', chunk => {
        body += chunk;
    });
    
    req.on('end', () => {
        if(body !== '') {
            params = qs.parse(body);
        }
        
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        var routeFound = false;
        routes.forEach(route => {
            if(route.path === pathname && route.method === req.method) {
                route.handler(params, (code, message) => {
                    res.statusCode = code;
                    res.end(message);
                });
                
                routeFound = true;
            }
        });
        
        if(!routeFound) {
            var filename = '.' + pathname;
            if(filename.startsWith('./server') || filename.startsWith('./levels')) {
                res.statusCode = 403;
                res.end();
                return;
            }
            
            // Returning requested files with AJAX and mime-type module
            fs.readFile(filename, function (err, data) {
                if (!err) {
                    res.writeHead(200, {
                        'Content-Type': getMimeType(filename),
                        'Content-Length': data.length
                    });
                    res.write(data);
                    res.end();
                } else if (err.code === 'ENOENT') {
                    res.statusCode = 404;
                    res.end('Page not found!');
                } else {
                    res.statusCode = 405;
                    res.end('Illegal operation!');
                }
            });
        }
    });
});

//Code for `socket.io` integration
const socket = require('socket.io');
const io = socket(server);

io.on('connection', function (socket) {
    console.log('a user connected');

    // don't delete it
     socket.on('disconnect', function () {
         dataFile = 'server/data/' + socket.uuid + '.txt';
         fs.exists(dataFile, function (exists) {
             if (exists) fs.unlinkSync(dataFile);
         });
         
         sessionController.delete(socket.uuid)
            .then(result => {})
            .catch(err => {
                console.log(err);
            });
     });
    
    socket.on('new user', (msg) => {
        socket.uuid = msg;
    });
    
    //Preparing the socket for `game` event
    socket.on('game', function (msg) {
        var params = qs.parse(msg);

        var ret = game.processRequest(params);
        if(ret === 'abandon'){
            this.emit('abandon' , true);
            return;
        }
        if (ret === 'finish') {
            this.emit('finish', true);
            return;
        } else if (ret === 'start') {
            this.emit('start', true);
        }
        if (params['action'] == 'get-data') {
            this.emit('data', ret);
        }
    });
});
//Tell the server to begin to listen for clients
server.listen(port, hostname, () => {
    console.log('Server running at http://' + hostname + ':' + port + '/');
});

getMimeType = function (pathname) {
    return mime.lookup(pathname);
}
