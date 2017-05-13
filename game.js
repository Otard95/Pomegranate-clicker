/*
 * Main Game Controller module
 */

var game = {
  players: {},
  gdChar: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
           'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
           'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
           'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '_', '-', '%', '&', '?'],
  upgrades: {
    deseeder: {
      sps: 1,
      lvlMult: 0.1,
      cost: 10,
      costMult: 0.5
    },
    backyardShrub: {
      sps: 5,
      lvlMult: 0.2,
      cost: 50,
      costMult: 0.8
    },
    backyardTree: {
      sps: 10,
      lvlMult: 0.2,
      cost: 100,
      costMult: 0.8
    }
  },
  newPlayer: function(id, newName) {
    if(game.playerNameTaken(newName)) return false;
    var self = {
      name: newName,
      lastClick: 0,
      seeds: 0,
      sps: 0,
      accumulated: 0,
      upgrades: {
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
          /*          ( the upgraded base sps    *  players upgrade count )
                    + ( the upgraded base sps    *  ( the upgrades lvl multiplyer  *  players upgrade count ))
          */
          this.sps += (game.upgrades[upgrade].sps * this.upgrades[upgrade].lvl) +
                      (game.upgrades[upgrade].sps * (game.upgrades[upgrade].lvlMult * this.upgrades[upgrade].lvl));
        }
      },
      getStriped: function() {
        var r = {
          name: this.name,
          seeds: Math.round(this.seeds),
          sps: Math.round(this.sps),
          upgrades: this.upgrades
        };
        return r;
      },
      addSeeds: function(n) {
        if (n > 45) return false;
        this.accumulated += n;
        this.seeds += n;
        return true;
      },
      buyUpgrade: function(name) {
        if ( this.upgrades[name] === null ) return false;
        if ( this.upgrades[name].cost > this.seeds ) return false;

        this.seeds -= this.upgrades[name].cost; // subtract cost from seeds
        this.upgrades[name].lvl++; // increment lvl
        // update upgradecost
        this.upgrades[name].cost = game.getUpgradeCost(name, this.upgrades[name].lvl);

        return true;
      }
    }; // ### END 'var self'

    this.players[id] = self;
    return true;
  }
};

module.exports = game;
