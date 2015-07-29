var async = require('async');
// socket.io-client setup
var io = require('socket.io-client');
var serverUrl = 'http://localhost:8080/hellopi';
var conn = io.connect(serverUrl, {
                        'multiplex': false,
                        'force new connection': true,
                        'reconnect': true,
                        'reconnection delay': 500,
                        'max reconnection attempts': 10
                      });

// get external ip and local ip
// system info, for get networkinterfaces and hostname
var extip = require('extip');
var os = require('os');
var hostname = os.hostname();
var ifaces = os.networkInterfaces();

// Padding IP Address Need To Send
var paddingIP = "";
var paddingExtIP = "";
var localIpAddress = {};

conn.on('connect', function () {

    console.log('Pi find server :D');

    async.parallel([
        function (callback) {
            for (var dev in ifaces) {
                ifaces[dev].forEach(function (details) {
                    if (details.family == 'IPv4' && details.ip != '127.0.0.1') {
                        paddingIP = details.address;
                    };
                });
            };

            callback(null, paddingIP);
        },

        function (callback) {

            extip.fetch(function (ip) {
                paddingExtIP = ip;
                callback(null, paddingExtIP);
            });
        }

    ], function (err, results) {

        localIpAddress = {
            "hostName": hostname,
            "ipAddress": results[0],
            "exipAddress": results[1],
            "clientId": conn.id
        };

        console.log("Pi connect ID: " + conn.id);

        conn.emit('piCall', localIpAddress, function (res, data) {
            console.log('PiCall server response: ' +  res);
        });
    });

});

conn.on('reconnecting', function () {
    console.log("reconnecting...");
});

conn.on('reconnect', function () {
    console.log('attempt to link server :P');
});

conn.on('disconnect', function () {
    console.log("server disconnect :X");
});
