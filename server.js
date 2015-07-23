var http = require('http');
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));
var errorhandler = require('errorhandler');
app.use(errorhandler()); // development only
var server = http.createServer(app);

var io = require('socket.io').listen(server);
var pi = io.of('/hellopi');
pi.on('connection', function (socket) {

    socket.on('piCall', function (piIP, callback) {
        console.log("==>" + piIP.hostName);
        console.log("==>" + piIP.ipAddress);
	    console.log("==>" + piIP.exipAddress);
        callback("Server_GetPi");
    });

	
});

server.listen(8080);
console.log("Server Running on Port 8080");
