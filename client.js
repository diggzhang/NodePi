// socket.io-client setup
var io = require('socket.io-client');
var serverUrl = 'http://localhost:8080/hellopi';
var conn = io.connect(serverUrl);

// system info, for get networkinterfaces and hostname
var os = require('os');
var hostname = os.hostname();
var ifaces = os.networkInterfaces();

// Padding IP Address Need To Send
var paddingIP = "";
for (var dev in ifaces) {
	var alias = 0;
	ifaces[dev].forEach(function (details) {
		if (details.family == 'IPv4' && details.ip != '127.0.0.1') {
			paddingIP = details.address;
		}
	});
};
console.log('Padding to Send: ' + paddingIP);

conn.on('connect', function () {
    console.log('Find Server! :D'); 

    var localIpAddress = paddingIP;
    conn.emit('piCall', localIpAddress, function (res, data) {
        console.log('piCall server return : ' + res);
    });
});

conn.on('reconnect', function () {
    console.log('Attempt to link server...'); 
});

conn.on('disconnect', function () {
   console.log("Server BreakDown :X"); 
});
