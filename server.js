var http = require('http');
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));

var db = require('diskdb');
db.connect('./db',['iplogs']);

var errorhandler = require('errorhandler');
app.use(errorhandler()); // development only
var server = http.createServer(app);

var io = require('socket.io').listen(server);
var pi = io.of('/hellopi');

pi.on('connection', function (socket) {

    var ipNeedToSave = {};
    socket.on('piCall', function (piIP, callback) {
        console.log("==>" + piIP.hostName);
        console.log("==>" + piIP.ipAddress);
        console.log("==>" + piIP.exipAddress);

        ipNeedToSave = {
            "hostname": piIP.hostName,
            "extip": piIP.exipAddress,
            "ip": piIP.ipAddress
        };

        db.iplogs.save(ipNeedToSave);
        callback("Server_GetPi");
    });

    socket.on('disconnect', function () {
        console.log("One Pi Disconnected");
        db.iplogs.remove({
            extip: ipNeedToSave.extip
        });
    });
});

server.listen(8080);
console.log("Server Running on Port 8080");
