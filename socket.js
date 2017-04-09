/*
 * Export entire file
 */

module.exports = function(server){

/*
 * Initilize socket.io
 */

var io = require('socket.io')(server);

var SOCKET_LIST = {};
var CLIENT_LIST = {};

/*
 * Initilize game class
 */

//var game = require('./game.js');

io.on('connection', function(socket) {

  console.log('Socket connected | ID: ' + socket.id);

  SOCKET_LIST[socket.id] = socket;
  // CLIENT_LIST[socket.id] = ???

  // disconnect client
  socket.on('disconnect', function() {
    console.log('Socket disconnected | ID: ' + socket.id);
    delete SOCKET_LIST[socket.id];
    // game.remove(socket.id);
  });

});


/*
 * Socket.io functions
 */

function kick(socket, reason) {
  socket.emit('kick', {msg: reason});
  socket.disconnect();
}

/*
 * Game Clock
 */

var time  = {
  last: +new Date(),
  delta: function() { // Returns the time in seconds since last frame
    r = ((+new Date()) - this.last) / 1000;
    this.last = +new Date();
    return r;
  }
}


// recursive function to clone an object. If a non object parameter
// is passed in, that parameter is returned and no recursion occurs.

function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }

    return temp;
}





} // ### END EXPORT
