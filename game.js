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
    deseeder: {
      sps: 1,
      lvlMult: 1.01,
      cost: 10,
      costMult: 1.05
    },
    backyardShrub: {
      sps: 5,
      lvlMult: 1.02,
      cost: 50,
      costMult: 1.08
    },
    backyardTree: {
      sps: 10,
      lvlMult: 1.02,
      cost: 100,
      costMult: 1.08
    }
  },
  newPlayer: function(id, newName) {
    if(game.playerNameTaken(newName)) return false;
    var self = {
      name: newName,
      seeds: 0,
      sps: 0,
      updrages: {
        deseeder: {
          lvl: 0,
          cost: game.getUpgradeCost('deseeder', 0)
        },
        backyardShrub: {
          lvl: 0,
          cost: game.getUpgradeCost('backyardShrub', 0)
        },
        backyardTree: {
          lvl: 0,
          cost: game.getUpgradeCost('backyardTree', 0)
        }
      },
      updateSeeds: function(delta) {
        this.updateSPS();
        this.seeds += sps * delta;
      },
      updateSPS: function() {
        this.sps = 0;
        for (var upgrade in this.upgrades) {
          //          ( the upgraded base sps    *  players upgrade count ) * ( the upgrades lvl multiplyer   *  players upgrade count )
          this.sps += (game.upgrades[upgrade].sps * this.upgrades[upgrade]) * (game.upgrades[upgrade].lvlMult * this.upgrades[upgrade]);
        }
      },
      getStriped: function() {
        var r = {
          name: this.name,
          seeds: Math.round(this.seeds),
          sps: this.sps,
          updrages: this.updrages
        }
        return r;
      }
    } // ### END 'var self'

    this.players[id] = self;
    return true;
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
  },
  getUpgradeCost: function(name, lvl) {

  }
}

module.exports = game;
