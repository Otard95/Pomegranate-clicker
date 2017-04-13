/*
 *¨Initilize socket.io
 */

var socket = io();

socket.on('hasPlayer', function(data) {
  console.log(data);
});

socket.on('userCreate', function(data) {

  console.log('[userCreate] status: ' + data.status);

  if (data.status) {
    game.id = data.id;
    game.me = data.player;
    var d = new Date();
    d.setTime(d.getTime() + (30*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = "pId=" + data.id + ";" + expires + ";path=/";
  } else {
    // Inform user that the name is taken
  }

});

socket.on('buyUpgrade', function(data) {

  console.log('[buyUpgrade] status: ' + data.status);

  if (data.status) {
    game.me = data.player;
  } else {
    // Display fail msg to user
  }

});

var game = {
  id: null,
  me: {
    seeds: 0,
    sps: 0,
    upgrades: {
      deseeder: {
        lvl: 0,
        cost: 0
      },
      backyardShrub: {
        lvl: 0,
        cost: 0
      },
      backyardTree: {
        lvl: 0,
        cost: 0
      }
    }
  },
  dom: {
    seeds: null,
    sps: null,
    updrades: {
      deseeder: {
        base: null,
        lvl: null,
        cost: null
      },
      backyardShrub: {
        base: null,
        lvl: null,
        cost: null
      },
      backyardTree: {
        base: null,
        lvl: null,
        cost: null
      }
    }
  }
};

$(document).ready(function() {

  game.dom.seeds = $('#seedCounter');
  game.dom.sps = $('#spsCounter');
  $.each(game.dom.upgrades, function(key, val) {

  })

});
