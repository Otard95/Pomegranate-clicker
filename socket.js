/*
 * Export entire file
 */

module.exports = function(server){

/*
 * Initilize socket.io
 */

var io = require('socket.io')(server);

var SOCKET_LIST = {};
var CLIENT_LIST = {
  containsPlayer: function(id) {
    for (var c in this) {
      if (this[c].uId == id) {
        return true;
      }
      return false;
    }
  }
};

var client = function() {
  var c = {
    uId: null,
    cookieProfileChech: false
  }
  return c;
}

/*
 * Initilize game class
 */

var game = require('./game.js');

io.on('connection', function(socket) {

  // On Connection
  console.log('Socket connected | ID: ' + socket.id);

  SOCKET_LIST[socket.id] = socket;
  CLIENT_LIST[socket.id] = client();

  socket.emit('welcome', {msg: 'Hey!'});


   /// ######## Implement safeguards!!!
  socket.on('hasPlayer', function(data) {
    if ( CLIENT_LIST[socket.id].cookieProfileChech == true ) {

      // Client tries to connect to a player profile more than once
      // This should never happen so kick the user
      kick(socket, 'Client atempted to connect to a player profile more than once. '+
                   'If you feel this is an error please contact us.');
     console.log(socket.id + ' exceeded player profile linking attempts');

    } else if( CLIENT_LIST.containsPlayer(data.id) ) { // Player allready loged in

      socket.emit('hasPlayer', {status: false, msg: 'You are allready loged in'});
      CLIENT_LIST[socket.id].cookieProfileChech = true;
      console.log(socket.id + ' player allready loged in');

    } else if ( game.players[data.id] == null ){ // False player id

      socket.emit('hasPlayer', {status: false, msg: 'ivalid player'});
      CLIENT_LIST[socket.id].cookieProfileChech = true;
      console.log(socket.id + ' player id invalid');

    } else {

      CLIENT_LIST[socket.id].uId = data.id;
      CLIENT_LIST[socket.id].cookieProfileChech = true;
      socket.emit('hasPlayer', {status: true, player: game.players[data.id].getStriped() });
      console.log(socket.id + ' player link successful');

    }
  });


  /// ######## Implement safeguards!!!
  socket.on('userCreate', function(data) {

    // Make sure socket has unique id | _NLFk0yege0-O0_OAAAB
    var newid = game.newId();
    while(game.players[newid] != null) {
      newid = game.newId();
    }

    // try creating the user. return bool if successful inform user of userId
    if( game.newPlayer(newid, data.name) ) {

      socket.emit('userCreate', {status: true, id: newid});
      console.log('Socket ' + socket.id + ' created user: (' + newId + ')' + data.name);

    } else {

        socket.emit('userCreate', {status: false, msg: 'Username allready in use.'});

    }
  });

  // disconnect client
  socket.on('disconnect', function() {

    console.log('Socket disconnected | ID: ' + socket.id);
    delete SOCKET_LIST[socket.id];
    delete CLIENT_LIST[socket.id];
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
