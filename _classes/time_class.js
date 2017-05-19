/*
 * ###
 */

var time = class Time {
  constructor() {
    this.last = +new Date();
  }

  delta() { // Returns the time in seconds since last frame
    var r = ((+new Date()) - this.last) / 1000;
    this.last = +new Date();
    return r;
  }

  since(t) {
    return this.now() - t;
  }

  now() {
    return (+new Date());
  }

};

module.exports = time;
