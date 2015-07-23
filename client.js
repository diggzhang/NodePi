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
var paddgingExtIP = "";

async.series({
	paddingIP: function (callback) {

		for (var dev in ifaces) {
			ifaces[dev].forEach(function (details) {
				if (details.family == 'IPv4' && details.ip != '127.0.0.1') {
					paddingIP = details.address;
				}
			});
		};

		callback(null, paddingIP);
	},

	paddgingExtIP: function (callback) {

		extip.fetch(function (ip) {
			paddgingExtIP = ip;
			callback(null, paddgingExtIP)
		});

	}
}, function (err, result) {
	// socket.io


	conn.on('connect', function () {

		console.log('Find Server! :D');

		var localIpAddress = {
			"hostName" : hostname,
			"ipAddress" : result.paddingIP,
			"exipAddress": result.paddgingExtIP
		};

		conn.emit('piCall', localIpAddress, function (res, data) {
			console.log('piCall server return : ' + res);
		});

		conn.on('reconnect', function () {
			console.log('Attempt to link server...');
		});

		conn.on('disconnect', function () {
			console.log("Server BreakDown :X");
		});


	});

});


