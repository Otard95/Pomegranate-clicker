/*
 * Main Game Controller module
 */

 var Player = require('./player_class.js');
 var Upgrade = require('./upgrade_class.js');

var game = class Game {

  constructor(idl) {
    this.id_length = idl;
    this.players = {};
    this.gdChar = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
                   'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                   'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
                   'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '_', '-', '%', '&', '?'];
    this.upgrades = {};
    this.upgrades.deseeder = new Upgrade('Deseeder', 1, 0.1, 10, 0.5);
    this.upgrades.backyardShrub = new Upgrade('Backyard shrub', 5, 0.2, 50, 0.8);
    this.upgrades.backyardTree = new Upgrade('Backyard tree', 10, 0.2, 100, 0.8);
  }

  update(d) {
    for(var p in this.players) {
      this.players[p].update(d);
    }
  }

  playerNameTaken(n) {
    for (var p in this.players) {
      if (this.players[p].name == n) return true;
    }
    return false;
  }

  newPlayer(id, newName) {

    if ( this.playerNameTaken(newName) ) return false;

    this.players[id] = new Player(newName, this.getAllUpgrades());

    return true;

  }

  newId() {
    var r = '';
    while (r.length < 20) {
      r += this.gdChar[Math.floor(Math.random() * this.gdChar.length)];
    }
    return r;
  }

  getAllUpgrades() {
    var r = {};
    for (var u in this.upgrades) {
      r[u] = this.upgrades[u].getAt(0);
    }
    return r;
  }

  upgradePurchase(id, upg) {
    if (this.upgrades[upg] === undefined) return false; // upgrade doesn't exist

    if (this.players[id].buyUpgrade(upg)){
      var nextLvl = this.players[id].getUpgradeLvl(upg) + 1; // gets next lvl of upgrade
      var nextUpg = this.upgrades[upg].getAt(nextLvl); // get the upgrade stats at players upgrade lvl
      this.players[id].setUpgrade(upg, nextUpg); // sets the upgrade for the player

      return true;
    }

    return false;

  }

  removePlayer(pId) {
    delete this.players[pId];
  }

};


 module.exports = game;
