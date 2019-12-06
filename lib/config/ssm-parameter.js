'use strict';

const parameter = require('./parameter');

function ssmParameter(props) {
  return new parameter.Parameter(props);
}

module.exports = { ssmParameter };
