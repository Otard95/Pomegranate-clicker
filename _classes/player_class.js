/*
 * Player class | the shell of any player
 */

var player = class Player {

  constructor(name, upgrades) {
    this.name = name;
    this.lastClick = 0;
    this.seeds = 0;
    this.sps = 0;
    this.accumulated = 0;
    this.upgrades = upgrades;
  }

  updateSeeds(delta) {
    this.seeds += sps * delta;
  }

  updateSPS() {
    this.sps = 0;
    for (var u in this.upgrades) {
      this.sps += this.upgrades[u].sps;
    }
  }

  getStriped() {
    var r = {
      name: this.name,
      seeds: this.seeds,
      sps: this.sps,
      upgrades: this.upgrades
    };
    return r;
  }

  addSeeds(n) {
    if (n > 45) return false;
    this.accumulated += n;
    this.seeds += n;
    return true;
  }

  buyUpgrade(upg) {
    if ( this.upgrades[upg].cost > this.seeds )
      return false; // the player can't aford the upgrade

    // player can aford upgrade
    this.seeds -= this.upgrades[upg].cost; // subtract cost from seeds

    return true; // the game object handles the rest
  }

  getUpgradeLvl(upg) {
    return this.upgrades[upg].lvl;
  }

  setUpgrade(upg, obj) {
    this.upgrades[upg] = obj;
    this.updateSPS();
  }

};

module.exports = player;
