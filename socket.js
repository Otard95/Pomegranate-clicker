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
  };
  return c;
};

/*
 * Initilize game class
 */

var Game = require('./_classes/game_class.js'); // get the class
var game = new Game(20); // instantiate class

/*
 * Socket Listners
 */

io.on('connection', function(socket) {

  // On Connection
  console.log('Socket connected | ID: ' + socket.id);

  SOCKET_LIST[socket.id] = socket;
  CLIENT_LIST[socket.id] = client();

  socket.on('hasPlayer', function(data) {

    if( !validateInput(data.id, 'string') ) {

      console.log('[on.hasPlayer] (' + socket.id + ') Sendt invalid data!');

      kick(socket, 'Client sendt invalid data. ' +
                   'If you feel this is an error please contact us.');

    } else if ( CLIENT_LIST[socket.id].cookieProfileChech ) {

      console.log('[on.hasPlayer] (' + socket.id + ') Exceeded player profile linking attempts');

      // Client tries to connect to a player profile more than once
      // This should never happen so kick the user
      kick(socket, 'Client atempted to connect to a player profile more than once.</br>'+
                   'If you feel this is an error please contact us.');

    } else if( CLIENT_LIST.containsPlayer(data.id) ) { // Player allready logged in

      socket.emit('hasPlayer', {
        status: false,
        err: true,
        title: 'Allready logged in',
        msg: 'You seem to be logged in somewhere else. ' +
        'Logout from all sessions and try again.</br>' +
        '<strong>Note:</strong> The session might take a minute to end, ' +
        'so try waiting a bit before retrying.'});

      CLIENT_LIST[socket.id].cookieProfileChech = true;
      console.log('[on.hasPlayer] (' + socket.id + ') Player allready logged in');

    } else if ( game.players[data.id] === undefined ){ // False player id

      socket.emit('hasPlayer', {status: false, err: false});
      CLIENT_LIST[socket.id].cookieProfileChech = true;
      console.log('[on.hasPlayer] (' + socket.id + ') Player id invalid');

    } else {

      CLIENT_LIST[socket.id].pId = data.id;
      CLIENT_LIST[socket.id].cookieProfileChech = true;
      socket.emit('hasPlayer', {status: true, player: game.players[data.id].getStriped() });
      console.log('[on.hasPlayer] (' + socket.id + ') Player link successful');

    }
  });

  socket.on('userCreate', function(data) {

    if( validateInput(data.name, 'string') ) { // Input valid

      // Make sure socket has unique id | _NLFk0yege0-O0_OAAAB
      var newid = game.newId(); // creates a unused alphanumerical id
      while(game.players[newid] !== undefined) {
        newid = game.newId();
      }

      //basick name restriction check
      if (data.name.length < 2) { // name not long enough
        socket.emit('userCreate', {
          status: false,
          err: true,
          msg: 'Your nickname needs to be at least 2 charaters long.'
        });

        console.log('[on.userCreate] (' + socket.id + ') User creation failed | Nick length');

        return;

      } else if (data.name.length > 12) {
        socket.emit('userCreate', {
          status: false,
          err: true,
          msg: "Your nickname can't be more than 12 charaters."
        });

        console.log('[on.userCreate] (' + socket.id + ') User creation failed | Nick length');

        return;

      }

      // try creating the user. return bool if successful inform user of userId
      if( game.newPlayer(newid, data.name) ) { // returns true if player-name is available

        socket.emit('userCreate', {
                                  status: true,
                                  id: newid,
                                  player: game.players[newid].getStriped()
                                });
        CLIENT_LIST[socket.id].pId = newid;
        console.log('[on.userCreate] (' + socket.id + ') created user: (' + newid + ') ' + data.name);

      } else {

        socket.emit('userCreate', {status: false, err: true, msg: 'Username allready in use.'});
        console.log('[on.userCreate] (' + socket.id + ') User creation failed');

      }

    } else { // Input invalid

      console.log('[on.userCreate] (' + socket.id + ') Sendt invalid data!');

      kick(socket, 'Client sendt invalid data. ' +
                   'If you feel this is an error please contact us.');

    }

  });

  socket.on('click', function(data) {

    if ( validateInput(data.n, 'number') ) { // Input valid

      var playerId = CLIENT_LIST[socket.id].pId;
      if ( !game.players[playerId].addSeeds(data.n) ||
           time.since(game.players[playerId].lastClick) < 800 ) {

        console.log('[on.click] (' + socket.id + ') Exceeded clicks per secound!');

        kick(socket, 'Client exceeded clicks per secound. ' +
                     'If you feel this is an error please contact us.');

      } else {

        game.players[playerId].lastClick = (+new Date());
        socket.emit('click', { player: game.players[playerId].getStriped() });

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
      if ( game.upgradePurchase(playerId, data.name) ) {
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

  // disconnect client
  socket.on('disconnect', function() {

    console.log('Socket disconnected | ID: ' + socket.id);
    delete SOCKET_LIST[socket.id];
    delete CLIENT_LIST[socket.id];

  });

});


/*
 * Socket.io functions
 */

function kick(socket, reason) {
  var sId = socket.id;
  var pId = CLIENT_LIST[sId].pId;
  socket.emit('kick', {msg: reason});
  socket.disconnect();
  delete SOCKET_LIST[sId];
  delete CLIENT_LIST[sId];
  game.removePlayer(pId);
}

/*
 * Game Clock
 */

var time  = {
  last: +new Date(),
  delta: function() { // Returns the time in seconds since last frame
    var r = ((+new Date()) - this.last) / 1000;
    this.last = +new Date();
    return r;
  },
  since: function(t) {
    var now = (+new Date());
    return now - t;
  }
};

function validateInput(val, type) {
  if (val === null) return false; // Value should not be 'null'
  if (typeof val == 'object') return false; // value should not be an object
  if (typeof val != type) return false; // should not be incorrect type (ofc)

  if (type == 'string') { // A string should not contain bad chars
    for (var i in badChar) {
      if( val.indexOf(badChar[i]) > -1 ) return false;
    }
  }

  return true;
}


}; // ### END EXPORT
