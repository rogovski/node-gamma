'use strict';

const { ssmParameter } = require('./ssm-parameter');
const { secretsManagerParameter } = require('./secrets-manager-parameter');

module.exports = {
  ssmParameter,
  secretsManagerParameter
};
