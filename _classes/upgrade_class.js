/*
 * Upgrade class | the shell of any Upgrade
 */

var upgrade = class Upgrade {

  constructor(name, sps, lvlMult, cost, costMult) {
    this.name = name;
    this.sps = sps; // seeds per second
    this.lvlMult = lvlMult; // sps increase per lvl
    this.cost = cost;
    this.costMult = costMult; // cost increase per lvl
  }

  getAt(l) {
    var r = {
      name: this.name,
      lvl: l,
      cost: this.getCost(l),
      sps: this.getSps(l)
    };
    return r;
  }

  getCost(l) {
    return this.cost + (this.cost * (this.costMult * l));
  }

  getSps(l) {
    var r = this.sps * l + (this.sps * (this.lvlMult * (l-1)));
    return r < 0 ? 0 : r;
  }

};

module.exports = upgrade;
