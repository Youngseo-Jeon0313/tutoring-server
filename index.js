var http = require('http');
var hostname = '127.0.0.1';
var port = 8080;

const server = http.createServer(function(req,res){
    const path = req.url;
    const method = req.method;
    if (path ==='/어떤 경로'){
        
    }
});

server.listen(port, hostname);

console.log('server 시작이요')