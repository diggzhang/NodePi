var io = require('socket.io-client');
var serverUrl = 'http://localhost:8080/hellopi';
var conn = io.connect(serverUrl);

conn.on('connect', function () {
    console.log('Find Server! :D'); 

    var localIpAddress = "1.1.1.2";
    conn.emit('piCall', localIpAddress, function (res, data) {
        console.log('piCall server return code: ' + res);
    });
});

conn.on('disconnect', function () {
   console.log("Server BreakDown :X"); 
});
