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

if (db.iplogs.count() != 0) {
    console.log("booting delete "+ db.iplogs.count() +" logs")
    db.iplogs.remove();
    db.connect('./db',['iplogs']);
}

app.get('/nodepi', function (req, res) {

    var useripa = req.connection.remoteAddress;
    var useripb = req.header('x-forwarded-for') || req.connection.remoteAddress;
    console.log("get user IP form header : " + useripa + " " + useripb)

    var servObj = db.iplogs.find({ip: useripa});

    res.json({
        "extip": servObj[0].extip,
        "localip": servObj[0].ip
    });
});

pi.on('connection', function (socket) {

    var ipNeedToSave = {};
    socket.on('piCall', function (piIP, callback) {

        ipNeedToSave = {
            "hostname": piIP.hostName,
            "extip": piIP.exipAddress,
            "ip": piIP.ipAddress,
            "clientId": piIP.clientId
        };

        console.log("client ID:" + piIP.clientId);

        console.log("save: " + ipNeedToSave.extip + " => "
            + ipNeedToSave.ip);
        db.iplogs.save(ipNeedToSave);
        callback("Server_GetPi");
    });

    socket.on('disconnect', function () {
        console.log("one pi disconnected X <:3 )~ ");
        console.log("delete: " + ipNeedToSave.extip + ' => '
            + ipNeedToSave.ip + ' | ' + ipNeedToSave.clientId);
        db.iplogs.remove({
            clientId: ipNeedToSave.clientId
        }, false);
        console.log("drop one IP");
    });
});

server.listen(8080);
console.log("server running on port 8080");
