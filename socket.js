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
      if (this[c].pId == id) {
        return true;
      }
      return false;
    }
  }
};

var badChar = ['"', "'", '<', '>'];

var client = function() {
  var c = {
    pId: null,
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

  socket.on('click', function(data) {

    if ( validateInput(data.n, 'number') ) { // Input valid

      var playerId = CLIENT_LIST[socket.id].pId;
      if ( !game.players[playerId].addSeeds ) {

        console.log('[on.click] (' + socket.id + ') Exceeded clicks per secound!');

        kick(socket, 'Client exceeded clicks per secound. ' +
                     'If you feel this is an error please contact us.');

      }

    } else { // invalid input

      console.log('[on.click] (' + socket.id + ') Sendt invalid data!');

      kick(socket, 'Client sendt invalid data. ' +
                   'If you feel this is an error please contact us.');

    }
  });

  socket.on('buyUpgrade', function(data) {

    if ( validateInput(data.name, 'string') ) {

      var playerId = CLIENT_LIST[socket.id].pId;
      if ( game.players[playerId].buyUpgrade(name) ) {
        socket.emit('buyUpgrade', {
                                  status: true,
                                  player: game.player[playerId].getStriped()
                                  });
      } else {
        socket.emit('buyUpgrade', { status: false });
      }

    } else {

      console.log('[on.buyUpgrade] (' + socket.id + ') Sendt invalid data!');

      kick(socket, 'Client sendt invalid data. ' +
                   'If you feel this is an error please contact us.');

    }

  });

  socket.on('hasPlayer', function(data) {

    if( !validateInput(data.id, 'string') ) {

      console.log('[on.hasPlayer] (' + socket.id + ') Sendt invalid data!');

      kick(socket, 'Client sendt invalid data. ' +
                   'If you feel this is an error please contact us.');

    } else if ( CLIENT_LIST[socket.id].cookieProfileChech == true ) {

      console.log('[on.hasPlayer] (' + socket.id + ') Exceeded player profile linking attempts');

      // Client tries to connect to a player profile more than once
      // This should never happen so kick the user
      kick(socket, 'Client atempted to connect to a player profile more than once. '+
                   'If you feel this is an error please contact us.');

    } else if( CLIENT_LIST.containsPlayer(data.id) ) { // Player allready loged in

      socket.emit('hasPlayer', {status: false, msg: 'You are allready loged in'});
      CLIENT_LIST[socket.id].cookieProfileChech = true;
      console.log('[on.hasPlayer] (' + socket.id + ') Player allready loged in');

    } else if ( game.players[data.id] == null ){ // False player id

      socket.emit('hasPlayer', {status: false, msg: 'ivalid player'});
      CLIENT_LIST[socket.id].cookieProfileChech = true;
      console.log('[on.hasPlayer] (' + socket.id + ') Player id invalid');

    } else {

      CLIENT_LIST[socket.id].pId = data.id;
      CLIENT_LIST[socket.id].cookieProfileChech = true;
      socket.emit('hasPlayer', {status: true, player: game.players[data.id].getStriped() });
      console.log('[on.hasPlayer] (' + socket.id + ') Player link successful');

    }
  });

  socket.on('userCreate', function(data) { // Input valid

    if( validateInput(data.name, 'string') ) {

      // Make sure socket has unique id | _NLFk0yege0-O0_OAAAB
      var newid = game.newId(); // creates a unused alphanumerical id
      while(game.players[newid] != null) {
        newid = game.newId();
      }

      // try creating the user. return bool if successful inform user of userId
      if( game.newPlayer(newid, data.name) ) { // returns true if player-name is available

        socket.emit('userCreate', {status: true, id: newid});
        console.log('[on.userCreate] (' + socket.id + ') created user: (' + newid + ')' + data.name);

      } else {

        socket.emit('userCreate', {status: false, msg: 'Username allready in use.'});
        console.log('[on.userCreate] (' + socket.id + ') User creation failed');

      }

    } else { // Input invalid

      console.log('[on.userCreate] (' + socket.id + ') Sendt invalid data!');

      kick(socket, 'Client sendt invalid data. ' +
                   'If you feel this is an error please contact us.');

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


function validateInput(val, type) {
  if (val == null) return false; // Value should not be 'null'
  if (typeof val == 'object') return false; // value should not be an object
  if (typeof val != type) return false; // should not be incorrect type (ofc)

  if (type == 'string') { // A string should not contain bad chars
    for (var i in badChar) {
      if( val.indexOf(badChar[c]) > -1 ) return false;
    }
  }

  return true;
}


} // ### END EXPORT
