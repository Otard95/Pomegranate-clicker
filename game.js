/*
 * Main Game Controller module
 */

var game = {
  players: {},
  gdChar: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
           'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
           'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
           'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '_', '-', '%', '&', '?'],
  updrages: {
    deSeeder: 0,
    backyardShrub: 0,
    backyardTree: 0
  },
  newPlayer: function(id, newName) {
    if(game.playerNameTaken(newName)) return false;
    var self = {
      name: newName,
      seeds: 0,
      sps: 0,
      updrages: {
        deseeder: 0,
        backyardShrub: 0,
        backyardTree: 0
      },
      updateSPS: function() {
        this.sps = 0;
        for (var upgrade in this.upgrades) {
          this.sps += game.upgrades[upgrade].sps * this.upgrades[upgrade];
        }
      },
      getStriped: function() {
        var r = {
          name: this.name,
          seeds: this.seeds,
          sps: this.sps,
          updrages: this.updrages
        }
        return r;
      }
    } // ### END 'var self'

    this.players[id] = self;
  },
  newId: function() { // example: _NLFk0yege0-O0_OAAAB
    var r = '';
    while(r.length < 10) {
      r += this.gdChar[Math.floor(Math.random() * this.gdChar.length)];
    }
    return r;
  },
  playerNameTaken(n) {
    for (var p in this.players) {
      if(this.players[p].name == n) return true;
    }
    return false;
  }
}

module.exports = game;
