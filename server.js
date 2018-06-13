// Dependencies required for the server to run 
const http = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const qs = require('querystring');
const game = require('./server/game.js');
const options = require('./server/options.js');
const login = require('./server/login.js');
const signup = require('./server/signup.js');
const scores = require('./server/scores.js');
const sessionController = require('./server/sessionController.js').sessionController;

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
    switch(req.method) {
        case 'GET':
            processGETRequest(req, res);
            break;
        
        case 'POST':
            processPOSTRequest(req, res);
            break;
        
        default:
            res.statusCode = 405;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end();
    }
});

function processGETRequest(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Url parsing for procesing
    var parsedURL = url.parse(req.url, true);
    var pathname = parsedURL.pathname;
    var params = parsedURL.query;
    
    switch (pathname) {
        case '/options':
            res.setHeader('Content-Type', 'text/text');

            options.processRequest(params, (code, message) => {
                res.statusCode = code;
                console.log("Options status code: " + code);
                res.end(message);
            });

            break;
            
        case '/scores':
            res.setHeader('Content-Type', 'application/json');

            scores.processRequest(params, (code, message) =>{
                res.statusCode = code;
                console.log("scores status code : " + res.statusCode + " message: " + message);
                res.end(message);

            });
            break;    
            // maybe we will use it later
            /*case '/marvel':
                res.setHeader('Content-Type', 'text/text');
                
                var ret = marvel.processRequest(params);
                res.statusCode = ret.code;
                res.end(ret.message);
                
                break;*/
        default:
            var filename = '.' + pathname;
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
                    throw err;
                }
            });
    }
}

function processPOSTRequest(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Url parsing for procesing
    var parsedURL = url.parse(req.url, true);
    var pathname = parsedURL.pathname;
    
    var body = '';
    req.on('data', chunk => {
        body += chunk;
    });
    
    req.on('end', () => {
        var params = qs.parse(body);
        
        switch (pathname) {    
            case '/login':
                res.setHeader('Content-Type', 'text/text');

                login.processRequest(params, (code, message) => {
                    res.statusCode = code;
                    console.log("Login status code: " + code);
                    res.end(message);
                });

                break;
                
            case '/signup':
                res.setHeader('Content-Type', 'text/text');

                signup.processRequest(params, (code, message) => {
                    res.statusCode = code;
                    console.log("SignUp status code: " + res.statusCode);
                    res.end(message);
                });

                break;
            default:
                res.statusCode = 405;
                res.end();
        }
    });
}

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
        var parsedURL = url.parse(msg, true);
        var pathname = parsedURL.pathname;
        var params = parsedURL.query;

        switch (pathname) {
            case '/game':
                var ret = game.processRequest(params);
                if (ret === 'finish') {
                    this.emit('finish', true);
                    return;
                } else if (ret === 'start') {
                    this.emit('start', true);
                }
                if (params['action'] == 'get-data') {
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

getMimeType = function (pathname) {
    return mime.lookup(pathname);
}
