/*
 * Upgrade class | the shell of any Upgrade
 */

var upgrade = class Upgrade {

  constructor(name, sps, wm, wf, bc, ex) {
    this.name = name;
    this.sps = sps; // seeds per second
    this.wm = wm; // wave magnitude
    this.wf = wf; // wave frequency
    this.bc = bc; // base cost
    this.ex = ex; // exponential growth
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

  getCost(l) { // l == level == x | (bc-1) + wm*sin(wf*x) + (bc*0.8)*x + x^(ex*x)
    return (this.bc - 1) +
           (this.wm * Math.sin(this.wf * l)) +
           ((this.bc * 0.8) * l) +
           Math.pow(l, this.ex * l);
  }

  getSps(l) { // l == level == x | -1 + (wm/2)sin((wf*0.831)*x) + (sps*2)x + x^(ex*x)
    var r = -1 + ((this.wm / 2) * Math.sin((this.wf * -0.831) * l)) +
            ((this.sps * 2) * l) + Math.pow(l, this.ex * l);
    return r < 0 ? 0 : r;
  }

};

module.exports = upgrade;
