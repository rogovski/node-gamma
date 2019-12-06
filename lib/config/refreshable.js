'use strict';

class Refreshable {
  constructor(maxAge) {
    this.maxAge = maxAge;
  }

  refresh() {
    this.refreshParameter();
    this.updateLastRefreshTime();
  }

  updateLastRefreshTime() {
    this.lastRefreshTime = Date.now();
  }

  isExpired() {
    if (!this.maxAge)
      return false;
    if (!this.lastRefreshTime)
      return true;
    return Date.now() > this.lastRefreshTime + this.maxAge;
  }
}

module.exports = { Refreshable };
