'use strict';

/**
 * Require
 */
const winston = require('winston');
const {
  combine,
  timestamp,
  prettyPrint,
  json
} = winston.format;

/**
 * instantiate external transports object so we can
 * set log level
 */
const transports = {
  console: new winston.transports.Console()
};

/**
 * logger object
 *
 * @type {object}
 */
const log = new winston.createLogger({
  format: combine(
    timestamp(),
    prettyPrint(),
    json()
  ),
  transports: [ transports.console ]
});

/**
 * sets the log level
 *
 * @param {string} level the log level
 */
const setLogLevel = (level = 'info') => {
  transports.console.level = level;
};

/**
 * Exports
 */
module.exports = {
  log,
  setLogLevel
};
