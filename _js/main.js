/*
 * ### Wrap it all in an anonymous function
 */

(function(){

/*
 *¨Initilize socket.io
 */

var socket = io();

socket.on('hasPlayer', function(data) {

  // console.log('[on.hasPlayer] status: ' + data.status);

  if(data.status) {

    // Start game
    game.id = cookie.get('pId');
    game.me = data.player;

    // update UI
    game.updateUI();

    //// console.log(game);

  } else {

    game.preGame.show();
    cookie.remove('pId');

    if(data.err) {
      overlay.set(data.title, data.msg);
    }

  }

});

socket.on('userCreate', function(data) { // server response to userCreate

  // console.log('[userCreate] status: ' + data.status);

  if (data.status) {

    game.id = data.id;
    game.me = data.player;
    var d = new Date(); // create new date
    d.setTime(d.getTime() + (30*24*60*60*1000)); // set date 30 days from now
    var expires = "expires="+ d.toUTCString(); // create the expiration cookie
    document.cookie = "pId=" + data.id + ";" + expires + ";path=/"; // set the player id cookie
    game.preGame.hide();

    // update UI
    game.updateUI();

  } else if(data.err) {

    game.preGame.msg('bad', data.msg);

  }

});

socket.on('buyUpgrade', function(data) {

  // console.log('[buyUpgrade] status: ' + data.status);

  if (data.status) {
    game.me = data.player;

    game.updateUI();

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

socket.on('update', function(data) {
  game.me = data.player;
});

var game = {
  id: null,
  me: {},
  clicks: 0,
  clock: null,
  draw: null,
  time: new Time(),
  s: socket,
  dom: {
    seeds: null,
    sps: null,
    pomegranate: null,
    updrades: {
      deseeder: {
        base: null,
        title: null,
        lvl: null,
        sps: null,
        cost: null,
        buy: null
      },
      backyardShrub: {
        base: null,
        title: null,
        lvl: null,
        sps: null,
        cost: null,
        buy: null
      },
      backyardTree: {
        base: null,
        title: null,
        lvl: null,
        sps: null,
        cost: null,
        buy: null
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
  updateUpgrades: function() {
    $.each(game.dom.updrades, function(key, val) {
      val.title.text(game.me.upgrades[key].name);
      val.lvl.text(game.me.upgrades[key].lvl);
      val.sps.text(Math.round(game.me.upgrades[key].sps));
      val.cost.text(Math.ceil(game.me.upgrades[key].cost));
    });
  },
  updateUI: function() {
    game.updateUpgrades();
    game.updateSPS();
    game.updateSeeds();
  },
  init: function() {
    // console.log('init');

    var pId = cookie.get('pId');
    if (pId !== undefined) {
      socket.emit('hasPlayer', { id: pId });
    } else {
      this.preGame.show();
    }

    game.dom.pomegranate.click(function() {

      game.clicks++;
      game.updateSeeds();

    });

    $.each(game.dom.updrades, function(key, val) {
      val.buy.click(function() {
        // console.log(key);
        game.s.emit('buyUpgrade', { name: key });
      });
    });

    // Initilize Clock
    game.clock = setInterval(function() {

      if(game.clicks !== 0) {
        // // console.log('clicked: ' + game.clicks);
        game.s.emit('click', { n: game.clicks });
        game.clicks = 0;
      }

      game.updateSeeds();

    }, 1000);

    // Create draw loop
    game.draw = setInterval(function() {

      game.me.seeds += game.me.sps * game.time.delta();
      game.updateSeeds();

    }, 1000/30);

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
  $.each(game.dom.updrades, function(key, val) {
    val.base = $('#' + key);
    val.title = val.base.find('.title');
    val.lvl = val.base.find('.lvl');
    val.sps = val.base.find('.sps');
    val.cost = val.base.find('.cost');
    val.buy = val.base.find('.buyBtn');
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

function Time() {
  this.last = +new Date();

  this.delta = function() { // Returns the time in seconds since last request
    var r = ((+new Date()) - this.last) / 1000;
    this.last = +new Date();
    return r;
  };

  this.since = function(t) {
    var now = (+new Date());
    return now - t;
  };

  this.now = function() {
    return (+new Date());
  };

}

var cookie = {
  get: function(id) {
    var allCookies = document.cookie.replace(/ /g,'');
    var cookies = allCookies.split(';');
    var cParts = {};
    for (var c in cookies) {
      var cSplit = cookies[c].split('=');
      cParts[cSplit[0]] = cSplit[1];
    }
    return cParts[id];
  },
  remove: function(id) {
    document.cookie = 'pId=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
  }
};



})(); // END anonymous function
