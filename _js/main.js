/*
 * ### Wrap is all in an anonymous function
 */

(function(){

/*
 *¨Initilize socket.io
 */

var socket = io();

socket.on('hasPlayer', function(data) {

  console.log('[on.hasPlayer] status: ' + data.status);

  if(data.status) {

    // Start game
    game.id = cookieGet('pId');
    game.me = data.player;

    console.log(game);

  } else {

    game.preGame.show();

    if(data.err) {
      overlay.set(data.title, data.msg);
    }

  }

});

socket.on('userCreate', function(data) { // server response to userCreate

  console.log('[userCreate] status: ' + data.status);

  if (data.status) {

    game.id = data.id;
    game.me = data.player;
    var d = new Date();
    d.setTime(d.getTime() + (30*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = "pId=" + data.id + ";" + expires + ";path=/";
    game.preGame.hide();

    console.log(game);

  } else if(data.err) {

    game.preGame.msg('bad', data.msg);

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

socket.on('click', function(data) {

  game.me = data.player;
  game.updateSeeds();

});

socket.on('kick', function(data) {
  overlay.set('You where kicked!', data.msg);
  socket.disconnect();
});

var game = {
  id: null,
  me: {},
  clicks: 0,
  clock: null,
  s: socket,
  dom: {
    seeds: null,
    sps: null,
    pomegranate: null,
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
  },
  preGame: null,
  updateSeeds: function() {
    this.dom.seeds.text(Math.floor(this.me.seeds + this.clicks));
  },
  updateSPS: function() {
    this.dom.sps.text(Math.round(this.me.sps));
  },
  init: function() {
    console.log('init');

    var pId = cookieGet('pId');
    if (pId !== undefined) {
      socket.emit('hasPlayer', { id: pId });
    } else {
      this.preGame.show();
    }

    game.dom.pomegranate.click(function() {

      game.clicks++;
      game.updateSeeds();

    });

    // Initilize Clock
    game.clock = setInterval(function() {

      if(game.clicks !== 0) {
        console.log('clicked: ' + game.clicks);
        game.s.emit('click', { n: game.clicks });
        game.clicks = 0;
      }

      game.updateSeeds();

    }, 1000);

  }
};

game.preGame = {
  base: null,
  msgBox: null,
  input: null,
  playBtn: null,
  show: function() {
    this.base.addClass('show');
  },
  hide: function() {
    this.base.removeClass('show');
  },
  msg: function(type, msg) {
    this.msgBox.html(msg);
    this.msgBox.removeClass('good bad');
    if(type == 'good') this.msgBox.addClass('good'); else this.msgBox.addClass('bad');
    this.msgBox.addClass('show');
  },
  msgHide: function() {
    this.msgBox.html('');
    this.msgBox.removeClass('show good bad');
  }
};

var overlay = {
  base: null,
  title: null,
  msg: null,
  closeBtn: null,
  set: function(t,m) {
    this.title.html(t);
    this.msg.html(m);
    this.show();
  },
  show: function() {
    this.base.addClass('show');
  },
  hide: function() {
    this.base.removeClass('show');
  }
};

$(document).ready(function() {

  // Game DOM Initialization
  game.dom.seeds = $('#seedCounter');
  game.dom.sps = $('#spsCounter');
  $.each(game.dom.upgrades, function(key, val) {
    game.dom.upgrades[key].base = $('#' + key);
    game.dom.upgrades[key].lvl = $('#' + key + ' > .lvl');
    game.dom.upgrades[key].cost = $('#' + key + ' > .cost');
  });
  game.dom.pomegranate = $('#pomegranate');

  // PreGame DOM Initialization
  game.preGame.base = $('.preGame');
  game.preGame.msgBox = $('.preGame > .menuBox > .msgBox');
  game.preGame.input = $('#pNameIn');
  game.preGame.playBtn = $('#playBtn');

  game.preGame.playBtn.click(function() {
    socket.emit('userCreate', { name: game.preGame.input.val() });
  });

  // Overlay DOM Initialization
  overlay.base = $('.overlay');
  overlay.title = overlay.base.find('.title');
  overlay.msg = overlay.base.find('.msg');
  overlay.closeBtn = overlay.base.find('.closeBtn');

  overlay.base.click(function(e) {
    if(e.target == this) // Prevent children form triggering the click event
        overlay.hide();
  });

  overlay.closeBtn.click(function() {
    overlay.hide();
  });

  // Game Initialization
  game.init();

});

function cookieGet(id) {
  var allCookies = document.cookie.replace(/ /g,'');
  var cookies = allCookies.split(';');
  var cParts = {};
  for (var c in cookies) {
    var cSplit = cookies[c].split('=');
    cParts[cSplit[0]] = cSplit[1];
  }
  return cParts[id];
}



})(); // END anonymous function
